import { gameState } from "../../state.js";
import { winningCombinations } from "../winConditions.js";


export function getClassicAiMove() {
    if (gameState.difficulty === "medium") return getMediumAiMove();
    if (gameState.difficulty === "hard") return getHardAiMove();
    return getEasyAiMove();
}


function getEasyAiMove() {
    const empty = gameState.fields
        .map((field, i) => field === null ? i : null)
        .filter(i => i !== null);

    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
}


function getMediumAiMove() {
    const win = findWinningMove("circle");
    if (win !== -1) return win;

    const block = findWinningMove("cross");
    if (block !== -1) return block;

    return getEasyAiMove();
}


function getHardAiMove() {
    const fields = [...gameState.fields];
    let bestScore = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i] !== null) continue;
        fields[i] = "circle";
        const score = minimax(fields, false);
        fields[i] = null;
        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}


function minimax(fields, isMaximizing) {
    const result = evaluateBoard(fields);
    if (result !== null) return result;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] !== null) continue;
            fields[i] = "circle";
            best = Math.max(best, minimax(fields, false));
            fields[i] = null;
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] !== null) continue;
            fields[i] = "cross";
            best = Math.min(best, minimax(fields, true));
            fields[i] = null;
        }
        return best;
    }
}


function evaluateBoard(fields) {
    for (const [a, b, c] of winningCombinations) {
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return fields[a] === "circle" ? 10 : -10;
        }
    }
    if (fields.every(f => f !== null)) return 0;
    return null;
}


function findWinningMove(symbol) {
    for (const [a, b, c] of winningCombinations) {
        const fields = [gameState.fields[a], gameState.fields[b], gameState.fields[c]];
        const symbolCount = fields.filter(f => f === symbol).length;
        const emptyIndex = fields.indexOf(null);

        if (symbolCount === 2 && emptyIndex !== -1) {
            return [a, b, c][emptyIndex];
        }
    }
    return -1;
}

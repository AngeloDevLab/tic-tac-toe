import { gameState } from "../../state.js";
import { winningCombinations } from "../winConditions.js";


/**
 * Returns the AI's chosen move for the Ultimate board.
 * Returns null if no move is available.
 *
 * @returns {{boardIndex: number, cellIndex: number}|null}
 */
export function getUltimateAiMove() {
    if (gameState.difficulty === "medium") return getMediumAiMove();
    if (gameState.difficulty === "hard") return getHardAiMove();
    return getEasyAiMove();
}


// --- Easy ---

function getEasyAiMove() {
    const boards = getPlayableBoards();
    if (boards.length === 0) return null;

    const boardIndex = boards[Math.floor(Math.random() * boards.length)];
    const emptyCells = gameState.ultimateBoards[boardIndex]
        .map((cell, i) => cell === null ? i : null)
        .filter(i => i !== null);

    if (emptyCells.length === 0) return null;

    const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return { boardIndex, cellIndex };
}


// --- Medium ---

function getMediumAiMove() {
    const win = findMiniBoardWinningMove("circle");
    if (win) return win;

    const block = findMiniBoardWinningMove("cross");
    if (block) return block;

    return getEasyAiMove();
}


function findMiniBoardWinningMove(symbol) {
    for (const boardIndex of getPlayableBoards()) {
        const cellIndex = findWinningCell(gameState.ultimateBoards[boardIndex], symbol);
        if (cellIndex !== -1) return { boardIndex, cellIndex };
    }
    return null;
}


function findWinningCell(board, symbol) {
    for (const [a, b, c] of winningCombinations) {
        const cells = [board[a], board[b], board[c]];
        if (cells.filter(f => f === symbol).length === 2 && cells.indexOf(null) !== -1) {
            return [a, b, c][cells.indexOf(null)];
        }
    }
    return -1;
}


// --- Hard ---

const HARD_DEPTH = 4;

function getHardAiMove() {
    const state = buildState();
    let bestScore = -Infinity;
    let bestMove = null;

    for (const move of getMoves(state)) {
        const score = minimax(applyMove(state, move.boardIndex, move.cellIndex), HARD_DEPTH - 1, -Infinity, Infinity, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove ?? getEasyAiMove();
}


/**
 * Minimax with alpha-beta pruning for the Ultimate board.
 * AI (circle) maximizes, opponent (cross) minimizes.
 *
 * @param {object} state - Simulated board state.
 * @param {number} depth - Remaining search depth.
 * @param {number} alpha - Best score the maximizer can guarantee.
 * @param {number} beta - Best score the minimizer can guarantee.
 * @param {boolean} isMaximizing - True if it is the AI's turn.
 *
 * @returns {number} Score of the board position.
 */
function minimax(state, depth, alpha, beta, isMaximizing) {
    const winner = getGlobalWinner(state);
    if (winner === "circle") return 1000 + depth;
    if (winner === "cross") return -1000 - depth;

    const moves = getMoves(state);
    if (depth === 0 || moves.length === 0) return evaluate(state);

    if (isMaximizing) {
        let best = -Infinity;
        for (const { boardIndex, cellIndex } of moves) {
            best = Math.max(best, minimax(applyMove(state, boardIndex, cellIndex), depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
        return best;
    } else {
        let best = Infinity;
        for (const { boardIndex, cellIndex } of moves) {
            best = Math.min(best, minimax(applyMove(state, boardIndex, cellIndex), depth - 1, alpha, beta, true));
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }
        return best;
    }
}


function buildState() {
    return {
        boards: gameState.ultimateBoards.map(b => [...b]),
        boardWinners: [...gameState.ultimateBoardWinners],
        activeBoardIndex: gameState.activeBoardIndex,
        currentPlayer: "circle"
    };
}


function getMoves(state) {
    const playable = state.activeBoardIndex !== null
        ? [state.activeBoardIndex]
        : state.boardWinners.map((w, i) => w === null ? i : null).filter(i => i !== null);

    const moves = [];
    for (const boardIndex of playable) {
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            if (state.boards[boardIndex][cellIndex] === null) {
                moves.push({ boardIndex, cellIndex });
            }
        }
    }
    return moves;
}


function applyMove(state, boardIndex, cellIndex) {
    const boards = state.boards.map(b => [...b]);
    const boardWinners = [...state.boardWinners];

    boards[boardIndex][cellIndex] = state.currentPlayer;
    boardWinners[boardIndex] = checkMiniBoard(boards[boardIndex]);

    return {
        boards,
        boardWinners,
        activeBoardIndex: boardWinners[cellIndex] !== null ? null : cellIndex,
        currentPlayer: state.currentPlayer === "circle" ? "cross" : "circle"
    };
}


function checkMiniBoard(board) {
    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(c => c !== null)) return "draw";
    return null;
}


function getGlobalWinner(state) {
    for (const [a, b, c] of winningCombinations) {
        const w = state.boardWinners[a];
        if (w && w !== "draw" && w === state.boardWinners[b] && w === state.boardWinners[c]) return w;
    }
    return null;
}


/**
 * Heuristic evaluation of a board state.
 * Scores global board lines weighted higher than individual cell lines.
 *
 * @param {object} state - Simulated board state.
 *
 * @returns {number} Positive scores favor the AI, negative favor the opponent.
 */
function evaluate(state) {
    let score = 0;

    for (const [a, b, c] of winningCombinations) {
        score += scoreLine([state.boardWinners[a], state.boardWinners[b], state.boardWinners[c]], 10);
    }

    for (let i = 0; i < 9; i++) {
        if (state.boardWinners[i] !== null) continue;
        for (const [a, b, c] of winningCombinations) {
            score += scoreLine([state.boards[i][a], state.boards[i][b], state.boards[i][c]], 1);
        }
    }

    return score;
}


/**
 * Scores a single line of three cells for the heuristic evaluation.
 *
 * @param {Array<string|null>} cells - Three cell values.
 * @param {number} weight - Multiplier for this line's importance.
 *
 * @returns {number} Score contribution of this line.
 */
function scoreLine(cells, weight) {
    const ai = cells.filter(c => c === "circle").length;
    const opp = cells.filter(c => c === "cross").length;
    if (ai > 0 && opp > 0) return 0;
    if (ai === 2) return 3 * weight;
    if (ai === 1) return weight;
    if (opp === 2) return -3 * weight;
    if (opp === 1) return -weight;
    return 0;
}


function getPlayableBoards() {
    if (gameState.activeBoardIndex !== null) return [gameState.activeBoardIndex];
    return gameState.ultimateBoardWinners
        .map((winner, i) => winner === null ? i : null)
        .filter(i => i !== null);
}

# TODO

## Phase 1 — Classic MVP V0.1.0

### Core Gameplay
- [x] Render classic board
- [x] Add player turns
- [x] Add move validation
- [x] Add winner detection
- [x] Add draw detection
- [x] Add restart game

### UI & UX V0.2.0
- [x] Create header
- [x] Create footer
- [x] Add navigation flow
- [x] Add loading screen
- [x] Add screen transitions
- [x] Add help modal
- [x] Add back button flow
- [x] Improve setup layout
- [x] Improve game layout
- [x] Improve responsive design
- [x] Polish button system
- [ ] Add winner animations

### Architecture
- [ ] Reorganize file naming
- [ ] Improve render structure
- [ ] Improve state structure
- [ ] Clean template structure
- [ ] Add JSDoc documentation

---

## Phase 2 — Internationalization (i18n) V0.3.0

### Translation Foundation
- [x] Create i18n folder structure
- [x] Create language files (de / en)
- [x] Add translation helper (`translate()`)
- [x] Add missing-key fallback

### State Integration
- [x] Add language state
- [x] Detect browser language
- [x] Add persistence via localStorage

### UI Migration
- [x] Translate landing screen
- [x] Translate setup screen
- [x] Translate game screen
- [x] Translate help modal
- [x] Translate loading screen

### UX
- [x] Add language switch
- [x] Add rerender on language change

### Validation
- [x] Test missing translations
- [x] Verify persistence
- [x] Verify mobile layout

---

## Phase 3 — Match Configuration V0.4.0

### Match Setup
- [x] Add player configuration
- [x] Add dynamic setup sections
- [x] Add player name inputs
- [x] Add player defaults

### Gameplay UI
- [x] Replace turn indicator
- [x] Add player overview panels
- [x] Show player names
- [x] Highlight active player

### Match Flow
- [ ] Add starter selection animation
- [ ] Randomize first starter
- [ ] Preserve starter on draw
- [ ] Show starter announcement
- [ ] Start next round with previous loser

### UX
- [ ] Extend help modal
- [ ] Add input validation

---

## Phase 4 — Singleplayer  V0.5.0

### Easy 
- [ ] Create random AI
- [ ] Add AI turn flow

### Medium
- [ ] Add move evaluation
- [ ] Add win blocking

### Hard V0.5.0
- [ ] Implement minimax

---

## Phase 5 — Ultimate Tic Tac Toe V0.6.0

### Core System
- [ ] Create nested board state
- [ ] Render ultimate board
- [ ] Add active board rules
- [ ] Add local ultimate gameplay

### Game Logic
- [ ] Add mini-board winner detection
- [ ] Add global winner detection
- [ ] Update restart flow

### Modes V0.7.0
- [ ] Add ultimate singleplayer

---

## Phase 6 — Online Multiplayer V0.8.0

### Foundation
- [ ] Evaluate backend solution
- [ ] Create multiplayer architecture

### Gameplay
- [ ] Create room system
- [ ] Add invite code system
- [ ] Sync game state
- [ ] Handle reconnects

### Expansion
- [ ] Add ultimate multiplayer
- [ ] Add online state recovery

---

## Phase 7 — Polish & Expansion V0.9.0

### Experience
- [ ] Add sound effects
- [ ] Add themes
- [ ] Add statistics
- [ ] Add match history
- [ ] Add replay system

### Long Term
- [ ] Add ranked mode
- [ ] Add achievements
- [ ] Add settings screen
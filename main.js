import { createInitialState } from './js/state.js';
import { Game } from './js/game.js';

const state = createInitialState();
const game = new Game(state);
game.start();
window.cityGame = game;

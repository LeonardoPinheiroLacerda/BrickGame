import * as P5 from 'p5';
import { PARENT_SELECTOR } from './constants';

import GameBody from './engine/body/GameBody';
import Game from './engine/Game';

import './importResources';
import Tetris from './games/tetris/Tetris';

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    const body: GameBody = new GameBody({
        parent: parentElement,
        p,
    });

    let game: Game;

    p.setup = () => {
        const { canvasWidth, canvasHeight } = body.build();
        game = new Tetris({ p, canvasWidth, canvasHeight, body });
        body.bound(game);
    };

    p.draw = () => {
        game.drawFrame();
    };
}, document.body);

import * as P5 from 'p5';
import { PARENT_SELECTOR } from './constants';

import Body from './body/Body';
import GameMenu from './game/GameMenu';
import Game from './game/Game';

import './importResources';

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    const body: Body = new Body({
        parent: parentElement,
        p,
    });

    let game: Game;

    p.setup = () => {
        const { canvasWidth, canvasHeight } = body.build();
        game = new GameMenu({ p, canvasWidth, canvasHeight, body });
        body.bound(game);
    };

    p.draw = () => {
        game.drawFrame();
    };
}, document.body);

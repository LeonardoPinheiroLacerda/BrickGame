import * as P5 from 'p5';
import { PARENT_SELECTOR, BACKGROUND_COLOR, DISPLAY_MARGIN, DISPLAY_WIDTH } from './constants';

import Body from './body/Body';
import Menu from './game/impl/menu/Menu';
import Game from './game/Game';

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    const body = new Body({
        parent: parentElement,
        p,
    });

    let game: Game;

    p.preload = () => {
       
    };

    p.setup = () => {
        const { canvasWidth, canvasHeight, container } = body.build();

        game = new Menu({ p, canvasWidth, canvasHeight });
    };

    p.draw = () => {
        game.draw();
    };
}, document.body);

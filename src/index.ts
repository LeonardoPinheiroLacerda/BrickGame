import * as P5 from 'p5';
import { PARENT_SELECTOR, BACKGROUND_COLOR } from './constants';

import Body from './Body';

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    const body = new Body({
        parent: parentElement,
        p,
    });

    p.setup = () => {
        body.build();

        const canvas = p.createCanvas(200, 200);
        canvas.parent(PARENT_SELECTOR);
        canvas.id('brick-game-canvas');
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
    };
}, document.body);

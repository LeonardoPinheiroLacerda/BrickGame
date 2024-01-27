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
        const { canvasWidth, canvasHeight } = body.build();

        p.background(BACKGROUND_COLOR);
        p.noFill();
        p.strokeWeight(3);
        p.rect(1.5, 1.5, canvasWidth - 3, canvasHeight - 3);
    };
}, document.body);

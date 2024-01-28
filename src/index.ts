import * as P5 from 'p5';
import { PARENT_SELECTOR, BACKGROUND_COLOR } from './constants';

import Body from './body/Body';

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    const body = new Body({
        parent: parentElement,
        p,
    });

    p.setup = () => {
        const { canvasWidth, canvasHeight, container } = body.build();

        p.background(BACKGROUND_COLOR);
    };
}, document.body);

import * as P5 from 'p5';
import * as constants from './constants';

export const sketch = (p: P5) => {
    p.setup = () => {
        p.createCanvas(465, 494);
    };

    p.draw = () => {
        p.background(constants.BACKGROUND_COLOR);
    };
};

export const myp5 = new P5(sketch, document.body);

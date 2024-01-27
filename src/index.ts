import * as P5 from 'p5';

export const sketch = (p: P5) => {
    p.setup = () => {
        p.createCanvas(400, 400);
    }

    p.draw = () => {
        p.background(220);

        p.square(100, 100, 200, 30)

    }
}

export const myp5 = new P5(sketch, document.body);
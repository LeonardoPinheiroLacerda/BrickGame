import * as P5 from 'p5';
import BodyElements from './BodyElements';

interface BodyProps {
    parent: Element;
    p: P5;
}

export default class Body {
    elements: BodyElements;

    constructor(props: BodyProps) {
        this.elements = new BodyElements({
            p: props.p,
            parent: props.parent,
        });
    }

    build() {
        //Container
        const container = this.elements.createContainer();

        //Canvas
        const { canvasWidth, canvasHeight } = this.elements.createCanvas(container);

        //Frame
        this.elements.createFrame(container);

        return { canvasWidth, canvasHeight };
    }
}

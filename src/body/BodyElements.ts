import * as P5 from 'p5';
import {
    PARENT_SELECTOR,
    BODY_HEIGHT_WIDTH_MULTIPLIER,
    BODY_PARENT_MARGIN,
    BODY_MAIN_COLOR,
    BODY_SHADOW,
    BODY_REFLECTION,
    BODY_BUTTON_COLOR,
    BODY_BUTTON_REFLECTION,
} from '../constants';

interface BodyElementsProps {
    parent: Element;
    p: P5;
}

export default class BodyElements {
    width: number;
    height: number;
    parent: Element;
    p: P5;

    constructor(props: BodyElementsProps) {
        this.parent = props.parent;
        this.p = props.p;
    }

    createContainer() {
        const container = this.p.createDiv();
        container.parent(PARENT_SELECTOR);
        container.id('container');

        this.width = this.parent.clientWidth - BODY_PARENT_MARGIN * 2;
        this.height = this.width * BODY_HEIGHT_WIDTH_MULTIPLIER;

        container.style('width', `${this.width}px`);
        container.style('height', `${this.height}px`);

        container.style('background-color', BODY_MAIN_COLOR);
        container.style('border-radius', `${this.width * 0.05}px`);
        container.style('box-sizing', 'border-box');
        container.style('margin', 'auto');
        container.style('position', 'relative');

        container.style('border', `${this.width * 0.0075}px solid black`);

        return container;
    }

    createCanvas(container: P5.Element) {
        const canvasWidth = this.width * 0.7;
        const canvasHeight = canvasWidth * 1.15;

        const canvas = this.p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(container);

        canvas.id('brick-game-canvas');

        canvas.style('position', 'absolute');
        canvas.style('top', '7.5%');
        canvas.style('left', '15%');

        return { canvasWidth, canvasHeight };
    }

    createFrame(container: P5.Element) {
        const frame = this.p.createDiv();
        frame.parent(container);

        frame.style('border', `${this.width * 0.0075}px solid black`);
        frame.style('position', 'absolute');
        frame.style('top', '3.75%');
        frame.style('left', '7.5%');
        frame.style('border-radius', `${this.width * 0.05}px`);
        frame.style('width', `${this.width * 0.85}px`);
        frame.style('height', `${this.width * 0.7 * 1.35}px`);

        const p = this.p.createP('Brick Game');
        p.parent(frame);

        p.style('position', 'absolute');
        p.style('top', `-${this.width * 0.035}px`);
        p.style('left', '30%');

        p.style('width', '40%');
        p.style('text-align', 'center');

        p.style('font-family', 'retro-gamming');
        p.style('font-size', `${this.width * 0.07}px`);

        p.style('background-color', BODY_MAIN_COLOR);
        p.style('padding-right', `${this.width * 0.01}px`);
        p.style('padding-left', `${this.width * 0.01}px`);
    }
}

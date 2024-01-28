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

interface Coordinates {
    x: number;
    y: number;
}

export default class BodyElements {
    width: number;
    height: number;
    parent: Element;
    p: P5;

    constructor(props: BodyElementsProps) {
        this.parent = props.parent;
        this.p = props.p;

        const root: HTMLElement = document.querySelector(':root');
        root.style.setProperty('--BODY_SHADOW', BODY_SHADOW);
        root.style.setProperty('--BODY_REFLECTION', BODY_REFLECTION);
        root.style.setProperty('--BODY_BUTTON_REFLECTION', BODY_BUTTON_REFLECTION);
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

        container.style('border', `${this.width * 0.006}px solid black`);

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

        frame.style('border', `${this.width * 0.006}px solid black`);
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
        p.style('font-weight', 'bold');
        p.style('font-size', `${this.width * 0.07}px`);

        p.style('background-color', BODY_MAIN_COLOR);
        p.style('padding-right', `${this.width * 0.01}px`);
        p.style('padding-left', `${this.width * 0.01}px`);
    }

    createSmallButton(container: P5.Element, label: string, coordinates: Coordinates) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);

        buttonContainer.style('position', 'absolute');
        buttonContainer.style('top', `${this.height * coordinates.y}px`);
        buttonContainer.style('left', `${this.width * coordinates.x}px`);

        buttonContainer.style('display', 'flex');
        buttonContainer.style('flex-direction', 'column');
        buttonContainer.style('justify-content', 'center');
        buttonContainer.style('align-items', 'center');

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);

        button.style('outline', 'none');

        button.style('width', `${this.width * 0.08}px`);
        button.style('height', `${this.width * 0.08}px`);

        button.style('border-radius', '50%');
        button.style('border', `${this.width * 0.0045}px solid black`);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', '0.15s');

        button.style('background-color', BODY_BUTTON_COLOR);

        //Label
        const p = this.p.createP(label);
        p.parent(buttonContainer);

        p.style('font-family', 'retro-gamming');
        p.style('color', 'white');
        p.style('text-align', 'center');

        p.style('user-select', 'none');

        p.style('font-size', `${this.width * 0.03}px`);

        p.style('width', `${this.width * 0.08}px`);
        p.style('margin-top', `${this.width * 0.01}px`);

        return button;
    }

    createButton(container: P5.Element, label: string, coordinates: Coordinates) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);

        buttonContainer.style('position', 'absolute');
        buttonContainer.style('top', `${this.height * coordinates.y}px`);
        buttonContainer.style('left', `${this.width * coordinates.x}px`);

        buttonContainer.style('display', 'flex');
        buttonContainer.style('flex-direction', 'column');
        buttonContainer.style('justify-content', 'center');
        buttonContainer.style('align-items', 'center');

        //Label
        const p = this.p.createP(label);
        p.parent(buttonContainer);

        p.style('font-family', 'retro-gamming');
        p.style('color', 'white');
        p.style('text-align', 'center');

        p.style('user-select', 'none');
        p.style('font-weight', 'bold');

        p.style('font-size', `${this.width * 0.04}px`);

        p.style('margin-bottom', `${this.width * 0.015}px`);

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);

        button.style('outline', 'none');

        button.style('width', `${this.width * 0.16}px`);
        button.style('height', `${this.width * 0.16}px`);

        button.style('border-radius', '50%');
        button.style('border', `${this.width * 0.0045}px solid black`);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', '0.15s');

        button.style('background-color', BODY_BUTTON_COLOR);

        return button;
    }

    createBigButton(container: P5.Element, label: string, coordinates: Coordinates) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);

        buttonContainer.style('position', 'absolute');
        buttonContainer.style('top', `${this.height * coordinates.y}px`);
        buttonContainer.style('left', `${this.width * coordinates.x}px`);

        buttonContainer.style('display', 'flex');
        buttonContainer.style('flex-direction', 'column');
        buttonContainer.style('justify-content', 'center');
        buttonContainer.style('align-items', 'center');

        //Label
        const p = this.p.createP(label);
        p.parent(buttonContainer);

        p.style('font-family', 'retro-gamming');
        p.style('color', 'white');
        p.style('text-align', 'center');

        p.style('user-select', 'none');
        p.style('font-weight', 'bold');

        p.style('font-size', `${this.width * 0.04}px`);

        p.style('margin-bottom', `${this.width * 0.015}px`);

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);

        button.style('outline', 'none');

        button.style('width', `${this.width * 0.22}px`);
        button.style('height', `${this.width * 0.22}px`);

        button.style('border-radius', '50%');
        button.style('border', `${this.width * 0.0045}px solid black`);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', '0.15s');

        button.style('background-color', BODY_BUTTON_COLOR);

        return button;
    }
}

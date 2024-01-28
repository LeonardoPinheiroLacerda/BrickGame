import * as P5 from 'p5';
import {
    PARENT_SELECTOR,
    BODY_HEIGHT_WIDTH_MULTIPLIER,
    BODY_MAIN_COLOR,
    BODY_SHADOW,
    BODY_REFLECTION,
    BODY_BUTTON_COLOR,
    BODY_BUTTON_REFLECTION,
    SHADOW_DISPERSION,
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
    private width: number;
    private height: number;
    private parent: Element;
    private p: P5;

    private border: string;
    private borderRadius: string;

    private smallButtonSize: string;
    private buttonSize: string;
    private largeButtonSize: string;

    private buttonBorder: string;
    private buttonAnimationDuration: string;

    constructor(props: BodyElementsProps) {
        this.parent = props.parent;
        this.p = props.p;
    }

    defineValues() {
        const root: HTMLElement = document.querySelector(':root');
        root.style.setProperty('--color-shadow', BODY_SHADOW);
        root.style.setProperty('--color-shadow-reflexion', BODY_REFLECTION);
        root.style.setProperty('--dispersion', SHADOW_DISPERSION);

        root.style.setProperty('--button-color-reflexion', BODY_BUTTON_REFLECTION);

        root.style.setProperty('--width', `${this.width}px`);

        this.border = `${this.width * 0.006}px solid black`;
        this.borderRadius = `${this.width * 0.05}px`;

        this.buttonBorder = `${this.width * 0.0045}px solid black`;
        this.buttonAnimationDuration = '0.15s';

        this.smallButtonSize = `${this.width * 0.08}px`;
        this.buttonSize = `${this.width * 0.16}px`;
        this.largeButtonSize = `${this.width * 0.22}px`;
    }

    createContainer() {
        const container = this.p.createDiv();
        container.parent(PARENT_SELECTOR);
        container.id('container');

        let percentage = 100;

        do {
            this.width = this.parent.clientWidth * (percentage / 100);

            if (this.width <= 300) {
                this.width *= 1.25;
            } else if (this.width <= 500) {
                this.width *= 1.1;
            }

            this.height = this.width * BODY_HEIGHT_WIDTH_MULTIPLIER;

            percentage -= 1;
        } while (this.height * 1.05 > this.parent.clientHeight);
        //TODO: encontrar uma forma melhor de fazer isso

        this.defineValues();

        container.style('width', `${this.width}px`);
        container.style('height', `${this.height}px`);

        container.style('background-color', BODY_MAIN_COLOR);
        container.style('border-radius', this.borderRadius);
        container.style('box-sizing', 'border-box');
        container.style('margin', 'auto');
        container.style('position', 'relative');

        container.style('border', this.border);

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
        canvas.style('border', this.border);

        return { canvasWidth, canvasHeight };
    }

    createFrame(container: P5.Element) {
        const frame = this.p.createDiv();
        frame.parent(container);

        frame.addClass('frame');

        frame.style('border', this.border);
        frame.style('position', 'absolute');
        frame.style('top', '3.75%');
        frame.style('left', '7.5%');
        frame.style('border-radius', this.borderRadius);
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

        button.addClass('sm-btn');

        button.style('width', this.smallButtonSize);
        button.style('height', this.smallButtonSize);

        button.style('border-radius', '50%');
        button.style('border', this.buttonBorder);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', this.buttonAnimationDuration);

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

        p.style('line-height', `${this.width * 0.03}px`);

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

        p.style('line-height', `${this.width * 0.03}px`);

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);

        button.addClass('btn');

        button.style('outline', 'none');

        button.style('width', this.buttonSize);
        button.style('height', this.buttonSize);

        button.style('border-radius', '50%');
        button.style('border', this.buttonBorder);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', this.buttonAnimationDuration);

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

        p.style('font-size', `${this.width * 0.05}px`);
        p.style('margin-bottom', `${this.width * 0.015}px`);

        p.style('line-height', `${this.width * 0.03}px`);

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);

        button.addClass('lg-btn');

        button.style('outline', 'none');

        button.style('width', this.largeButtonSize);
        button.style('height', this.largeButtonSize);

        button.style('border-radius', '50%');
        button.style('border', this.buttonBorder);

        button.style('transition-property', 'transform, box-shadow');
        button.style('transition-duration', this.buttonAnimationDuration);

        button.style('background-color', BODY_BUTTON_COLOR);

        return button;
    }
}

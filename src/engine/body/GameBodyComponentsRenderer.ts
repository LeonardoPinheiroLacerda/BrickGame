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
    BODY_BUTTON_SHADOW,
} from '../../constants';
import BodyProps from '../../interface/BodyProps';

/**
 *
 * Responsable for rendering the body elements, like: buttons, display and etc
 *
 * @class
 */

export default class BodyElements {
    private parent: Element;

    private width: number;
    private height: number;

    private canvasWidth: number;
    private canvasHeight: number;

    private p: P5;

    constructor(props: BodyProps) {
        this.parent = props.parent;
        this.p = props.p;
    }

    defineValues() {
        const root: HTMLElement = document.querySelector(':root');

        root.style.setProperty('--color-shadow', BODY_SHADOW);
        root.style.setProperty('--color-shadow-reflexion', BODY_REFLECTION);
        root.style.setProperty('--dispersion', SHADOW_DISPERSION);

        root.style.setProperty('--main-color', BODY_MAIN_COLOR);

        root.style.setProperty('--button-color', BODY_BUTTON_COLOR);
        root.style.setProperty('--button-color-reflexion', BODY_BUTTON_REFLECTION);
        root.style.setProperty('--button-color-shadow', BODY_BUTTON_SHADOW);

        root.style.setProperty('--width', `${this.width}px`);
        root.style.setProperty('--height', `${this.height}px`);

        root.style.setProperty('--canvas-width', `${this.canvasWidth}px`);
        root.style.setProperty('--canvas-height', `${this.canvasHeight}px`);

        root.style.setProperty('--border-radius', `${this.width * 0.05}px`);
        root.style.setProperty('--border', `${this.width * 0.006}px solid black`);

        root.style.setProperty('--sm-button-size', `${this.width * 0.08}px`);
        root.style.setProperty('--button-size', `${this.width * 0.18}px`);
        root.style.setProperty('--lg-button-size', `${this.width * 0.25}px`);

        root.style.setProperty('--sm-button-size-mobile', `${this.width * 0.13}px`);
        root.style.setProperty('--button-size-mobile', `${this.width * 0.26}px`);
        root.style.setProperty('--lg-button-size-mobile', `${this.width * 0.35}px`);

        root.style.setProperty('--sm-button-size-mobile-font-size', `${this.width * 0.04}px`);
        root.style.setProperty('--sm-button-size-mobile-line-height', `${this.width * 0.04}px`);

        root.style.setProperty('--button-size-mobile-font-size', `${this.width * 0.05}px`);
        root.style.setProperty('--lg-button-size-mobile-font-size', `${this.width * 0.055}px`);

        root.style.setProperty('--button-size-mobile-spacing', `${this.width * 0.018}px`);

        root.style.setProperty('--button-border', `${this.width * 0.0045}px solid black`);
        root.style.setProperty('--button-animation-duration', `0.15s`);
    }

    createContainer() {
        const container = this.p.createDiv();
        container.parent(PARENT_SELECTOR);
        container.id('container');

        if (this.parent.clientWidth <= 600) {
            this.width = this.parent.clientWidth;
            this.height = this.parent.clientHeight;

            return container;
        }

        let percentage = 100;

        do {
            this.width = this.parent.clientWidth * (percentage / 100);

            this.height = this.width * BODY_HEIGHT_WIDTH_MULTIPLIER;
            percentage -= 1;
        } while (this.height * 1.05 > this.parent.clientHeight);
        //TODO: encontrar uma forma melhor de fazer isso

        return container;
    }

    createButtonContainer(container: P5.Element) {
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);
        buttonContainer.id('button-container');

        const smallButtonContainer = this.p.createDiv();
        smallButtonContainer.parent(buttonContainer);
        smallButtonContainer.id('small-button-container');

        const innerButtonContainer = this.p.createDiv();
        innerButtonContainer.parent(buttonContainer);
        innerButtonContainer.id('inner-button-container');

        const mediumButtonContainer = this.p.createDiv();
        mediumButtonContainer.parent(innerButtonContainer);
        mediumButtonContainer.id('medium-button-container');

        const directionVerticalContainer = this.p.createDiv();
        directionVerticalContainer.parent(mediumButtonContainer);
        directionVerticalContainer.id('direction-vertical-container');

        const directionHorizontalContainer = this.p.createDiv();
        directionHorizontalContainer.parent(mediumButtonContainer);
        directionHorizontalContainer.id('direction-horizontal-container');

        const largeButtonContainer = this.p.createDiv();
        largeButtonContainer.parent(innerButtonContainer);
        largeButtonContainer.id('large-button-container');

        return { smallButtonContainer, mediumButtonContainer, largeButtonContainer, directionVerticalContainer, directionHorizontalContainer };
    }

    createCanvas(container: P5.Element) {
        this.canvasWidth = this.width * 0.7;
        this.canvasHeight = this.canvasWidth * 1.114;

        const canvas = this.p.createCanvas(this.canvasWidth, this.canvasHeight);
        canvas.parent(container);
        canvas.id('brick-game-canvas');

        //         alert(`body-width: ${document.body.clientWidth}
        // body-height: ${document.body.clientHeight}
        // container-width: ${this.width}
        // container-height: ${this.height}
        // canvas-width: ${this.canvasWidth}
        // canvas-height: ${this.canvasHeight}
        // pixel-ratio: ${window.devicePixelRatio}`);

        return { canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight };
    }

    createFrame(container: P5.Element) {
        const frame = this.p.createDiv();
        frame.parent(container);
        frame.id('frame');

        const div = this.p.createDiv();
        div.parent(frame);

        const p = this.p.createP('Brick Game');
        p.parent(div);

        return frame;
    }

    createSmallButton(container: P5.Element, label: string, top: boolean) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);
        buttonContainer.addClass('sm-btn-container');
        buttonContainer.addClass(top ? 'sm-btn-container-top' : 'sm-btn-container-bottom');

        //Button
        const button = this.p.createButton('');
        button.parent(buttonContainer);
        button.addClass('sm-btn');

        //Label
        const p = this.p.createP(label);
        p.parent(buttonContainer);
        p.addClass('sm-btn-p');

        return button;
    }

    createButton(container: P5.Element, label: string) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);
        buttonContainer.addClass('btn-container');

        //Button
        const button = this.p.createButton(label);
        button.parent(buttonContainer);
        button.addClass('btn');

        //Label
        // const p = this.p.createP(label);
        // p.parent(buttonContainer);
        // p.addClass('btn-p');

        return button;
    }

    createBigButton(container: P5.Element, label: string) {
        //Container
        const buttonContainer = this.p.createDiv();
        buttonContainer.parent(container);
        buttonContainer.addClass('lg-btn-container');

        // //Label
        // const p = this.p.createP(label);
        // p.parent(buttonContainer);
        // p.addClass('lg-btn-p');

        //Button
        const button = this.p.createButton(label);
        button.parent(buttonContainer);
        button.addClass('lg-btn');

        return button;
    }
}

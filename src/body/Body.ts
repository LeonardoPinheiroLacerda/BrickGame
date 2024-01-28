import * as P5 from 'p5';
import BodyElements from './BodyElements';

interface BodyProps {
    parent: Element;
    p: P5;
}

export default class Body {
    private elements: BodyElements;

    private onOffBtn: P5.Element;
    private startPauseBtn: P5.Element;
    private soundBtn: P5.Element;
    private resetBtn: P5.Element;
    private exitBtn: P5.Element;
    private enableColorBtn: P5.Element;

    private upBtn: P5.Element;
    private downBtn: P5.Element;
    private rightBtn: P5.Element;
    private leftBtn: P5.Element;

    private actionBtn: P5.Element;

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

        //SmallButtons
        this.onOffBtn = this.elements.createSmallButton(container, 'On<br/>Off', { x: 0.1, y: 0.55 });
        this.startPauseBtn = this.elements.createSmallButton(container, 'Start<br/>Pause', { x: 0.24, y: 0.6 });
        this.soundBtn = this.elements.createSmallButton(container, 'Sound', { x: 0.38, y: 0.55 });
        this.resetBtn = this.elements.createSmallButton(container, 'Reset', { x: 0.52, y: 0.6 });
        this.exitBtn = this.elements.createSmallButton(container, 'Exit', { x: 0.65, y: 0.55 });
        this.enableColorBtn = this.elements.createSmallButton(container, 'Enable<br/>Colors', { x: 0.8, y: 0.6 });

        this.upBtn = this.elements.createButton(container, 'W', { x: 0.25, y: 0.69 });
        this.leftBtn = this.elements.createButton(container, 'A', { x: 0.1, y: 0.765 });
        this.downBtn = this.elements.createButton(container, 'S', { x: 0.25, y: 0.84 });
        this.rightBtn = this.elements.createButton(container, 'D', { x: 0.4, y: 0.765 });

        this.actionBtn = this.elements.createBigButton(container, 'Action', { x: 0.66, y: 0.74 });

        return { canvasWidth, canvasHeight, container };
    }
}

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
} from './constants';

interface BodyProps {
    parent: Element;
    p: P5;
}

export default class Body {
    width: number;
    height: number;
    parent: Element;
    p: P5;

    constructor(props: BodyProps) {
        this.parent = props.parent;
        this.p = props.p;
    }

    calcItSelfSize(container: P5.Element) {
        const { clientWidth, clientHeight } = this.parent;

        console.log({
            clientWidth,
            clientHeight,
        });

        this.width = clientWidth - BODY_PARENT_MARGIN * 2;
        this.height = this.width * BODY_HEIGHT_WIDTH_MULTIPLIER;

        container.style(`width: ${this.width}px; height: ${this.height}px`);
    }

    build() {
        const container = this.p.createDiv();
        container.parent(PARENT_SELECTOR);
        this.calcItSelfSize(container);

        container.style(
            `
                margin: auto; 
                box-sizing:border-box;
                background-color: ${BODY_MAIN_COLOR};
                border-radius: ${this.width * 0.05}px
            `,
        );
    }
}

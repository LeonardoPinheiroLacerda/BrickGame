import * as P5 from 'p5';
import BodyElements from './BodyElements';
import Game from '../game/Game';

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

    private pressOnOff: Function;
    private pressStartPause: Function;
    private pressSound: Function;
    private pressReset: Function;
    private pressExit: Function;
    private pressEnableColor: Function;

    private pressUp: Function;
    private pressDown: Function;
    private pressRight: Function;
    private pressLeft: Function;

    private pressAction: Function;

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

        return { canvasWidth, canvasHeight };
    }

    bound(game: Game) {
        this.pressOnOff = game.getControls().pressOnOff;
        this.pressStartPause = game.getControls().pressStartPause;
        this.pressSound = game.getControls().pressSound;
        this.pressReset = game.getControls().pressReset;
        this.pressExit = game.getControls().pressExit;
        this.pressEnableColor = game.getControls().pressEnableColor;

        this.pressUp = game.getControls().pressUp;
        this.pressDown = game.getControls().pressDown;
        this.pressRight = game.getControls().pressRight;
        this.pressLeft = game.getControls().pressLeft;

        this.pressAction = game.getControls().pressAction;

        this.onOffBtn.mouseClicked(() => this.pressOnOff(game));
        this.startPauseBtn.mouseClicked(() => this.pressStartPause(game));
        this.soundBtn.mouseClicked(() => this.pressSound(game));
        this.resetBtn.mouseClicked(() => this.pressReset(game));
        this.exitBtn.mouseClicked(() => this.pressExit(game));
        this.enableColorBtn.mouseClicked(() => this.pressEnableColor(game));

        this.upBtn.mouseClicked(() => this.pressUp(game));
        this.downBtn.mouseClicked(() => this.pressDown(game));
        this.rightBtn.mouseClicked(() => this.pressRight(game));
        this.leftBtn.mouseClicked(() => this.pressLeft(game));

        this.actionBtn.mouseClicked(() => this.pressAction(game));

        //On hold

        let delayTimerOnUp: NodeJS.Timeout;
        let holdTimerOnUp: NodeJS.Timeout;
        this.upBtn.touchStarted(() => {
            delayTimerOnUp = setTimeout(() => {
                holdTimerOnUp = setInterval(() => {
                    this.pressUp(game);
                }, 50);
            }, 250);
        });

        this.upBtn.touchEnded(() => {
            clearTimeout(delayTimerOnUp);
            clearTimeout(holdTimerOnUp);
        });

        let delayTimerOnDown: NodeJS.Timeout;
        let holdTimerOnDown: NodeJS.Timeout;
        this.downBtn.touchStarted(() => {
            delayTimerOnDown = setTimeout(() => {
                holdTimerOnDown = setInterval(() => {
                    this.pressDown(game);
                }, 50);
            }, 250);
        });

        this.downBtn.touchEnded(() => {
            clearTimeout(delayTimerOnDown);
            clearTimeout(holdTimerOnDown);
        });

        let delayTimerOnRight: NodeJS.Timeout;
        let holdTimerOnRight: NodeJS.Timeout;
        this.rightBtn.touchStarted(() => {
            delayTimerOnRight = setTimeout(() => {
                holdTimerOnRight = setInterval(() => {
                    this.pressRight(game);
                }, 50);
            }, 250);
        });

        this.rightBtn.touchEnded(() => {
            clearTimeout(delayTimerOnRight);
            clearTimeout(holdTimerOnRight);
        });

        let delayTimerOnLeft: NodeJS.Timeout;
        let holdTimerOnLeft: NodeJS.Timeout;
        this.leftBtn.touchStarted(() => {
            delayTimerOnLeft = setTimeout(() => {
                holdTimerOnLeft = setInterval(() => {
                    this.pressLeft(game);
                }, 50);
            }, 250);
        });

        this.leftBtn.touchEnded(() => {
            clearTimeout(delayTimerOnLeft);
            clearTimeout(holdTimerOnLeft);
        });

        let delayTimerOnAction: NodeJS.Timeout;
        let holdTimerOnAction: NodeJS.Timeout;
        this.actionBtn.touchStarted(() => {
            delayTimerOnAction = setTimeout(() => {
                holdTimerOnAction = setInterval(() => {
                    this.pressAction(game);
                }, 50);
            }, 250);
        });

        this.actionBtn.touchEnded(() => {
            clearTimeout(delayTimerOnAction);
            clearTimeout(holdTimerOnAction);
        });
    }

    unbound() {
        this.onOffBtn.mouseClicked(() => {});
        this.startPauseBtn.mouseClicked(() => {});
        this.soundBtn.mouseClicked(() => {});
        this.resetBtn.mouseClicked(() => {});
        this.exitBtn.mouseClicked(() => {});
        this.enableColorBtn.mouseClicked(() => {});

        this.upBtn.mouseClicked(() => {});
        this.downBtn.mouseClicked(() => {});
        this.rightBtn.mouseClicked(() => {});
        this.leftBtn.mouseClicked(() => {});

        this.actionBtn.mouseClicked(() => {});

        this.upBtn.touchStarted(() => {});
        this.upBtn.touchEnded(() => {});

        this.downBtn.touchStarted(() => {});
        this.downBtn.touchEnded(() => {});

        this.rightBtn.touchStarted(() => {});
        this.rightBtn.touchEnded(() => {});

        this.leftBtn.touchStarted(() => {});
        this.leftBtn.touchEnded(() => {});

        this.actionBtn.touchStarted(() => {});
        this.actionBtn.touchEnded(() => {});
    }
}

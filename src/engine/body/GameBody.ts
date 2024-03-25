import * as P5 from 'p5';
import GameBodyComponentsRenderer from './GameBodyComponentsRenderer';
import Game from '../Game';
import BodyProps from '../../interface/BodyProps';

/**
 *
 * Responsable for rendering the gamebrick body, bound and unbound controls events
 *
 * @class
 */

export default class GameBody {
    private elements: GameBodyComponentsRenderer;

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

    private pressOnOff: (game: Game) => void;
    private pressStartPause: (game: Game) => void;
    private pressSound: (game: Game) => void;
    private pressReset: (game: Game) => void;
    private pressExit: (game: Game) => void;
    private pressEnableColor: (game: Game) => void;

    private pressUp: (game: Game) => void;
    private pressDown: (game: Game) => void;
    private pressRight: (game: Game) => void;
    private pressLeft: (game: Game) => void;

    private pressAction: (game: Game) => void;

    constructor(props: BodyProps) {
        this.elements = new GameBodyComponentsRenderer({
            p: props.p,
            parent: props.parent,
        });
    }

    build() {
        //Container
        const container = this.elements.createContainer();

        //Frame
        const frame = this.elements.createFrame(container);

        //Canvas
        const { canvasWidth, canvasHeight } = this.elements.createCanvas(frame);

        //Buttons
        const { largeButtonContainer, smallButtonContainer, directionHorizontalContainer, directionVerticalContainer } =
            this.elements.createButtonContainer(container);

        this.onOffBtn = this.elements.createSmallButton(smallButtonContainer, 'On<br/>Off', true);
        this.startPauseBtn = this.elements.createSmallButton(smallButtonContainer, 'Start<br/>Pause', false);
        this.soundBtn = this.elements.createSmallButton(smallButtonContainer, 'Sound', true);
        this.resetBtn = this.elements.createSmallButton(smallButtonContainer, 'Reset', false);
        this.exitBtn = this.elements.createSmallButton(smallButtonContainer, 'Exit', true);
        this.enableColorBtn = this.elements.createSmallButton(smallButtonContainer, 'Enable<br/>Colors', false);

        this.upBtn = this.elements.createButton(directionVerticalContainer, 'UP');
        this.leftBtn = this.elements.createButton(directionHorizontalContainer, 'LEFT');
        this.downBtn = this.elements.createButton(directionVerticalContainer, 'DOWN');
        this.rightBtn = this.elements.createButton(directionHorizontalContainer, 'RIGHT');

        this.actionBtn = this.elements.createBigButton(largeButtonContainer, 'Action');

        this.elements.defineValues();

        return { canvasWidth, canvasHeight };
    }

    bound(game: Game) {
        this.pressOnOff = game.getGameControls().pressOnOff;
        this.pressStartPause = game.getGameControls().pressStartPause;
        this.pressSound = game.getGameControls().pressSound;
        this.pressReset = game.getGameControls().pressReset;
        this.pressExit = game.getGameControls().pressExit;
        this.pressEnableColor = game.getGameControls().pressEnableColor;
        this.pressUp = game.getGameControls().pressUp;
        this.pressDown = game.getGameControls().pressDown;
        this.pressRight = game.getGameControls().pressRight;
        this.pressLeft = game.getGameControls().pressLeft;
        this.pressAction = game.getGameControls().pressAction;
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

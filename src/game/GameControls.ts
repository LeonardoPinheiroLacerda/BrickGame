import Game from './Game';

export default class GameControls {
    keyUpPressedInterval: NodeJS.Timeout;
    keyDownPressedInterval: NodeJS.Timeout;
    keyLeftPressedInterval: NodeJS.Timeout;
    keyRightPressedInterval: NodeJS.Timeout;
    keyActionPressedInterval: NodeJS.Timeout;

    keyUpPressedTimeout: NodeJS.Timeout;
    keyDownPressedTimeout: NodeJS.Timeout;
    keyLeftPressedTimeout: NodeJS.Timeout;
    keyRightPressedTimeout: NodeJS.Timeout;
    keyActionPressedTimeout: NodeJS.Timeout;

    delay: number = 250;
    timeout: number = this.delay / 5;

    bound(game: Game) {
        game.getP().keyReleased = key => {
            const event: any = key;

            switch (event.key) {
                case 'ArrowRight':
                case 'd':
                case 'D':
                    clearTimeout(this.keyRightPressedTimeout);
                    clearInterval(this.keyRightPressedInterval);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    clearTimeout(this.keyDownPressedTimeout);
                    clearInterval(this.keyDownPressedInterval);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    clearTimeout(this.keyLeftPressedTimeout);
                    clearInterval(this.keyLeftPressedInterval);
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    clearTimeout(this.keyUpPressedTimeout);
                    clearInterval(this.keyUpPressedInterval);
                    break;
                case ' ':
                    clearTimeout(this.keyActionPressedTimeout);
                    clearInterval(this.keyActionPressedInterval);
                    break;
            }
        };

        game.getP().keyTyped = key => {
            const event: any = key;

            switch (event.key) {
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.pressRight(game);
                    this.keyRightPressedTimeout = setTimeout(() => {
                        this.keyRightPressedInterval = setInterval(() => {
                            this.pressRight(game);
                        }, this.timeout);
                    }, this.delay);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.pressDown(game);
                    this.keyDownPressedTimeout = setTimeout(() => {
                        this.keyDownPressedInterval = setInterval(() => {
                            this.pressDown(game);
                        }, this.timeout);
                    }, this.delay);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.pressLeft(game);
                    this.keyLeftPressedTimeout = setTimeout(() => {
                        this.keyLeftPressedInterval = setInterval(() => {
                            this.pressLeft(game);
                        }, this.timeout);
                    }, this.delay);
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.pressUp(game);
                    this.keyUpPressedTimeout = setTimeout(() => {
                        this.keyUpPressedInterval = setInterval(() => {
                            this.pressUp(game);
                        }, this.timeout);
                    }, this.delay);
                    break;
                case ' ':
                    this.pressAction(game);
                    this.keyActionPressedTimeout = setTimeout(() => {
                        this.keyActionPressedInterval = setInterval(() => {
                            this.pressAction(game);
                        }, this.timeout);
                    }, this.delay);
                    break;
                case '1':
                    this.pressOnOff(game);
                    break;
                case '2':
                    this.pressStartPause(game);
                    break;
                case '3':
                    this.pressSound(game);
                    break;
                case '4':
                    this.pressReset(game);
                    break;
                case '5':
                    this.pressExit(game);
                    break;
                case '6':
                    this.pressEnableColor(game);
                    break;
            }
        };
    }

    unbound(game: Game) {
        game.getP().keyPressed = () => {};
        game.getP().keyTyped = () => {};
        game.getP().keyReleased = () => {};
    }

    pressOnOff(game: Game) {
        game.getState().on = !game.getState().on;
        this.pressReset(game);
    }
    pressStartPause(game: Game) {
        if (game.getState().on) {
            game.getState().start = !game.getState().start;
        }
        if (game.getState().start) {
            game.getState().running = true;
        }
    }
    pressSound(game: Game) {
        game.getGameSound().setMute(!game.getGameSound().getMute());
    }
    pressReset(game: Game) {
        game.getState().gameOver = false;
        game.getState().start = false;
        game.getState().running = false;
        game.getGameSound().setMute(false);
        game.resetGrid();

        game.score = 0;
        game.level = 1;
        const hiScore = localStorage.getItem(game.hiScoreKey);
        if (hiScore === null) {
            localStorage.setItem(game.hiScoreKey, '0');
        }
        game.hiScoreValue = Number.parseInt(localStorage.getItem(game.hiScoreKey));
    }
    pressExit(game: Game) {
        game.getBody().unbound();
        this.unbound(game);
    }
    pressEnableColor(game: Game) {
        game.getState().colorEnabled = !game.getState().colorEnabled;
    }

    pressUp(game: Game) {
        console.log('up', game);
    }
    pressDown(game: Game) {
        console.log('down', game);
    }
    pressRight(game: Game) {
        console.log('right', game);
    }
    pressLeft(game: Game) {
        console.log('left', game);
    }

    pressAction(game: Game) {
        console.log('action', game);
    }
}

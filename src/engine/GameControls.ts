import Game from './Game';

export default class GameControls {
    protected keyUpPressedInterval: NodeJS.Timeout;
    protected keyDownPressedInterval: NodeJS.Timeout;
    protected keyLeftPressedInterval: NodeJS.Timeout;
    protected keyRightPressedInterval: NodeJS.Timeout;

    protected keyUpPressedTimeout: NodeJS.Timeout;
    protected keyDownPressedTimeout: NodeJS.Timeout;
    protected keyLeftPressedTimeout: NodeJS.Timeout;
    protected keyRightPressedTimeout: NodeJS.Timeout;

    protected delay: number = 250;
    protected timeout: number = this.delay / 5;

    protected beforeOnOff(game: Game) {
        console.log('beforeOnOff', game);
    }
    protected beforeStartPause(game: Game) {
        console.log('beforeStartPause', game);
    }
    protected beforeSound(game: Game) {
        console.log('beforeSound', game);
    }
    protected beforeReset(game: Game) {
        console.log('beforeReset', game);
    }
    protected beforeExit(game: Game) {
        console.log('beforeExit', game);
    }
    protected beforeEnableColor(game: Game) {
        console.log('beforeEnableColor', game);
    }
    protected beforeUp(game: Game) {
        console.log('beforeUp', game);
    }
    protected beforeDown(game: Game) {
        console.log('beforeDown', game);
    }
    protected beforeRight(game: Game) {
        console.log('beforeRight', game);
    }
    protected beforeLeft(game: Game) {
        console.log('beforeLeft', game);
    }
    protected beforeAction(game: Game) {
        console.log('beforeAction', game);
    }

    protected afterOnOff(game: Game) {
        console.log('afterOnOff', game);
    }
    protected afterStartPause(game: Game) {
        console.log('afterStartPause', game);
    }
    protected afterSound(game: Game) {
        console.log('afterSound', game);
    }
    protected afterReset(game: Game) {
        console.log('afterReset', game);
    }
    protected afterExit(game: Game) {
        console.log('afterExit', game);
    }
    protected afterEnableColor(game: Game) {
        console.log('afterEnableColor', game);
    }
    protected afterUp(game: Game) {
        console.log('afterUp', game);
    }
    protected afterDown(game: Game) {
        console.log('afterDown', game);
    }
    protected afterRight(game: Game) {
        console.log('afterRight', game);
    }
    protected afterLeft(game: Game) {
        console.log('afterLeft', game);
    }
    protected afterAction(game: Game) {
        console.log('afterAction', game);
    }

    protected onOff(game: Game) {
        game.state.on = !game.state.on;
        this.reset(game);
    }
    protected startPause(game: Game) {
        if (game.state.on) {
            game.state.start = !game.state.start;
        }
        if (game.state.start) {
            game.state.running = true;
        }
        if (game.state.gameOver) {
            game.state.gameOver = false;
            this.reset(game);
        }
    }
    protected sound(game: Game) {
        game.gameSound.toogleMute();
    }
    protected reset(game: Game) {
        game.state.gameOver = false;
        game.state.start = false;
        game.state.running = false;
        //game.gameSound.mute = false;
        game.gameSound.stopAll();
        game.resetGrid();

        game.reset();
    }
    protected exit(game: Game) {
        if (game.state.on) {
            game.changeGame('engine/menu', 'GameMenu');
        }
    }
    protected enableColor(game: Game) {
        game.state.colorEnabled = !game.state.colorEnabled;
    }

    protected up(game: Game) {
        console.log('up', game);
    }
    protected down(game: Game) {
        console.log('down', game);
    }
    protected right(game: Game) {
        console.log('right', game);
    }
    protected left(game: Game) {
        console.log('left', game);
    }

    protected action(game: Game) {
        console.log('action', game);
    }

    pressOnOff(game: Game) {
        game.gameControls.beforeOnOff(game);
        game.gameControls.onOff(game);
        game.gameControls.afterOnOff(game);
    }
    pressStartPause(game: Game) {
        if (!game.state.on) return;
        game.gameControls.beforeStartPause(game);
        game.gameControls.startPause(game);
        game.gameControls.afterStartPause(game);
    }
    pressSound(game: Game) {
        if (!game.state.on) return;
        game.gameControls.beforeSound(game);
        game.gameControls.sound(game);
        game.gameControls.afterSound(game);
    }
    pressReset(game: Game) {
        if (!game.state.on) return;
        game.gameControls.beforeReset(game);
        game.gameControls.reset(game);
        game.gameControls.afterReset(game);
    }
    pressExit(game: Game) {
        if (!game.state.on) return;
        game.gameControls.beforeExit(game);
        game.gameControls.exit(game);
        game.gameControls.afterExit(game);
    }
    pressEnableColor(game: Game) {
        if (!game.state.on) return;
        game.gameControls.beforeEnableColor(game);
        game.gameControls.enableColor(game);
        game.gameControls.afterEnableColor(game);
    }
    pressUp(game: Game) {
        if (!game.state.on || !game.state.start || !game.state.running) return;
        game.gameControls.beforeUp(game);
        game.gameControls.up(game);
        game.gameControls.afterUp(game);
    }
    pressDown(game: Game) {
        if (!game.state.on || !game.state.start || !game.state.running) return;
        game.gameControls.beforeDown(game);
        game.gameControls.down(game);
        game.gameControls.afterDown(game);
    }
    pressRight(game: Game) {
        if (!game.state.on || !game.state.start || !game.state.running) return;
        game.gameControls.beforeRight(game);
        game.gameControls.right(game);
        game.gameControls.afterRight(game);
    }
    pressLeft(game: Game) {
        if (!game.state.on || !game.state.start || !game.state.running) return;
        game.gameControls.beforeLeft(game);
        game.gameControls.left(game);
        game.gameControls.afterLeft(game);
    }
    pressAction(game: Game) {
        if (!game.state.on || !game.state.start || !game.state.running) return;
        game.gameControls.beforeAction(game);
        game.gameControls.action(game);
        game.gameControls.afterAction(game);
    }

    bound(game: Game) {
        game.p.keyReleased = key => {
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
            }
        };

        game.p.keyTyped = key => {
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
                case 'j':
                case 'J':
                    this.pressAction(game);
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
        game.p.keyPressed = () => {};
        game.p.keyTyped = () => {};
        game.p.keyReleased = () => {};
    }
}

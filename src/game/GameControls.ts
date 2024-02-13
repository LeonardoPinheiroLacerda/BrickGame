import Game from './Game';

export default class GameControls {
    bound(game: Game) {
        game.getP().keyPressed = key => {
            let event: any = key;

            switch (event.key) {
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.pressRight(game);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.pressDown(game);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.pressLeft(game);
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.pressUp(game);
                    break;
                case ' ':
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
        game.getP().keyPressed = key => {};
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
        console.log('up');
    }
    pressDown(game: Game) {
        console.log('down');
    }
    pressRight(game: Game) {
        console.log('right');
    }
    pressLeft(game: Game) {
        console.log('left');
    }

    pressAction(game: Game) {
        console.log('action');
    }
}

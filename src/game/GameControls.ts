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
        console.log('on off');
    }
    pressStartPause(game: Game) {
        console.log('start pause');
    }
    pressSound(game: Game) {
        console.log('sound');
    }
    pressReset(game: Game) {
        console.log('reset');
    }
    pressExit(game: Game) {
        console.log('exit');
        game.getBody().unbound();
        this.unbound(game);
    }
    pressEnableColor(game: Game) {
        console.log('enable color');
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

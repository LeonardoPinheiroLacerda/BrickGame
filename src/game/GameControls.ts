import Game from './Game';
import Sound from './../enum/Sound';

export default class GameControls {
    pressOnOff(game: Game) {
        console.log('on off');
        console.log(game);
        game.getGameSound().play(Sound.GAME_OVER);
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

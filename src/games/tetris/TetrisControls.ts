import GameControls from '../../engine/GameControls';
import Sound from '../../enum/Sound';
import Tetris from './Tetris';

export default class TetrisControls extends GameControls {
    protected beforeStartPause(game: Tetris): void {
        if (game.state.running === false) {
            game.gameSound.play(Sound.GAME_START);
        }
    }

    protected action(game: Tetris): void {
        if (game.getCurrent()?.rotate(game)) {
            game.gameSound.play(Sound.ACTION_1);
        }
    }

    protected up(game: Tetris): void {
        if (game.getCurrent()?.rotate(game)) {
            game.gameSound.play(Sound.ACTION_1);
        }
    }

    protected right(game: Tetris): void {
        if (game.getCurrent()?.move(game, { y: 0, x: 1 })) {
            game.gameSound.play(Sound.KEY_PRESS);
        }
    }

    protected left(game: Tetris): void {
        if (game.getCurrent()?.move(game, { y: 0, x: -1 })) {
            game.gameSound.play(Sound.KEY_PRESS);
        }
    }

    protected down(game: Tetris): void {
        if (game.getCurrent()?.move(game, { y: 1, x: 0 })) {
            game.gameSound.play(Sound.KEY_PRESS);
        }
    }
}

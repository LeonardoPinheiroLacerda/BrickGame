import GameControls from '../../engine/GameControls';
import Sound from '../../enum/Sound';
import Tetris from './Tetris';

export default class TetrisControls extends GameControls {
    protected beforeStartPause(game: Tetris): void {
        if (game.getState().running === false) {
            game.getGameSound().play(Sound.GAME_START);
        }
    }

    protected action(game: Tetris): void {
        game.getGameSound().play(Sound.ACTION_1);
        game.getCurrent()?.rotate(game);
    }

    protected up(game: Tetris): void {
        game.getGameSound().play(Sound.ACTION_1);
        game.getCurrent()?.rotate(game);
    }

    protected right(game: Tetris): void {
        game.getGameSound().play(Sound.KEY_PRESS);
        game.getCurrent()?.move(game, { y: 0, x: 1 });
    }

    protected left(game: Tetris): void {
        game.getGameSound().play(Sound.KEY_PRESS);
        game.getCurrent()?.move(game, { y: 0, x: -1 });
    }

    protected down(game: Tetris): void {
        game.getGameSound().play(Sound.KEY_PRESS);
        game.getCurrent()?.move(game, { y: 1, x: 0 });
    }
}

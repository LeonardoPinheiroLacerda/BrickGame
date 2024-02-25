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
        game.getCurrent().rotate(game);
    }
}

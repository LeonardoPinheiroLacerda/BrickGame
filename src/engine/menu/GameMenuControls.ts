import Sound from '../../enum/Sound';
import Game from '../Game';
import GameControls from '../GameControls';
import GameMenu from './GameMenu';

export default class GameMenuControls extends GameControls {
    protected left(game: GameMenu): void {
        if (game.getState().running) game.getGameSound().play(Sound.KEY_PRESS);
        if (game.games[game.selectedGame - 1]) {
            game.selectedGame -= 1;
        } else {
            game.selectedGame = game.games.length - 1;
        }
    }
    protected right(game: GameMenu): void {
        if (game.getState().running) game.getGameSound().play(Sound.KEY_PRESS);
        if (game.games[game.selectedGame + 1]) {
            game.selectedGame += 1;
        } else {
            game.selectedGame = 0;
        }
    }
    protected action(game: GameMenu): void {
        if (game.getState().start && game.getState().running && game.getState().on) {
            game.getGameSound().play(Sound.ACTION_1);

            const { nameSpace, className } = game.games[game.selectedGame];
            game.changeGame(nameSpace, className);
        }
    }

    protected beforeStartPause(game: GameMenu): void {
        if (!game.getState().start && game.getState().on) {
            game.getGameSound().play(Sound.KEY_PRESS);
        }
    }

    protected afterStartPause(game: Game): void {
        //Dentro do menu não deve existir estado de pausa
        if (game.getState().on) game.getState().start = true;
    }

    protected afterOnOff(game: GameMenu): void {
        game.playedStartTheme = false;
        game.selectedGame = 0;
        game.getGameSound().stopAll();
    }

    protected afterReset(game: GameMenu): void {
        game.playedStartTheme = false;
        game.selectedGame = 0;
        game.getGameSound().stopAll();
    }

    exit(game: GameMenu): void {
        console.log(game);
        return;
    }
}

import Sound from '../../enum/Sound';
import Game from '../Game';
import GameControls from '../GameControls';
import GameMenu from './GameMenu';

export default class GameMenuControls extends GameControls {
    pressLeft(game: GameMenu): void {
        if (game.getState().running) game.getGameSound().play(Sound.KEY_PRESS);
        if (game.games[game.selectedGame - 1]) {
            game.selectedGame -= 1;
        } else {
            game.selectedGame = game.games.length - 1;
        }
    }
    pressRight(game: GameMenu): void {
        if (game.getState().running) game.getGameSound().play(Sound.KEY_PRESS);
        if (game.games[game.selectedGame + 1]) {
            game.selectedGame += 1;
        } else {
            game.selectedGame = 0;
        }
    }
    pressAction(game: GameMenu): void {
        if (game.getState().running) game.getGameSound().play(Sound.ACTION_1);
        
        const { nameSpace, className } = game.games[game.selectedGame];
        game.changeGame(nameSpace, className);
    }

    pressStartPause(game: GameMenu): void {
        if (game.getState().start == false) game.getGameSound().play(Sound.KEY_PRESS);
        super.pressStartPause(game);
        //Dentro do menu não deve existir estado de pausa
        game.getState().start = true;
    }
    pressOnOff(game: GameMenu): void {
        super.pressOnOff(game);
        game.playedStartTheme = false;
        game.selectedGame = 0;
        game.getGameSound().stopAll();
    }
    pressReset(game: GameMenu): void {
        super.pressReset(game);
        game.playedStartTheme = false;
        game.selectedGame = 0;
        game.getGameSound().stopAll();
    }
    pressExit(game: GameMenu): void {
        return;
    }
}

import Game from './Game';
import { DISPLAY_MARGIN } from './../constants';

export default class GameCoordinates {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    getDisplayPosX(x: number): number {
        return this.game.getDisplayWidth() * x + this.game.getRelativeValue(DISPLAY_MARGIN);
    }
    getDisplayPosY(y: number): number {
        return this.game.getDisplayHeight() * y + this.game.getRelativeValue(DISPLAY_MARGIN);
    }

    getHudPosX(x: number): number {
        const zero = this.game.getDisplayWidth() + this.game.getRelativeValue(DISPLAY_MARGIN) * 2;
        const width = this.game.getCanvasWidth() - zero - this.game.getRelativeValue(DISPLAY_MARGIN);
        return width * x + zero;
    }
    getHudPosY(y: number): number {
        return this.game.getRelativeValue(DISPLAY_MARGIN) + this.game.getDisplayHeight() * y;
    }
}

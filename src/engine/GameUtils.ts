import { GRID_X } from './../constants';
import Color from '../enum/Color';
import Cell from '../interface/Cell';
import Game from './Game';

export default class GameUtils {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    emptyCell(): Cell {
        return { color: Color.DEFAULT, value: 0 };
    }

    emptyRow() {
        const emptyRow: Cell[] = [];
        for (let x = 0; x < GRID_X; x++) {
            emptyRow.push(this.emptyCell());
        }
        return emptyRow;
    }
}

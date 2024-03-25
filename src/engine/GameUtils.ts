import { GRID_X } from './../constants';
import Color from '../enum/Color';
import Cell from '../interface/Cell';

export default class GameUtils {
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

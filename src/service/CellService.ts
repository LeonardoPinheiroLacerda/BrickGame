import * as P5 from 'p5';
import CellImages from '../interface/CellImages';
import Cell from '../interface/Cell';
import Color from '../enum/Color';

export default class CellService {
    private p: P5;
    private images: CellImages;

    constructor(p: P5) {
        this.p = p;

        this.images = this.loadCellImages();
    }

    private loadCellImages(): CellImages {
        const defaultCell: P5.Image = this.p.loadImage('./assets/images/activeCell.svg');
        const blueCell: P5.Image = this.p.loadImage('./assets/images/activeCellBlue.svg');
        const cyanCell: P5.Image = this.p.loadImage('./assets/images/activeCellCyan.svg');
        const grayCell: P5.Image = this.p.loadImage('./assets/images/activeCellGray.svg');
        const greenCell: P5.Image = this.p.loadImage('./assets/images/activeCellGreen.svg');
        const purpleCell: P5.Image = this.p.loadImage('./assets/images/activeCellPurple.svg');
        const redCell: P5.Image = this.p.loadImage('./assets/images/activeCellRed.svg');
        const yellowCell: P5.Image = this.p.loadImage('./assets/images/activeCellYellow.svg');
        const inactiveCell: P5.Image = this.p.loadImage('./assets/images/inactiveCell.svg');

        return { defaultCell, blueCell, cyanCell, grayCell, greenCell, purpleCell, redCell, yellowCell, inactiveCell };
    }

    private getCellImageById(cell: Cell): P5.Image {
        switch (cell.colorId) {
            case Color.DEFAULT:
                return this.images.defaultCell;
            case Color.BLUE:
                return this.images.blueCell;
            case Color.CYAN:
                return this.images.cyanCell;
            case Color.GRAY:
                return this.images.grayCell;
            case Color.GREEN:
                return this.images.greenCell;
            case Color.PURPLE:
                return this.images.purpleCell;
            case Color.RED:
                return this.images.redCell;
            case Color.YELLOW:
                return this.images.yellowCell;
        }
    }

    getCellImage(cell: Cell, colorEnabled: boolean): P5.Image {
        if (cell.value !== 0) {
            return colorEnabled ? this.getCellImageById(cell) : this.images.defaultCell;
        } else {
            return this.images.inactiveCell;
        }
    }
}

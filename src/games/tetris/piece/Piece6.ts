import Piece from './Piece';
import { GRID_X } from '../../../constants';
import Coordinates from '../../../interface/Coordinates';
import Color from '../../../enum/Color';

export default class Piece6 extends Piece {
    public maxState: number = 0;
    public state: number = this.getRandomState();
    public pieceId: number = 6;
    protected centerPoint: Coordinates = { y: 0, x: Math.floor(GRID_X / 2) };
    protected previewCenterPoint: Coordinates = { y: 1, x: 1 };

    public color: Color = Color.BLUE;

    constructor(id: number) {
        super(id);
        this.parts = this.generateParts();
        this.preview = this.generatePreview();
    }

    generateParts(centerPoint: Coordinates = this.centerPoint): Coordinates[] {
        const parts = [];
        switch (this.state) {
            case 0:
                parts[0] = { x: centerPoint.x, y: centerPoint.y };
                parts[1] = { x: centerPoint.x + 1, y: centerPoint.y };
                parts[2] = { x: centerPoint.x, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x + 1, y: centerPoint.y + 1 };
                break;
        }

        return parts;
    }
}

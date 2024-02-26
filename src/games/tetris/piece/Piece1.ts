import Piece from './Piece';
import { GRID_X } from '../../../constants';
import Coordinates from '../../../interface/Coordinates';
import Color from '../../../enum/Color';

export default class Piece1 extends Piece {
    public maxState: number = 3;
    public state: number = this.getRandomState();
    public pieceId: number = 1;
    protected centerPoint: Coordinates = this.state === 1 ? { y: 0, x: Math.floor(GRID_X / 2) } : { y: 1, x: Math.floor(GRID_X / 2) };
    protected previewCenterPoint: Coordinates = { y: 2, x: 2 };

    public color: Color = Color.PURPLE;

    constructor(id: number) {
        super(id);
        this.parts = this.generateParts();
        this.preview = this.generatePreview();
    }

    generateParts(centerPoint: Coordinates = this.centerPoint): Coordinates[] {
        const parts = [];
        switch (this.state) {
            case 0:
                parts[0] = { x: centerPoint.x - 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x - 1, y: centerPoint.y };
                parts[2] = { x: centerPoint.x - 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x, y: centerPoint.y + 1 };
                break;
            case 1:
                parts[0] = { x: centerPoint.x - 1, y: centerPoint.y + 1 };
                parts[1] = { x: centerPoint.x, y: centerPoint.y + 1 };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x + 1, y: centerPoint.y };
                break;
            case 2:
                parts[0] = { x: centerPoint.x + 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x + 1, y: centerPoint.y };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x, y: centerPoint.y - 1 };
                break;
            case 3:
                parts[0] = { x: centerPoint.x - 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x, y: centerPoint.y - 1 };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y - 1 };
                parts[3] = { x: centerPoint.x - 1, y: centerPoint.y };
                break;
        }

        return parts;
    }
}

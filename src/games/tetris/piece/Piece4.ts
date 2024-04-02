import Piece from './Piece';
import Coordinates from '../../../interface/Coordinates';
import Color from '../../../enum/Color';

export default class Piece4 extends Piece {
    public maxState: number = 1;
    public state: number = this.getRandomState();
    public pieceId: number = 4;
    protected previewCenterPoint: Coordinates = this.state === 0 ? { y: 2, x: 2 } : { y: 2, x: 1 };

    public color: Color = Color.CYAN;

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
                parts[1] = { x: centerPoint.x, y: centerPoint.y - 1 };
                parts[2] = { x: centerPoint.x, y: centerPoint.y };
                parts[3] = { x: centerPoint.x + 1, y: centerPoint.y };
                break;
            case 1:
                parts[0] = { x: centerPoint.x + 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x, y: centerPoint.y };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y };
                parts[3] = { x: centerPoint.x, y: centerPoint.y + 1 };
                break;
        }

        return this.getTopCoordinates(parts);
    }
}

import Piece from './Piece';
import Coordinates from '../../../interface/Coordinates';
import Color from '../../../enum/Color';

export default class Piece1 extends Piece {
    protected _maxState: number = 3;
    protected _state: number = this.getRandomState();
    protected _pieceId: number = 1;
    protected _previewCenterPoint: Coordinates = { y: 2, x: 2 };

    protected _color: Color = Color.PURPLE;

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
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y - 1 };
                parts[3] = { x: centerPoint.x - 1, y: centerPoint.y };
                break;
            case 1:
                parts[0] = { x: centerPoint.x + 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x + 1, y: centerPoint.y };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x, y: centerPoint.y - 1 };
                break;
            case 2:
                parts[0] = { x: centerPoint.x - 1, y: centerPoint.y + 1 };
                parts[1] = { x: centerPoint.x, y: centerPoint.y + 1 };
                parts[2] = { x: centerPoint.x + 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x + 1, y: centerPoint.y };
                break;
            case 3:
                parts[0] = { x: centerPoint.x - 1, y: centerPoint.y - 1 };
                parts[1] = { x: centerPoint.x - 1, y: centerPoint.y };
                parts[2] = { x: centerPoint.x - 1, y: centerPoint.y + 1 };
                parts[3] = { x: centerPoint.x, y: centerPoint.y + 1 };
                break;
        }

        return this.getTopCoordinates(parts);
    }
}

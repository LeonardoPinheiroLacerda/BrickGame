import Piece from './Piece';
import Coordinates from '../../../interface/Coordinates';
import Color from '../../../enum/Color';

export default class Piece6 extends Piece {
    protected _maxState: number = 0;
    protected _state: number = this.getRandomState();
    protected _pieceId: number = 6;
    protected _previewCenterPoint: Coordinates = { y: 1, x: 1 };

    protected _color: Color = Color.BLUE;

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

        return this.getTopCoordinates(parts);
    }
}

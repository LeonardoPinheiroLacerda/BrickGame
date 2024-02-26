import Color from '../../../enum/Color';
import Coordinates from '../../../interface/Coordinates';
import Tetris from '../Tetris';
import Vector from '../../../interface/Vector';
import Cell from '../../../interface/Cell';

export default class Piece {
    public parts: Coordinates[] = [];
    public preview: Cell[][] = [];
    public color: Color;
    public id: number;
    public pieceId: number;

    public state: number;
    public maxState: number;

    protected centerPoint: Coordinates;
    protected previewCenterPoint: Coordinates;

    constructor(id: number) {
        this.id = id;
    }

    generateParts(centerPoint: Coordinates = this.centerPoint): Coordinates[] {
        return [centerPoint];
    }

    generatePreview() {
        const coordinates = this.generateParts(this.previewCenterPoint);

        const preview: Cell[][] = [];

        for (let y = 0; y < 4; y++) {
            const row: Cell[] = [];
            for (let x = 0; x < 4; x++) {
                row.push({ value: 0, color: this.color });
            }
            preview.push(row);
        }

        coordinates.forEach(coordinate => {
            preview[coordinate.y][coordinate.x].value = 1;
        });

        return preview;
    }

    move(game: Tetris, vector: Vector): boolean {
        this.centerPoint.x += vector.x;
        this.centerPoint.y += vector.y;

        const tmpParts: Coordinates[] = this.generateParts();

        let canMove: boolean = true;

        try {
            for (let i = 0; i < tmpParts.length; i++) {
                const { x, y } = tmpParts[i];

                if (game.getGrid()[y][x].value !== 0 && game.getGrid()[y][x].value !== this.id) {
                    canMove = false;
                    break;
                }
            }

            if (!canMove) {
                this.centerPoint.x -= vector.x;
                this.centerPoint.y -= vector.y;
            } else {
                this.parts.forEach(({ y, x }) => {
                    game.getGrid()[y][x] = game.emptyCell();
                });

                this.parts = tmpParts;

                this.parts.forEach(({ y, x }) => {
                    game.getGrid()[y][x] = { color: this.color, value: this.id };
                });
            }

            return canMove;
        } catch (err) {
            this.centerPoint.x -= vector.x;
            this.centerPoint.y -= vector.y;
            return false;
        }
    }

    rotate(game: Tetris) {
        this.state = this.state === this.maxState ? 0 : this.state + 1;

        const tmpParts = this.generateParts();

        let canRotate = true;

        try {
            for (let i = 0; i < tmpParts.length; i++) {
                const cell = game.getGrid()[tmpParts[i].y][tmpParts[i].x];
                if (cell.value != 0 && cell.value != this.id) {
                    canRotate = false;
                    break;
                }
            }
        } catch (err) {
            canRotate = false;
        }

        if (!canRotate) {
            this.state = this.state === 0 ? this.maxState : this.state - 1;
        } else {
            game.getGrid().forEach(row => {
                row.forEach(col => {
                    if (col.value === this.id) {
                        const { color, value } = game.emptyCell();
                        col.color = color;
                        col.value = value;
                    }
                });
            });

            this.parts = this.generateParts();
        }
    }

    getRandomState() {
        const min = Math.ceil(0);
        const max = Math.floor(this.maxState);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

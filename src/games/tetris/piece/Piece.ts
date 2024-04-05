import Color from '../../../enum/Color';
import Coordinates from '../../../interface/Coordinates';
import Tetris from '../Tetris';
import Vector from '../interfaces/Vector';
import Cell from '../../../interface/Cell';
import { GRID_X } from '../../../constants';

export default class Piece {
    protected _parts: Coordinates[] = [];
    protected _preview: Cell[][] = [];

    protected _color: Color;

    protected _id: number;
    protected _pieceId: number;

    protected _state: number;
    protected _maxState: number;

    private _centerPoint: Coordinates = { y: 0, x: Math.floor(GRID_X / 2) };
    protected _previewCenterPoint: Coordinates;

    constructor(id: number) {
        this.id = id;
    }

    generateParts(centerPoint: Coordinates = this.centerPoint): Coordinates[] {
        return [centerPoint];
    }

    generatePreview() {
        const coordinates = this.generateParts(this.previewCenterPoint);

        console.log(this.previewCenterPoint);

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

                if (game.grid[y][x].value !== 0 && game.grid[y][x].value !== this.id) {
                    canMove = false;
                    break;
                }
            }

            if (!canMove) {
                this.centerPoint.x -= vector.x;
                this.centerPoint.y -= vector.y;
            } else {
                this.parts.forEach(({ y, x }) => {
                    game.grid[y][x] = game.gameUtils.emptyCell();
                });

                this.parts = tmpParts;

                this.parts.forEach(({ y, x }) => {
                    game.grid[y][x] = { color: this.color, value: this.id };
                });
            }

            return canMove;
        } catch (err) {
            this.centerPoint.x -= vector.x;
            this.centerPoint.y -= vector.y;
            return false;
        }
    }

    rotate(game: Tetris): boolean {
        this.state = this.state === this.maxState ? 0 : this.state + 1;

        const tmpParts = this.generateParts();

        let canRotate = true;

        try {
            for (let i = 0; i < tmpParts.length; i++) {
                const cell = game.grid[tmpParts[i].y][tmpParts[i].x];
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
            game.grid.forEach(row => {
                row.forEach(col => {
                    if (col.value === this.id) {
                        const { color, value } = game.gameUtils.emptyCell();
                        col.color = color;
                        col.value = value;
                    }
                });
            });

            this.parts = this.generateParts();
        }

        return canRotate;
    }

    getRandomState() {
        const min = Math.ceil(0);
        const max = Math.floor(this.maxState);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getTopCoordinates(parts: Coordinates[]) {
        while (parts.some(({ y }) => y < 0)) {
            parts = parts.map(({ y, x }) => {
                return { x, y: y + 1 };
            });
        }
        return parts;
    }

    public get parts(): Coordinates[] {
        return this._parts;
    }
    protected set parts(value: Coordinates[]) {
        this._parts = value;
    }
    public get preview(): Cell[][] {
        return this._preview;
    }
    protected set preview(value: Cell[][]) {
        this._preview = value;
    }
    public get color(): Color {
        return this._color;
    }
    protected set color(value: Color) {
        this._color = value;
    }
    public get id(): number {
        return this._id;
    }
    protected set id(value: number) {
        this._id = value;
    }
    public get pieceId(): number {
        return this._pieceId;
    }
    protected set pieceId(value: number) {
        this._pieceId = value;
    }

    protected get state(): number {
        return this._state;
    }
    protected set state(value: number) {
        this._state = value;
    }
    protected get maxState(): number {
        return this._maxState;
    }
    protected set maxState(value: number) {
        this._maxState = value;
    }
    protected get centerPoint(): Coordinates {
        return this._centerPoint;
    }
    protected set centerPoint(value: Coordinates) {
        this._centerPoint = value;
    }
    protected get previewCenterPoint(): Coordinates {
        return this._previewCenterPoint;
    }
    protected set previewCenterPoint(value: Coordinates) {
        this._previewCenterPoint = value;
    }
}

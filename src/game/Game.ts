import * as P5 from 'p5';
import { GRID_X, GRID_Y, DISPLAY_MARGIN, DISPLAY_WIDTH, BACKGROUND_COLOR } from './../constants';
import CellService from '../service/CellService';
import Cell from '../interface/Cell';
import Color from '../enum/Color';
import Coordinates from '../interface/Coordinates';

interface GameProps {
    p: P5;
    canvasWidth: number;
    canvasHeight: number;
}

export default class Game {
    private p: P5;

    private canvasWidth: number;
    private canvasHeight: number;

    private grid: Cell[][];

    private cellService: CellService;

    private colorEnabled: boolean;

    private cellSize: number;

    constructor(props: GameProps) {
        this.p = props.p;
        this.canvasWidth = props.canvasWidth;
        this.canvasHeight = props.canvasHeight;

        this.cellService = new CellService(props.p);

        this.colorEnabled = true;

        this.cellSize = (this.canvasWidth * DISPLAY_WIDTH) / GRID_X;

        this.resetGrid();
    }

    resetGrid() {
        this.grid = Array(GRID_Y).fill(Array(GRID_X).fill({ value: 0, colorId: Color.DEFAULT }));
    }

    drawDisplay() {
        const { p, canvasWidth, canvasHeight, grid } = this;

        p.push();
        p.noFill();

        p.strokeWeight(canvasWidth * 0.0075);
        const x = canvasWidth * DISPLAY_MARGIN;
        const y = canvasWidth * DISPLAY_MARGIN;
        const w = canvasWidth * DISPLAY_WIDTH;
        const h = canvasHeight - canvasWidth * DISPLAY_MARGIN * 2;

        p.rect(x, y, w, h);

        grid.forEach(row => {
            row.forEach(col => {});
        });

        p.pop();
    }

    drawCell({ y, x }: Coordinates) {
        const { p, canvasWidth, cellSize, grid, colorEnabled } = this;

        const displayMargin = canvasWidth * DISPLAY_MARGIN;
        const image = this.cellService.getCellImage(grid[y][x], colorEnabled);

        x = displayMargin + cellSize * x;
        y = displayMargin + cellSize * y;
        let w = cellSize;
        let h = cellSize;

        p.image(image, x, y, w, h);
    }

    draw() {
        this.p.background(BACKGROUND_COLOR);

        this.drawDisplay();

        this.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.drawCell({ y, x });
            });
        });
    }
}

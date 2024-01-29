import * as P5 from 'p5';
import { GRID_X, GRID_Y, DISPLAY_MARGIN, DISPLAY_WIDTH, BACKGROUND_COLOR, FONT_COLOR, FONT_TURNED_OFF_COLOR } from './../constants';
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

    drawHud() {
        const { p, canvasWidth, canvasHeight } = this;

        p.push();

        p.textFont('retro-gamming');
        p.textSize(canvasWidth * 0.065);
        p.fill(FONT_COLOR);

        p.text('Score', canvasWidth * 0.72, canvasHeight * 0.08);
        p.text('0', canvasWidth * 0.72, canvasHeight * 0.14);

        p.text('Hi-Score', canvasWidth * 0.72, canvasHeight * 0.22);
        p.text('0', canvasWidth * 0.72, canvasHeight * 0.28);

        p.text('Level', canvasWidth * 0.72, canvasHeight * 0.72);
        p.text('1 -10', canvasWidth * 0.72, canvasHeight * 0.78);

        p.fill(FONT_TURNED_OFF_COLOR);

        p.text('Paused', canvasWidth * 0.75, canvasHeight * 0.88);
        p.text('Muted', canvasWidth * 0.765, canvasHeight * 0.94);

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
        const { p, grid } = this;

        p.background(BACKGROUND_COLOR);

        this.drawDisplay();
        this.drawHud();

        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.drawCell({ y, x });
            });
        });
    }
}

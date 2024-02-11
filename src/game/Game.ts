import * as P5 from 'p5';
import {
    CELL_INNER_MARGIN,
    CELL_OUTER_MARGIN,
    CELL_STROKE_WEIGHT,
    GRID_X,
    GRID_Y,
    DISPLAY_MARGIN,
    DISPLAY_WIDTH,
    BACKGROUND_COLOR,
    FONT_COLOR,
    FONT_TURNED_OFF_COLOR,
} from './../constants';
import Cell from '../interface/Cell';
import Color from '../enum/Color';
import Coordinates from '../interface/Coordinates';

import Body from '../body/Body';

interface GameProps {
    p: P5;
    canvasWidth: number;
    canvasHeight: number;
    body: Body;
}

export default class Game {
    private p: P5;

    private canvasWidth: number;
    private canvasHeight: number;

    private body: Body;

    private grid: Cell[][];

    private colorEnabled: boolean;

    private cellSize: number;

    constructor(props: GameProps) {
        this.p = props.p;
        this.canvasWidth = props.canvasWidth;
        this.canvasHeight = props.canvasHeight;
        this.body = props.body;

        this.colorEnabled = true;

        this.cellSize = (this.canvasWidth * DISPLAY_WIDTH) / GRID_X;

        this.resetGrid();
    }

    resetGrid() {
        this.grid = Array(GRID_Y).fill(Array(GRID_X).fill({ value: 0, color: Color.DEFAULT }));
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

        p.pop();

        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.drawCell({ y, x });
            });
        });
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

        let posX = displayMargin + cellSize * x;
        let posY = displayMargin + cellSize * y;
        let w = cellSize;
        let h = cellSize;

        let color: Color;
        if (grid[y][x].value !== 0) {
            if (colorEnabled) {
                color = grid[y][x].color;
            } else {
                color = Color.DEFAULT;
            }
        } else {
            color = Color.INACTIVE;
        }

        let margin = w * CELL_OUTER_MARGIN;
        let innerMargin = w * CELL_INNER_MARGIN;

        //Draw cell
        p.push();

        p.noFill();

        p.stroke(color);
        p.strokeWeight(w * CELL_STROKE_WEIGHT);

        p.rect(posX + margin, posY + margin, w - margin * 2, h - margin * 2);

        p.fill(color);

        p.rect(posX + innerMargin, posY + innerMargin, w - innerMargin * 2, h - innerMargin * 2);

        p.pop();
    }

    draw() {
        const { p, grid } = this;

        p.background(BACKGROUND_COLOR);

        this.drawDisplay();
        this.drawHud();
    }

    pressOnOff(game: Game) {
        console.log('on off');
    }
    pressStartPause(game: Game) {
        console.log('start pause');
    }
    pressSound(game: Game) {
        console.log('sound');
    }
    pressReset(game: Game) {
        console.log('reset');
    }
    pressExit(game: Game) {
        console.log('exit');
        game.body.unbound();
    }
    pressEnableColor(game: Game) {
        console.log('enable color');
    }

    pressUp(game: Game) {
        console.log('up');
    }
    pressDown(game: Game) {
        console.log('down');
    }
    pressRight(game: Game) {
        console.log('right');
    }
    pressLeft(game: Game) {
        console.log('left');
    }

    pressAction(game: Game) {
        console.log('action');
    }
}

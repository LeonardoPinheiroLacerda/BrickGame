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
    SMALL_FONT_SIZE,
    MEDIUM_FONT_SIZE,
    LARGE_FONT_SIZE,
} from './../constants';
import Cell from '../interface/Cell';
import Color from '../enum/Color';
import Coordinates from '../interface/Coordinates';
import GameState from '../interface/GameState';

import Body from '../body/Body';
import GameControls from './GameControls';
import GameSound from './GameSound';

interface GameProps {
    p: P5;
    canvasWidth: number;
    canvasHeight: number;
    body: Body;
}

export default class Game {
    private p: P5;

    private defaultFontFamily: String = 'retro-gamming';

    private smFontSize: number;
    private mdFontSize: number;
    private lgFontSize: number;

    private canvasWidth: number;
    private canvasHeight: number;

    private displayWidth: number;
    private displayHeight: number;

    private grid: Cell[][];

    private state: GameState = {
        on: false,
        start: false,
        gameOver: false,
        colorEnabled: true,
        running: false,
    };

    public score: number = 0;
    public hiScoreValue: number = 0;
    public hiScoreKey: string = 'hiScore';
    public level: number = 1;
    private maxLevel: number = 10;

    private cellSize: number;

    private gameSound: GameSound;
    private controls: GameControls;
    private body: Body;

    private tickInterval: number = 30;
    private actualFrame: number = 0;

    constructor(props: GameProps) {
        this.p = props.p;
        this.canvasWidth = props.canvasWidth;
        this.canvasHeight = props.canvasHeight;
        this.body = props.body;

        this.cellSize = (this.canvasWidth * DISPLAY_WIDTH) / GRID_X;

        this.resetGrid();

        this.gameSound = new GameSound();
        this.controls = new GameControls();
        this.controls.bound(this);
    }

    resetGrid() {
        this.grid = [];
        for (let y = 0; y < GRID_Y; y++) {
            this.grid[y] = [];
            for (let x = 0; x < GRID_X; x++) {
                this.grid[y][x] = this.emptyCell();
            }
        }
    }

    drawDisplay() {
        const { p, canvasWidth, canvasHeight, grid } = this;

        p.background(BACKGROUND_COLOR);

        p.push();
        p.noFill();

        p.strokeWeight(this.getRelativeValue(0.0075));
        const x = canvasWidth * DISPLAY_MARGIN;
        const y = canvasWidth * DISPLAY_MARGIN;
        const w = canvasWidth * DISPLAY_WIDTH;
        const h = canvasHeight - canvasWidth * DISPLAY_MARGIN * 2;

        this.displayWidth = w;
        this.displayHeight = h;

        p.rect(x, y, w, h);

        p.pop();

        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.drawCell({ y, x });
            });
        });
    }

    getDisplayPosX(x: number): number {
        return this.displayWidth * x + this.canvasWidth * DISPLAY_MARGIN;
    }
    getDisplayPosY(y: number): number {
        return this.displayHeight * y + this.canvasWidth * DISPLAY_MARGIN;
    }

    getHudPosX(x: number): number {
        const zero = this.displayWidth + DISPLAY_MARGIN * this.canvasWidth * 2;
        const width = this.canvasWidth - zero - DISPLAY_MARGIN * this.canvasWidth;
        return width * x + zero;
    }
    getHudPosY(y: number): number {
        return DISPLAY_MARGIN * this.canvasWidth + this.displayHeight * y;
    }

    getCanvasPosX(x: number): number {
        return this.canvasWidth * x;
    }
    getCanvasPosY(y: number): number {
        return this.canvasHeight * y;
    }

    getRelativeValue(size: number): number {
        return this.canvasWidth * size;
    }

    drawHud() {
        const { p } = this;

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.smFontSize);
        p.textAlign(p.LEFT, p.TOP);

        if (this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);

        p.text('Score', this.getHudPosX(0.05), this.getHudPosY(0.01));
        p.text(this.score, this.getHudPosX(0.05), this.getHudPosY(0.08));

        p.text('Hi-Score', this.getHudPosX(0.05), this.getHudPosY(0.18));
        p.text(this.hiScoreValue, this.getHudPosX(0.05), this.getHudPosY(0.25));

        p.text('Level', this.getHudPosX(0.05), this.getHudPosY(0.68));
        p.text(`${this.level} - ${this.maxLevel}`, this.getHudPosX(0.05), this.getHudPosY(0.75));

        p.textAlign(p.CENTER, p.TOP);

        if (!this.state.start && this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);

        p.text('Paused', this.getHudPosX(0.5), this.getHudPosY(0.85));

        if (this.gameSound.getMute() && this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);

        p.text('Muted', this.getHudPosX(0.5), this.getHudPosY(0.92));

        p.pop();
    }

    drawCell({ y, x }: Coordinates) {
        const { p, canvasWidth, cellSize, grid, state } = this;

        const displayMargin = canvasWidth * DISPLAY_MARGIN;

        let posX = displayMargin + cellSize * x;
        let posY = displayMargin + cellSize * y;
        let w = cellSize;
        let h = cellSize;

        let color: Color;
        if (grid[y][x].value !== 0) {
            if (state.colorEnabled) {
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

    drawFrame() {
        this.drawDisplay();
        this.drawHud();

        this.smFontSize = this.getRelativeValue(SMALL_FONT_SIZE);
        this.mdFontSize = this.getRelativeValue(MEDIUM_FONT_SIZE);
        this.lgFontSize = this.getRelativeValue(LARGE_FONT_SIZE);

        if (!this.state.on) return;

        if (!this.state.gameOver && this.state.start && this.state.running) {
            this.actualFrame++;

            if (this.actualFrame % this.tickInterval === 0) {
                this.processTick();
            }
            this.processFrame();
        } else if (!this.state.start && !this.state.running) {
            this.drawWelcome();
        } else if (this.state.gameOver) {
            this.drawGameOver();
        }
    }

    drawWelcome() {
        const { p } = this;

        p.textFont(this.defaultFontFamily);
        p.textSize(this.lgFontSize);

        p.push();

        p.fill(FONT_COLOR);

        p.textAlign(p.CENTER, p.CENTER);

        p.text('Game Brick', this.getDisplayPosX(0.5), this.getDisplayPosY(0.5));

        p.pop();
    }

    drawGameOver() {
        const { p } = this;

        p.textFont(this.defaultFontFamily);
        p.textSize(this.lgFontSize);

        p.push();

        p.fill(FONT_COLOR);

        p.textAlign(p.CENTER, p.CENTER);

        p.text('Game Over', this.getDisplayPosX(0.5), this.getDisplayPosY(0.5));

        p.pop();
    }

    getGameSound() {
        return this.gameSound;
    }

    getControls() {
        return this.controls;
    }

    getBody() {
        return this.body;
    }

    getP() {
        return this.p;
    }

    getState() {
        return this.state;
    }

    emptyCell() {
        return { color: Color.DEFAULT, value: 0 };
    }

    processTick() {}
    processFrame() {}
}

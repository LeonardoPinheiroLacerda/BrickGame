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
    EXTRA_SMALL_FONT_SIZE,
    SMALL_FONT_SIZE,
    MEDIUM_FONT_SIZE,
    LARGE_FONT_SIZE,
    EXTRA_LARGE_FONT_SIZE,
} from './../constants';
import Cell from '../interface/Cell';
import Color from '../enum/Color';
import Coordinates from '../interface/Coordinates';
import GameState from '../interface/GameState';

import Body from '../body/Body';
import GameControls from './GameControls';
import GameSound from './GameSound';
import GameProps from '../interface/GameProps';

export default class Game {
    protected p: P5;

    protected defaultFontFamily: string = 'retro-gamming';

    protected xsmFontSize: number;
    protected smFontSize: number;
    protected mdFontSize: number;
    protected lgFontSize: number;
    protected xlgFontSize: number;

    public canvasWidth: number;
    public canvasHeight: number;

    protected displayWidth: number;
    protected displayHeight: number;

    protected grid: Cell[][];

    protected state: GameState = {
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
    protected maxLevel: number = 10;

    protected cellSize: number;

    protected gameSound: GameSound = new GameSound();
    protected controls: GameControls = new GameControls();
    protected body: Body;

    protected tickInterval: number = 30;
    protected actualFrame: number = 0;

    constructor(props: GameProps) {
        this.p = props.p;
        this.canvasWidth = props.canvasWidth;
        this.canvasHeight = props.canvasHeight;
        this.body = props.body;

        this.cellSize = this.getRelativeValue(DISPLAY_WIDTH) / GRID_X;

        this.resetGrid();

        this.controls.bound(this);

        this.setup();
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
        return this.displayWidth * x + this.getRelativeValue(DISPLAY_MARGIN);
    }
    getDisplayPosY(y: number): number {
        return this.displayHeight * y + this.getRelativeValue(DISPLAY_MARGIN);
    }

    getHudPosX(x: number): number {
        const zero = this.displayWidth + this.getRelativeValue(DISPLAY_MARGIN) * 2;
        const width = this.canvasWidth - zero - this.getRelativeValue(DISPLAY_MARGIN);
        return width * x + zero;
    }
    getHudPosY(y: number): number {
        return this.getRelativeValue(DISPLAY_MARGIN) + this.displayHeight * y;
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

        if (!this.state.running) return;

        //Paused text
        if (!this.state.start && this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);
        p.text('Paused', this.getHudPosX(0.5), this.getHudPosY(0.85));

        //Muted text
        if (this.gameSound.getMute() && this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);
        p.text('Muted', this.getHudPosX(0.5), this.getHudPosY(0.92));

        p.pop();
    }

    drawCell({ y, x }: Coordinates) {
        const { p, canvasWidth, cellSize, grid, state } = this;

        const displayMargin = canvasWidth * DISPLAY_MARGIN;

        const posX = displayMargin + cellSize * x;
        const posY = displayMargin + cellSize * y;
        const w = cellSize;
        const h = cellSize;

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

        const margin = w * CELL_OUTER_MARGIN;
        const innerMargin = w * CELL_INNER_MARGIN;

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
        this.draw();

        this.xsmFontSize = this.getRelativeValue(EXTRA_SMALL_FONT_SIZE);
        this.smFontSize = this.getRelativeValue(SMALL_FONT_SIZE);
        this.mdFontSize = this.getRelativeValue(MEDIUM_FONT_SIZE);
        this.lgFontSize = this.getRelativeValue(LARGE_FONT_SIZE);
        this.xlgFontSize = this.getRelativeValue(EXTRA_LARGE_FONT_SIZE);

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

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.mdFontSize);

        p.fill(FONT_COLOR);

        p.textAlign(p.CENTER, p.CENTER);

        p.text('Game Brick', this.getDisplayPosX(0.5), this.getDisplayPosY(0.5));

        p.pop();
    }

    drawGameOver() {
        const { p } = this;

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.mdFontSize);

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

    changeGame(nameSpace: string, className: string) {
        this.controls.unbound(this);
        this.body.unbound();
        this.gameSound.stopAll();

        // const gameClass = require(`./${className}/${className}`);
        // const gameClass = require('./menu/GameMenu').default;
        const gameClass = require(`./${nameSpace}/${className}`).default;

        console.log(gameClass);

        const args: GameProps = {
            p: this.getP(),
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            body: this.getBody(),
        };

        const g = new gameClass(args);

        g.getControls().pressOnOff(g);

        this.getBody().bound(g);

        this.getP().draw = () => {
            g.drawFrame();
        };
    }

    processTick() {}
    processFrame() {}
    draw() {}
    setup() {}
}

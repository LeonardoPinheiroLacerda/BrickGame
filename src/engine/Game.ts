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
    HUD_GRID_Y,
    HUD_GRID_X,
} from '../constants';
import Cell from '../interface/Cell';
import Color from '../enum/Color';
import Coordinates from '../interface/Coordinates';
import GameState from '../interface/GameState';

import GameBody from './body/GameBody';
import GameControls from './GameControls';
import GameSound from './GameSound';
import GameProps from '../interface/GameProps';
import CellElement from '../interface/CellElement';

export default class Game {
    protected p: P5;

    protected defaultFontFamily: string = 'retro-gamming';

    protected xsmFontSize: number;
    protected smFontSize: number;
    protected mdFontSize: number;
    protected lgFontSize: number;
    protected xlgFontSize: number;

    protected canvasWidth: number;
    protected canvasHeight: number;

    protected displayWidth: number;
    protected displayHeight: number;

    protected grid: Cell[][];
    protected hudGrid: Cell[][];

    protected state: GameState = {
        on: false,
        start: false,
        gameOver: false,
        colorEnabled: true,
        running: false,
    };

    protected score: number = 0;
    protected hiScoreValue: number = 0;
    protected hiScoreKey: string = 'hiScore';
    protected level: number = 1;
    protected maxLevel: number = 10;

    protected cellSize: number;

    protected gameSound: GameSound = new GameSound();
    protected controls: GameControls = new GameControls();
    protected body: GameBody;

    protected initialTickInterval: number = 30;
    protected tickInterval: number = this.initialTickInterval;

    constructor(props: GameProps) {
        this.p = props.p;
        this.canvasWidth = props.canvasWidth;
        this.canvasHeight = props.canvasHeight;
        this.body = props.body;

        this.cellSize = this.getRelativeValue(DISPLAY_WIDTH) / GRID_X;

        this.resetGrid();

        this.controls.bound(this);

        //Primeira renderização
        this.drawFrame();

        //Define o tamanho das fontes
        this.xsmFontSize = this.getRelativeValue(EXTRA_SMALL_FONT_SIZE);
        this.smFontSize = this.getRelativeValue(SMALL_FONT_SIZE);
        this.mdFontSize = this.getRelativeValue(MEDIUM_FONT_SIZE);
        this.lgFontSize = this.getRelativeValue(LARGE_FONT_SIZE);
        this.xlgFontSize = this.getRelativeValue(EXTRA_LARGE_FONT_SIZE);
    }

    async resetGrid(): Promise<void> {
        this.grid = [];
        for (let y = 0; y < GRID_Y; y++) {
            this.grid[y] = [];
            for (let x = 0; x < GRID_X; x++) {
                this.grid[y][x] = this.emptyCell();
            }
        }

        this.hudGrid = [];
        for (let y = 0; y < HUD_GRID_Y; y++) {
            this.hudGrid[y] = [];
            for (let x = 0; x < HUD_GRID_X; x++) {
                this.hudGrid[y][x] = this.emptyCell();
            }
        }
    }

    async drawDisplay(): Promise<void> {
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

    async drawHud(): Promise<void> {
        const { p } = this;

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.smFontSize);

        p.fill(FONT_TURNED_OFF_COLOR);
        p.textAlign(p.LEFT, p.BASELINE);

        p.text('88888888', this.getHudPosX(0.05), this.getHudPosY(0.13));
        p.text('88888888', this.getHudPosX(0.05), this.getHudPosY(0.3));
        p.text(`00 - 00`, this.getHudPosX(0.05), this.getHudPosY(0.8));

        p.textAlign(p.LEFT, p.BASELINE);

        if (this.state.on) p.fill(FONT_COLOR);
        else p.fill(FONT_TURNED_OFF_COLOR);

        p.text('Score', this.getHudPosX(0.05), this.getHudPosY(0.06));
        p.text(this.score, this.getHudPosX(0.05), this.getHudPosY(0.13));

        p.text('Hi-Score', this.getHudPosX(0.05), this.getHudPosY(0.23));
        p.text(this.hiScoreValue, this.getHudPosX(0.05), this.getHudPosY(0.3));

        p.text('Level', this.getHudPosX(0.05), this.getHudPosY(0.72));
        p.text(`${this.level < 10 ? '0' + this.level : this.level} - ${this.maxLevel}`, this.getHudPosX(0.05), this.getHudPosY(0.8));

        p.textAlign(p.CENTER, p.BASELINE);

        if (this.state.running) {
            //Paused text
            if (!this.state.start && this.state.on) p.fill(FONT_COLOR);
            else p.fill(FONT_TURNED_OFF_COLOR);
            p.text('Paused', this.getHudPosX(0.5), this.getHudPosY(0.9));

            //Muted text
            if (this.gameSound.getMute() && this.state.on) p.fill(FONT_COLOR);
            else p.fill(FONT_TURNED_OFF_COLOR);
            p.text('Muted', this.getHudPosX(0.5), this.getHudPosY(0.97));
        } else {
            p.fill(FONT_TURNED_OFF_COLOR);
            p.text('Paused', this.getHudPosX(0.5), this.getHudPosY(0.9));
            p.text('Muted', this.getHudPosX(0.5), this.getHudPosY(0.97));
        }

        p.pop();

        this.drawHudGrid();
    }

    async drawHudGrid() {
        const coordY = this.getHudPosY(0.375);
        const coordX = this.getHudPosX(0.078);

        this.p.push();

        this.hudGrid.forEach((row, y) => {
            row.forEach((column, x) => {
                if ((this.state.on === false || this.state.start === false) && this.state.running === false) {
                    column = this.emptyCell();
                }

                let color = column.value !== 0 ? Color.DEFAULT : Color.INACTIVE;

                if (this.state.colorEnabled && column.value !== 0) {
                    color = column.color;
                }

                this.drawCellElement({
                    w: this.cellSize,
                    h: this.cellSize,
                    posX: coordX + this.cellSize * x,
                    posY: coordY + this.cellSize * y,
                    color,
                });
            });
        });

        this.p.noFill();
        this.p.stroke(this.state.on ? FONT_COLOR : FONT_TURNED_OFF_COLOR);
        this.p.rect(
            coordX - this.getRelativeValue(0.005),
            coordY - this.getRelativeValue(0.005),
            this.cellSize * 4 + this.getRelativeValue(0.01),
            this.cellSize * 4 + this.getRelativeValue(0.01),
        );
        this.p.pop();
    }

    async registerHiScore(): Promise<void> {
        const oldHiScore = this.getHiScore();

        if (this.score >= oldHiScore) {
            localStorage.setItem(this.hiScoreKey, this.score.toString());
        }

        this.hiScoreValue = this.getHiScore();
    }

    getHiScore(): number {
        return isNaN(parseInt(localStorage.getItem(this.hiScoreKey))) ? 0 : parseInt(localStorage.getItem(this.hiScoreKey));
    }

    async drawCell({ y, x }: Coordinates, grid: Cell[][] = this.grid): Promise<void> {
        const { canvasWidth, cellSize, state } = this;

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

        //Draw cell
        this.drawCellElement({ w, h, posX, posY, color });
    }

    async drawCellElement(cellElement: CellElement): Promise<void> {
        const { p } = this;

        const { w, h, posX, posY, color } = cellElement;

        const margin = w * CELL_OUTER_MARGIN;
        const innerMargin = w * CELL_INNER_MARGIN;

        p.push();

        p.noFill();

        p.stroke(color);
        p.strokeWeight(w * CELL_STROKE_WEIGHT);

        p.rect(posX + margin, posY + margin, w - margin * 2, h - margin * 2);

        p.fill(color);

        p.rect(posX + innerMargin, posY + innerMargin, w - innerMargin * 2, h - innerMargin * 2);

        p.pop();
    }

    async drawFrame(): Promise<void> {
        this.drawDisplay();
        this.drawHud();
        this.draw();

        if (!this.state.on) return;

        if (!this.state.gameOver && this.state.start && this.state.running) {
            if (this.p.frameCount % this.tickInterval === 0) {
                this.verifyGrids();
                this.processTick();
            }
            this.processFrame();
        } else if (!this.state.start && !this.state.running) {
            this.drawWelcome();
        } else if (this.state.gameOver) {
            this.drawGameOver();
        }
    }

    async drawWelcome(): Promise<void> {
        const { p } = this;

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.mdFontSize);

        p.fill(FONT_COLOR);

        p.textAlign(p.CENTER, p.CENTER);

        p.text('Game Brick', this.getDisplayPosX(0.5), this.getDisplayPosY(0.5));

        p.pop();
    }

    async drawGameOver(): Promise<void> {
        const { p } = this;

        p.push();

        p.textFont(this.defaultFontFamily);
        p.textSize(this.lgFontSize);

        p.fill(FONT_COLOR);

        p.textAlign(p.CENTER, p.CENTER);

        p.text('Game Over', this.getDisplayPosX(0.5), this.getDisplayPosY(0.5));

        p.pop();
    }

    gameOver() {
        this.registerHiScore();
        this.state.gameOver = true;
        this.state.running = false;
    }

    getGameSound(): GameSound {
        return this.gameSound;
    }

    getControls(): GameControls {
        return this.controls;
    }

    getBody(): GameBody {
        return this.body;
    }

    getP(): P5 {
        return this.p;
    }

    getState(): GameState {
        return this.state;
    }

    getGrid(): Cell[][] {
        return this.grid;
    }

    emptyCell(): Cell {
        return { color: Color.DEFAULT, value: 0 };
    }

    emptyRow() {
        const emptyRow: Cell[] = [];
        for (let x = 0; x < GRID_X; x++) {
            emptyRow.push(this.emptyCell());
        }
        return emptyRow;
    }

    changeGame(nameSpace: string, className: string): void {
        this.unbound();
        this.bound(nameSpace, className);
    }

    private unbound(): void {
        this.controls.unbound(this);
        this.body.unbound();
        this.gameSound.stopAll();
    }

    private bound(nameSpace: string, className: string): void {
        const gameClass = require(`../${nameSpace}/${className}`).default;

        const props: GameProps = {
            p: this.p,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            body: this.body,
        };

        const obj = new gameClass(props);

        obj.getControls().pressOnOff(obj);
        this.body.bound(obj);

        this.p.draw = () => {
            obj.drawFrame();
        };
    }

    private verifyGrids() {
        if (this.hudGrid.length !== HUD_GRID_Y || this.hudGrid.some(g => g.length !== HUD_GRID_X)) {
            throw `The property hudGrid must be a ${HUD_GRID_Y}x${HUD_GRID_X} matrix.`;
        }
        if (this.grid.length !== GRID_Y || this.grid.some(g => g.length !== GRID_X)) {
            throw `The property grid must be a ${GRID_Y}x${GRID_X} matrix.`;
        }
    }

    protected processTick(): void {}
    protected processFrame(): void {}
    protected async draw(): Promise<void> {}
    reset(): void {
        this.level = 1;
        this.score = 0;
        this.resetGrid();
    }
}

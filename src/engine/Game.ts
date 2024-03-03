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
import FontSize from '../enum/FontSize';
import FontAlign from '../enum/FontAlign';

export default class Game {
    protected p: P5;

    protected defaultFontFamily: string = 'retro-gamming';

    private fontSizes: number[] = [0];

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
        this.fontSizes = [];
        this.fontSizes.push(this.getRelativeValue(EXTRA_SMALL_FONT_SIZE));
        this.fontSizes.push(this.getRelativeValue(SMALL_FONT_SIZE));
        this.fontSizes.push(this.getRelativeValue(MEDIUM_FONT_SIZE));
        this.fontSizes.push(this.getRelativeValue(LARGE_FONT_SIZE));
        this.fontSizes.push(this.getRelativeValue(EXTRA_LARGE_FONT_SIZE));

        //Define fonte padrão
        this.p.textFont(this.defaultFontFamily);
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

    getRelativeValue(size: number): number {
        return this.canvasWidth * size;
    }

    protected setTextState(state: boolean): void {
        this.p.fill(state ? FONT_COLOR : FONT_TURNED_OFF_COLOR);
    }

    protected setTextSize(fontSize: FontSize): void {
        this.p.textSize(this.fontSizes[fontSize]);
    }

    // protected setTextAlign(horizontalAlign: P5.HORIZ_ALIGN): void {
    //     this.p.textAlign(horizontalAlign, this.p.BASELINE);
    // }

    protected setTextAlign(fontAlign: FontAlign): void {
        this.p.textAlign(fontAlign, this.p.BASELINE);
    }

    protected textOnHud(text: any, coord: Coordinates) {
        this.p.text(text, this.getHudPosX(coord.x), this.getHudPosY(coord.y));
    }

    protected textOnDisplay(text: any, coord: Coordinates) {
        this.p.text(text, this.getDisplayPosX(coord.x), this.getDisplayPosY(coord.y));
    }

    async drawHud(): Promise<void> {
        const { p } = this;

        p.push();

        this.setTextSize(FontSize.SMALL);
        this.setTextState(false);
        this.setTextAlign(FontAlign.LEFT);

        this.textOnHud('88888888', { x: 0.05, y: 0.13 });
        this.textOnHud('88888888', { x: 0.05, y: 0.3 });
        this.textOnHud('88 - 88', { x: 0.05, y: 0.8 });

        this.setTextState(this.state.on);

        this.textOnHud('Score', { x: 0.05, y: 0.06 });
        this.textOnHud(this.score, { x: 0.05, y: 0.13 });

        this.textOnHud('Hi-Score', { x: 0.05, y: 0.23 });
        this.textOnHud(this.hiScoreValue, { x: 0.05, y: 0.3 });

        this.textOnHud('Level', { x: 0.05, y: 0.72 });
        const levelValue = `${this.level < 10 ? '0' + this.level : this.level} - ${this.maxLevel}`;
        this.textOnHud(levelValue, { x: 0.05, y: 0.8 });

        this.setTextAlign(FontAlign.CENTER);

        if (this.state.running) {
            //Paused text
            this.setTextState(!this.state.start && this.state.on);
            this.textOnHud('Paused', { x: 0.5, y: 0.9 });

            //Muted text
            this.setTextState(this.gameSound.getMute() && this.state.on);
            this.textOnHud('Muted', { x: 0.5, y: 0.97 });
        } else {
            this.setTextState(false);
            this.textOnHud('Paused', { x: 0.5, y: 0.9 });
            this.textOnHud('Muted', { x: 0.5, y: 0.97 });
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

        this.setTextSize(FontSize.MEDIUM);
        this.setTextState(true);
        this.setTextAlign(FontAlign.CENTER);

        this.textOnDisplay('Game Brick', { x: 0.5, y: 0.5 });

        p.pop();
    }

    async drawGameOver(): Promise<void> {
        const { p } = this;

        p.push();

        this.setTextSize(FontSize.LARGE);
        this.setTextState(true);
        this.setTextAlign(FontAlign.CENTER);

        this.textOnDisplay('Game Over', { x: 0.5, y: 0.5 });

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

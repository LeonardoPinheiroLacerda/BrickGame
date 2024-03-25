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
import GameCoordinates from './GameCoordinates';
import GameTexts from './GameTexts';
import GameUtils from './GameUtils';
import GameScore from './GameScore';

export default class Game {
    protected p: P5;

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

    protected cellSize: number;

    protected gameSound: GameSound = new GameSound();
    protected gameCoordinates: GameCoordinates = new GameCoordinates(this);
    protected gameTexts: GameTexts = new GameTexts(this);
    protected gameUtils: GameUtils = new GameUtils();
    protected gameScore: GameScore = new GameScore();
    protected gameControls: GameControls = new GameControls();
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

        this.gameControls.bound(this);

        //Primeira renderização
        this.drawFrame();

        //Define fonte padrão
        this.gameTexts.defineFont();
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

    async drawHud(): Promise<void> {
        const { p } = this;

        p.push();

        this.gameTexts.setTextSize(FontSize.SMALL);
        this.gameTexts.setTextState(false);
        this.gameTexts.setTextAlign(FontAlign.LEFT);

        this.gameTexts.textOnHud('88888888', { x: 0.05, y: 0.13 });
        this.gameTexts.textOnHud('88888888', { x: 0.05, y: 0.3 });
        this.gameTexts.textOnHud('88 - 88', { x: 0.05, y: 0.8 });

        this.gameTexts.setTextState(this.state.on);

        this.gameTexts.textOnHud('Score', { x: 0.05, y: 0.06 });
        this.gameTexts.textOnHud(this.gameScore.score, { x: 0.05, y: 0.13 });

        this.gameTexts.textOnHud('Hi-Score', { x: 0.05, y: 0.23 });
        this.gameTexts.textOnHud(this.gameScore.hiScoreValue, { x: 0.05, y: 0.3 });

        this.gameTexts.textOnHud('Level', { x: 0.05, y: 0.72 });
        const levelValue = `${this.gameScore.level < 10 ? '0' + this.gameScore.level : this.gameScore.level} - ${this.gameScore.maxLevel}`;
        this.gameTexts.textOnHud(levelValue, { x: 0.05, y: 0.8 });

        this.gameTexts.setTextAlign(FontAlign.CENTER);

        if (this.state.running) {
            //Paused text
            this.gameTexts.setTextState(!this.state.start && this.state.on);
            this.gameTexts.textOnHud('Paused', { x: 0.5, y: 0.9 });

            //Muted text
            this.gameTexts.setTextState(this.gameSound.mute && this.state.on);
            this.gameTexts.textOnHud('Muted', { x: 0.5, y: 0.97 });
        } else {
            this.gameTexts.setTextState(false);
            this.gameTexts.textOnHud('Paused', { x: 0.5, y: 0.9 });
            this.gameTexts.textOnHud('Muted', { x: 0.5, y: 0.97 });
        }

        p.pop();

        this.drawHudGrid();
    }

    async drawHudGrid() {
        const coordY = this.gameCoordinates.getHudPosY(0.375);
        const coordX = this.gameCoordinates.getHudPosX(0.078);

        this.p.push();

        this.hudGrid.forEach((row, y) => {
            row.forEach((column, x) => {
                if ((this.state.on === false || this.state.start === false) && this.state.running === false) {
                    column = this.gameUtils.emptyCell();
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

        this.gameTexts.setTextSize(FontSize.MEDIUM);
        this.gameTexts.setTextState(true);
        this.gameTexts.setTextAlign(FontAlign.CENTER);

        this.gameTexts.textOnDisplay('Game Brick', { x: 0.5, y: 0.5 });

        p.pop();
    }

    async drawGameOver(): Promise<void> {
        const { p } = this;

        p.push();

        this.gameTexts.setTextSize(FontSize.LARGE);
        this.gameTexts.setTextState(true);
        this.gameTexts.setTextAlign(FontAlign.CENTER);

        this.gameTexts.textOnDisplay('Game Over', { x: 0.5, y: 0.5 });

        p.pop();
    }

    async resetGrid(): Promise<void> {
        this.grid = [];
        for (let y = 0; y < GRID_Y; y++) {
            this.grid[y] = [];
            for (let x = 0; x < GRID_X; x++) {
                this.grid[y][x] = this.gameUtils.emptyCell();
            }
        }

        this.hudGrid = [];
        for (let y = 0; y < HUD_GRID_Y; y++) {
            this.hudGrid[y] = [];
            for (let x = 0; x < HUD_GRID_X; x++) {
                this.hudGrid[y][x] = this.gameUtils.emptyCell();
            }
        }
    }

    gameOver() {
        this.gameScore.updateHiScore();
        this.state.gameOver = true;
        this.state.running = false;
    }

    getRelativeValue(size: number): number {
        return this.canvasWidth * size;
    }

    getGameSound(): GameSound {
        return this.gameSound;
    }

    getGameCoordinates(): GameCoordinates {
        return this.gameCoordinates;
    }

    getGameUtils(): GameUtils {
        return this.gameUtils;
    }

    getGameScore(): GameScore {
        return this.gameScore;
    }

    getGameControls(): GameControls {
        return this.gameControls;
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

    getDisplayWidth(): number {
        return this.displayWidth;
    }

    getDisplayHeight(): number {
        return this.displayHeight;
    }

    getCanvasWidth(): number {
        return this.canvasWidth;
    }

    getCanvasHeight(): number {
        return this.canvasHeight;
    }

    changeGame(nameSpace: string, className: string): void {
        this.unbound();
        this.bound(nameSpace, className);
    }

    private unbound(): void {
        this.gameControls.unbound(this);
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

        obj.getGameControls().pressOnOff(obj);
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
        this.gameScore.resetLevel();
        this.gameScore.resetScore();
        this.resetGrid();
    }
}

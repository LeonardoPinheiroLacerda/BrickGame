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
    private _p: P5;

    private _canvasWidth: number;
    private _canvasHeight: number;

    private _displayWidth: number;
    private _displayHeight: number;

    private _grid: Cell[][];
    private _hudGrid: Cell[][];

    private _state: GameState = {
        on: false,
        start: false,
        gameOver: false,
        colorEnabled: true,
        running: false,
    };

    private _cellSize: number;

    private _body: GameBody;

    protected _initialTickInterval: number = 30;
    protected _tickInterval: number = this.initialTickInterval;

    private _gameSound: GameSound = new GameSound();
    private _gameCoordinates: GameCoordinates = new GameCoordinates(this);
    private _gameTexts: GameTexts = new GameTexts(this);
    private _gameUtils: GameUtils = new GameUtils();
    private _gameScore: GameScore = new GameScore();
    protected _gameControls: GameControls = new GameControls();

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

    private async drawCellElement(cellElement: CellElement): Promise<void> {
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

    public get canvasWidth(): number {
        return this._canvasWidth;
    }
    private set canvasWidth(value: number) {
        this._canvasWidth = value;
    }

    public get canvasHeight(): number {
        return this._canvasHeight;
    }
    private set canvasHeight(value: number) {
        this._canvasHeight = value;
    }

    public get displayWidth(): number {
        return this._displayWidth;
    }
    private set displayWidth(value: number) {
        this._displayWidth = value;
    }

    public get displayHeight(): number {
        return this._displayHeight;
    }
    private set displayHeight(value: number) {
        this._displayHeight = value;
    }

    public get p(): P5 {
        return this._p;
    }
    private set p(value: P5) {
        this._p = value;
    }

    public get grid(): Cell[][] {
        return this._grid;
    }
    protected set grid(value: Cell[][]) {
        this._grid = value;
    }

    public get hudGrid(): Cell[][] {
        return this._hudGrid;
    }
    protected set hudGrid(value: Cell[][]) {
        this._hudGrid = value;
    }

    public get state(): GameState {
        return this._state;
    }
    private set state(value: GameState) {
        this._state = value;
    }

    public get cellSize(): number {
        return this._cellSize;
    }
    private set cellSize(value: number) {
        this._cellSize = value;
    }

    public get body(): GameBody {
        return this._body;
    }
    private set body(value: GameBody) {
        this._body = value;
    }

    protected get initialTickInterval(): number {
        return this._initialTickInterval;
    }
    protected set initialTickInterval(value: number) {
        this._initialTickInterval = value;
    }

    public get tickInterval(): number {
        return this._tickInterval;
    }
    protected set tickInterval(value: number) {
        this._tickInterval = value;
    }

    public get gameSound(): GameSound {
        return this._gameSound;
    }
    private set gameSound(value: GameSound) {
        this._gameSound = value;
    }

    public get gameCoordinates(): GameCoordinates {
        return this._gameCoordinates;
    }
    private set gameCoordinates(value: GameCoordinates) {
        this._gameCoordinates = value;
    }

    public get gameTexts(): GameTexts {
        return this._gameTexts;
    }
    private set gameTexts(value: GameTexts) {
        this._gameTexts = value;
    }

    public get gameUtils(): GameUtils {
        return this._gameUtils;
    }
    private set gameUtils(value: GameUtils) {
        this._gameUtils = value;
    }

    public get gameScore(): GameScore {
        return this._gameScore;
    }
    private set gameScore(value: GameScore) {
        this._gameScore = value;
    }

    public get gameControls(): GameControls {
        return this._gameControls;
    }
    protected set gameControls(value: GameControls) {
        this._gameControls = value;
    }
}

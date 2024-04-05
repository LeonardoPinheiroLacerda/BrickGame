import Game from '../../engine/Game';
import Sound from '../../enum/Sound';
import Cell from '../../interface/Cell';
import TetrisControls from './TetrisControls';
import Piece from './piece/Piece';
import Piece1 from './piece/Piece1';
import Piece2 from './piece/Piece2';
import Piece3 from './piece/Piece3';
import Piece4 from './piece/Piece4';
import Piece5 from './piece/Piece5';
import Piece6 from './piece/Piece6';
import Piece7 from './piece/Piece7';

import { GRID_Y } from './../../constants';
import GameProps from '../../interface/GameProps';
import FontSize from '../../enum/FontSize';
import FontAlign from '../../enum/FontAlign';

export default class Tetris extends Game {
    private _next: Piece;
    private _current: Piece;
    private _actualId: number = 1;

    private _linesCompleted: number = 0;
    private _linesToLevelUp: number = 10;

    protected _initialTickInterval: number = 60;
    private _tickIntervalDecreaseOnLevelUp = 5;

    constructor(props: GameProps) {
        super(props);

        this.gameScore.setKey('hiTetrisScore');

        this.gameControls = new TetrisControls();
        this.gameControls.bound(this);

        this.generateNext();
    }

    reset() {
        super.reset();
        this.current = null;
        this.linesCompleted = 0;
        this.generateNext();
    }

    async drawWelcome(): Promise<void> {
        this.gameTexts.setTextSize(FontSize.EXTRA_LARGE);
        this.gameTexts.setTextAlign(FontAlign.CENTER);
        this.gameTexts.textOnDisplay('Tetris', { x: 0.5, y: 0.3 });

        this.gameTexts.setTextSize(FontSize.SMALL);
        this.gameTexts.textOnDisplay('Press start to play', { x: 0.5, y: 0.42 });

        this.gameTexts.setTextSize(FontSize.EXTRA_SMALL);
        this.gameTexts.setTextAlign(FontAlign.LEFT);

        this.gameTexts.textOnDisplay('Up:     Rotate', { x: 0.075, y: 0.7 });
        this.gameTexts.textOnDisplay('Down:   Move down faster', { x: 0.075, y: 0.75 });
        this.gameTexts.textOnDisplay('Left:   Move left', { x: 0.075, y: 0.8 });
        this.gameTexts.textOnDisplay('Right:  Move right', { x: 0.075, y: 0.85 });
        this.gameTexts.textOnDisplay('Action: Rotate', { x: 0.075, y: 0.9 });
    }

    protected processTick(): void {
        if (this.state.gameOver) return;

        const canMove = this.current?.move(this, { y: 1, x: 0 });
        const hasCurrent = this.current;

        if (!canMove || !hasCurrent) {
            this.checkScore();
            this.spawn();
            this.checkGameOver();

            if (!canMove && hasCurrent && !this.state.gameOver) {
                this.gameSound.play(Sound.SPAWN);
            }
        }

        if (this.state.gameOver) {
            this.current = null;
            this.resetGrid();
            this.gameSound.play(Sound.EXPLOSION);
        }

        this.tickInterval = this.initialTickInterval - this.gameScore.level * this.tickIntervalDecreaseOnLevelUp;
    }

    protected async draw(): Promise<void> {
        if (this.current && !this.state.gameOver) {
            this.current.parts.forEach(part => {
                this.grid[part.y][part.x] = { value: this.current.id, color: this.current.color };
            });
        }
    }

    getCurrent(): Piece {
        return this.current;
    }

    private generateNext(): void {
        const getRandomInt = (min: number, max: number) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const last = this.next;

        do {
            switch (getRandomInt(0, 6)) {
                case 0:
                    this.next = new Piece1(this.actualId);
                    break;
                case 1:
                    this.next = new Piece2(this.actualId);
                    break;
                case 2:
                    this.next = new Piece3(this.actualId);
                    break;
                case 3:
                    this.next = new Piece4(this.actualId);
                    break;
                case 4:
                    this.next = new Piece5(this.actualId);
                    break;
                case 5:
                    this.next = new Piece6(this.actualId);
                    break;
                case 6:
                    this.next = new Piece7(this.actualId);
                    break;
            }
        } while (last?.pieceId === this.next.pieceId && last);

        this.hudGrid = this.next.preview;
        this.actualId += 1;
    }

    private spawn(): void {
        this.current = this.next;
        this.generateNext();
    }

    private checkGameOver(): void {
        this.current?.parts.forEach(({ y, x }) => {
            if (this.grid[y][x].value !== 0) {
                this.gameOver();
            }
        });
    }

    private checkScore(): void {
        const { grid } = this;

        //Salva linhas completas em uma lista
        const linesCompletedList: Cell[][] = [];

        grid.forEach(row => {
            if (row.filter(col => col.value === 0).length === 0) {
                linesCompletedList.push(row);
                console.log(row);
            }
        });

        if (linesCompletedList.length > 0) {
            //Incrementa o score de acordo com o numero de linhas completas
            if (linesCompletedList.length === 1) {
                this.gameScore.incrementScore(10 * this.gameScore.level);
            } else if (linesCompletedList.length === 2) {
                this.gameScore.incrementScore(25 * this.gameScore.level);
            } else if (linesCompletedList.length === 3) {
                this.gameScore.incrementScore(40 * this.gameScore.level);
            } else if (linesCompletedList.length === 4) {
                this.gameScore.incrementScore(60 * this.gameScore.level);
            }

            this.gameSound.play(Sound.SCORE_1);

            //Remove linhas completas
            this.grid = grid.filter(row => !linesCompletedList.includes(row));

            //Adiciona linhas vazias
            while (this.grid.length !== GRID_Y) {
                this.grid = [this.gameUtils.emptyRow(), ...this.grid];
            }

            //Faz level up de acordo com o numero de linhas completas no geral
            this.linesCompleted += linesCompletedList.length;
            if (this.gameScore.level < this.gameScore.maxLevel) {
                const level = Math.trunc(this.linesCompleted / this.linesToLevelUp) + 1;
                const levelsToIncrement = level - this.gameScore.level;
                this.gameScore.incrementLevel(levelsToIncrement);
            }
        }
    }

    private get next(): Piece {
        return this._next;
    }
    private set next(value: Piece) {
        this._next = value;
    }
    private get current(): Piece {
        return this._current;
    }
    private set current(value: Piece) {
        this._current = value;
    }
    private get actualId(): number {
        return this._actualId;
    }
    private set actualId(value: number) {
        this._actualId = value;
    }
    private get linesCompleted(): number {
        return this._linesCompleted;
    }
    private set linesCompleted(value: number) {
        this._linesCompleted = value;
    }
    private get linesToLevelUp(): number {
        return this._linesToLevelUp;
    }
    private set linesToLevelUp(value: number) {
        this._linesToLevelUp = value;
    }
    private get tickIntervalDecreaseOnLevelUp() {
        return this._tickIntervalDecreaseOnLevelUp;
    }
    private set tickIntervalDecreaseOnLevelUp(value) {
        this._tickIntervalDecreaseOnLevelUp = value;
    }
}

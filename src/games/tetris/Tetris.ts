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
    private next: Piece;
    private current: Piece;
    private actualId: number = 1;

    linesCompleted: number = 0;
    linesToLevelUp: number = 3;

    protected initialTickInterval: number = 25;

    protected hiScoreKey: string = 'hiTetrisScore';

    constructor(props: GameProps) {
        super(props);

        this.hiScoreValue = this.getHiScore();

        this.controls = new TetrisControls();
        this.controls.bound(this);

        this.generateNext();
    }

    reset() {
        super.reset();
        this.current = null;
        this.linesCompleted = 0;
        this.generateNext();
    }

    async drawWelcome(): Promise<void> {
        this.setTextSize(FontSize.EXTRA_LARGE);
        this.setTextAlign(FontAlign.CENTER);
        this.textOnDisplay('Tetris', { x: 0.5, y: 0.3 });

        this.setTextSize(FontSize.SMALL);
        this.textOnDisplay('Press start to play', { x: 0.5, y: 0.42 });

        this.setTextSize(FontSize.EXTRA_SMALL);
        this.setTextAlign(FontAlign.LEFT);

        this.textOnDisplay('Up:     Rotate', { x: 0.075, y: 0.7 });
        this.textOnDisplay('Down:   Move down faster', { x: 0.075, y: 0.75 });
        this.textOnDisplay('Left:   Move left', { x: 0.075, y: 0.8 });
        this.textOnDisplay('Right:  Move right', { x: 0.075, y: 0.85 });
        this.textOnDisplay('Action: Rotate', { x: 0.075, y: 0.9 });
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

        this.tickInterval = this.initialTickInterval - this.level;
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
                this.score += 10 * this.level;
            } else if (linesCompletedList.length === 2) {
                this.score += 25 * this.level;
            } else if (linesCompletedList.length === 3) {
                this.score += 40 * this.level;
            } else if (linesCompletedList.length === 4) {
                this.score += 60 * this.level;
            }

            this.gameSound.play(Sound.SCORE_1);

            //Remove linhas completas
            this.grid = grid.filter(row => !linesCompletedList.includes(row));

            //Adiciona linhas vazias
            while (this.grid.length !== GRID_Y) {
                this.grid = [this.emptyRow(), ...this.grid];
            }

            //Faz level up de acordo com o numero de linhas completas no geral
            this.linesCompleted += linesCompletedList.length;
            if (this.level < this.maxLevel) {
                this.level = Math.trunc(this.linesCompleted / this.linesToLevelUp) + 1;

                if (this.level > this.maxLevel) {
                    this.level = this.maxLevel;
                }
            }
        }
    }
}

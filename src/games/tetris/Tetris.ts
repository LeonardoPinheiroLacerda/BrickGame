import Game from '../../engine/Game';
import Color from '../../enum/Color';
import Sound from '../../enum/Sound';
import TetrisControls from './TetrisControls';
import Piece from './piece/Piece';
import Piece1 from './piece/Piece1';
import Piece2 from './piece/Piece2';
import Piece3 from './piece/Piece3';
import Piece4 from './piece/Piece4';
import Piece5 from './piece/Piece5';
import Piece6 from './piece/Piece6';
import Piece7 from './piece/Piece7';

export default class Tetris extends Game {
    private next: Piece;
    private current: Piece;
    private actualId: number = 1;

    protected tickInterval: number = 10;

    protected setup(): void {
        this.controls = new TetrisControls();
        this.controls.bound(this);

        this.generateNext();
    }

    reset() {
        this.resetGrid();
        this.current = null;
    }

    drawWelcome(): void {
        const { p } = this;

        p.textSize(this.xlgFontSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Tetris', this.getDisplayPosX(0.5), this.getDisplayPosY(0.3));

        p.textSize(this.smFontSize);
        p.text('Press start to play', this.getDisplayPosX(0.5), this.getDisplayPosY(0.42));

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(this.xsmFontSize);
        p.text('Up:     Rotate', this.getDisplayPosX(0.075), this.getDisplayPosY(0.7));
        p.text('Down:   Move down faster', this.getDisplayPosX(0.075), this.getDisplayPosY(0.75));
        p.text('Left:   Move left', this.getDisplayPosX(0.075), this.getDisplayPosY(0.8));
        p.text('Right:  Move right', this.getDisplayPosX(0.075), this.getDisplayPosY(0.85));
        p.text('Action: Rotate', this.getDisplayPosX(0.075), this.getDisplayPosY(0.9));
    }

    drawHud(): void {
        super.drawHud();

        if (this.state.running) {
            const coordY = this.getHudPosY(0.35);
            const coordX = this.getHudPosX(-0.025);

            this.next?.preview.forEach((row, y) => {
                row.forEach((column, x) => {
                    this.drawCellElement({
                        w: this.cellSize,
                        h: this.cellSize,
                        posX: coordX + this.cellSize * x,
                        posY: coordY + this.cellSize * y,
                        color: this.state.colorEnabled
                            ? column.value !== 0
                                ? column.color
                                : Color.INACTIVE
                            : column.value !== 0
                              ? Color.DEFAULT
                              : Color.INACTIVE,
                    });
                });
            });
        }
    }

    protected processTick(): void {
        if (this.state.gameOver) return;

        const canMove = this.current?.move(this, { y: 1, x: 0 });
        const hasCurrent = this.current;

        if (!canMove || !hasCurrent) {
            this.spawn();
            this.checkGameOver();

            if (this.state.gameOver === false) {
                this.gameSound.play(Sound.ACTION_2);
            }
        }

        if (this.state.gameOver) {
            this.current = null;
            this.resetGrid();
            this.gameSound.play(Sound.GAME_OVER);
        }
    }

    protected draw(): void {
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

        this.actualId += 1;
    }

    private spawn(): void {
        this.current = this.next;
        this.generateNext();
    }

    private checkGameOver(): void {
        this.current?.parts.forEach(({ y, x }) => {
            if (this.grid[y][x].value !== 0) {
                this.state.gameOver = true;
                this.state.running = false;
            }
        });
    }
}

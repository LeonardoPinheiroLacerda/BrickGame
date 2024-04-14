import GameSession from '../../engine/GameSession';
import { GRID_KEY, HUD_GRID_KEY, SCORE_KEY, TICK_INTERVAL_KEY } from '../../constants';
import GameScore from '../../engine/GameScore';
import Tetris from './Tetris';

export default class TetrisSession extends GameSession<Tetris> {
    public async saveSession(): Promise<void> {
        localStorage.setItem(GRID_KEY, JSON.stringify(this.game.grid));
        localStorage.setItem(HUD_GRID_KEY, JSON.stringify(this.game.hudGrid));
        localStorage.setItem(SCORE_KEY, JSON.stringify(this.game.gameScore));
        localStorage.setItem(TICK_INTERVAL_KEY, JSON.stringify(this.game.tickInterval));

        localStorage.setItem('ACUTAL_ID', this.game.actualId.toString());
        localStorage.setItem('LINES_COMPLETED', this.game.linesCompleted.toString());
    }

    public async clearSession(): Promise<void> {
        localStorage.removeItem(GRID_KEY);
        localStorage.removeItem(HUD_GRID_KEY);
        localStorage.removeItem(SCORE_KEY);
        localStorage.removeItem(TICK_INTERVAL_KEY);

        localStorage.removeItem('ACUTAL_ID');
        localStorage.removeItem('LINES_COMPLETED');
    }

    public checkSession(): boolean {
        return (
            JSON.parse(localStorage.getItem(GRID_KEY)) != null &&
            JSON.parse(localStorage.getItem(HUD_GRID_KEY)) != null &&
            JSON.parse(localStorage.getItem(SCORE_KEY)) != null &&
            JSON.parse(localStorage.getItem(TICK_INTERVAL_KEY)) != null &&
            JSON.parse(localStorage.getItem('ACUTAL_ID')) != null &&
            JSON.parse(localStorage.getItem('LINES_COMPLETED')) != null
        );
    }

    protected loadSession(): void {
        const tmpScore: any = JSON.parse(localStorage.getItem(SCORE_KEY));

        this.game.state.on = true;
        this.game.state.start = true;
        this.game.state.running = true;

        this.game.grid = JSON.parse(localStorage.getItem(GRID_KEY));
        this.game.hudGrid = JSON.parse(localStorage.getItem(HUD_GRID_KEY));
        this.game.gameScore = new GameScore(tmpScore._score, tmpScore._level);
        this.game.tickInterval = JSON.parse(localStorage.getItem(TICK_INTERVAL_KEY));

        this.game.actualId = Number.parseInt(localStorage.getItem('ACUTAL_ID'));
        this.game.linesCompleted = Number.parseInt(localStorage.getItem('LINES_COMPLETED'));

        //Remove ultima peça
        let biggestId = 0;

        this.game.grid.forEach(row => {
            row.forEach(column => {
                if (column.value > biggestId) {
                    biggestId = column.value;
                }
            });
        });

        this.game.grid.forEach(row => {
            row.forEach(column => {
                if (column.value === biggestId) {
                    column.color = this.game.gameUtils.emptyCell().color;
                    column.value = this.game.gameUtils.emptyCell().value;
                }
            });
        });
    }
}

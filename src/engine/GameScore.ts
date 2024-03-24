import Game from './Game';

export default class GameScore {
    protected game: Game;

    public score: number = 0;
    public hiScoreValue: number = 0;
    public level: number = 1;

    private maxLevel: number = 10;
    private hiScoreKey: string;

    constructor(game: Game) {
        this.game = game;
    }

    setKey(key: string) {
        this.hiScoreKey = key;
        this.hiScoreValue = this.getHiScore();
    }
    setMaxLevel(maxLevel: number) {
        this.maxLevel = maxLevel;
    }

    getMaxLevel(): number {
        return this.maxLevel;
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
}

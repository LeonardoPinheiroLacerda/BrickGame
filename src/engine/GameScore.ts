export default class GameScore {
    private _score: number = 0;
    private _hiScoreValue: number = 0;
    private _level: number = 1;
    private _maxLevel: number = 10;
    private _key: string;

    private getHiScoreFromLocalStorage(): number {
        return isNaN(parseInt(localStorage.getItem(this.key))) ? 0 : parseInt(localStorage.getItem(this.key));
    }

    async updateHiScore(): Promise<void> {
        const oldHiScore = this.getHiScoreFromLocalStorage();

        if (this.score >= oldHiScore) {
            localStorage.setItem(this.key, this.score.toString());
        }

        this.hiScoreValue = this.getHiScoreFromLocalStorage();
    }

    resetScore() {
        this.score = 0;
    }
    resetLevel() {
        this.level = 0;
    }

    incrementScore(value: number): void {
        this.score += value;
    }

    incrementLevel(value: number): void {
        this.level += value;

        if (this.level > this.maxLevel) {
            this.level = this.maxLevel;
        }
    }

    setKey(value: string):void{
        this.key = value
    }

    public get score(): number {
        return this._score;
    }
    private set score(value: number) {
        this._score = value;
    }
    public get hiScoreValue(): number {
        return this._hiScoreValue;
    }
    private set hiScoreValue(value: number) {
        this._hiScoreValue = value;
    }
    public get level(): number {
        return this._level;
    }
    private set level(value: number) {
        this._level = value;
    }
    public get maxLevel(): number {
        return this._maxLevel;
    }
    private set maxLevel(value: number) {
        this._maxLevel = value;
    }
    public get key(): string {
        return this._key;
    }
    private set key(value: string) {
        this._key = value;
    }
}

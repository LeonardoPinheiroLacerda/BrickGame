import Game from './Game';

export default class GameState {
    protected game: Game;

    private _on: boolean = false;
    private _start: boolean = false;
    private _gameOver: boolean = false;
    private _running: boolean = false;

    private _colorEnabled: boolean = true;

    constructor(game: Game) {
        this.game = game;
    }

    public get on(): boolean {
        return this._on;
    }
    public set on(value: boolean) {
        this._on = value;
    }

    public get start(): boolean {
        return this._start;
    }
    public set start(value: boolean) {
        this._start = value;
    }

    public get colorEnabled(): boolean {
        return this._colorEnabled;
    }
    public set colorEnabled(value: boolean) {
        this._colorEnabled = value;
    }

    public get gameOver(): boolean {
        return this._gameOver;
    }
    public set gameOver(value: boolean) {
        this._gameOver = value;
    }

    public get running(): boolean {
        return this._running;
    }
    public set running(value: boolean) {
        this._running = value;
    }
}

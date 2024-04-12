import { COLOR_ENABLED_KEY } from './../constants';

export default class GameState {
    private _on: boolean = false;
    private _start: boolean = false;
    private _gameOver: boolean = false;
    private _running: boolean = false;

    private _colorEnabled: boolean =
        JSON.parse(localStorage.getItem(COLOR_ENABLED_KEY)) != undefined ? JSON.parse(localStorage.getItem(COLOR_ENABLED_KEY)) : true;

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
        localStorage.setItem(COLOR_ENABLED_KEY, JSON.stringify(value));
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

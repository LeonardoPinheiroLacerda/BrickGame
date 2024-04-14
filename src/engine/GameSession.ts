import { SESSION_CONTINUE_NO, SESSION_CONTINUE_YES, SESSION_SELECTION } from '../constants';
import Game from './Game';

export default class GameSession<T extends Game> {
    private _game: T;

    constructor(game: T) {
        this.game = game;
    }

    public askLastSession(): Promise<boolean> {
        return new Promise(resolve => {
            if (this.checkSession()) {
                this.game.p.noLoop();
                const modal = document.querySelector(SESSION_SELECTION);
                const yesButton = document.querySelector(SESSION_CONTINUE_YES);
                const noButton = document.querySelector(SESSION_CONTINUE_NO);
                modal.classList.remove('invisible');
                const yes = () => {
                    this.loadSession();
                    modal.classList.add('invisible');
                    this.game.p.loop();
                    yesButton.removeEventListener('click', yes);
                    resolve(true);
                };
                const no = () => {
                    this.clearSession();
                    modal.classList.add('invisible');
                    this.game.p.loop();
                    noButton.removeEventListener('click', no);
                    resolve(false);
                };
                yesButton.addEventListener('click', yes);
                noButton.addEventListener('click', no);
            } else {
                resolve(true);
            }
        });
    }

    public async saveSession(): Promise<void> {}

    public async clearSession(): Promise<void> {}

    public checkSession(): boolean {
        return false;
    }

    public loadSession(): void {}

    protected get game(): T {
        return this._game;
    }
    protected set game(value: T) {
        this._game = value;
    }
}

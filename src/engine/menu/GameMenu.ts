import Game from '../Game';

import * as gamesJson from '../../../resources/games.json';
import GameControls from '../GameControls';
import GameMenuControls from './GameMenuControls';
import GameItem from '../../interface/GameItem';
import Sound from '../../enum/Sound';
import GameProps from '../../interface/GameProps';
import FontSize from '../../enum/FontSize';

export default class GameMenu extends Game {
    public selectedGame: number = 0;
    public games: GameItem[] = gamesJson;
    public playedStartTheme: boolean = false;
    protected controls: GameControls;

    constructor(props: GameProps) {
        super(props);

        this.controls = new GameMenuControls();
        this.controls.unbound(this);
        this.controls.bound(this);
    }

    async drawWelcome(): Promise<void> {
        if (!this.playedStartTheme) {
            this.playedStartTheme = true;
            this.gameSound.play(Sound.START_THEME);
        }
        const { p } = this;
        p.push();

        this.setTextSize(FontSize.LARGE);
        this.setTextState(true);
        this.setTextAlign(p.CENTER);

        this.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

        this.setTextSize(FontSize.SMALL);

        this.textOnDisplay('Wellcome to your', { x: 0.5, y: 0.25 });
        this.textOnDisplay('favorite brick game', { x: 0.5, y: 0.32 });
        this.textOnDisplay('simulator!', { x: 0.5, y: 0.39 });
        this.textOnDisplay('Press start', { x: 0.5, y: 0.66 });
        this.textOnDisplay('to continue.', { x: 0.5, y: 0.72 });

        p.pop();
    }

    async draw(): Promise<void> {
        if (this.state.running) {
            const { p } = this;
            p.push();

            this.setTextSize(FontSize.LARGE);
            this.setTextState(true);
            this.setTextAlign(p.CENTER);

            this.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

            this.setTextSize(FontSize.SMALL);

            this.textOnDisplay('Choose a game and', { x: 0.5, y: 0.25 });
            this.textOnDisplay('Press action to play', { x: 0.5, y: 0.32 });

            this.setTextAlign(p.RIGHT);
            this.textOnDisplay('<', { x: 0.1, y: 0.54 });

            this.setTextAlign(p.LEFT);
            this.textOnDisplay('>', { x: 0.9, y: 0.54 });

            this.setTextSize(FontSize.MEDIUM);
            this.setTextAlign(p.CENTER);
            this.textOnDisplay(this.games[this.selectedGame].name, { x: 0.5, y: 0.55 });

            this.setTextSize(FontSize.EXTRA_SMALL);
            this.setTextAlign(p.LEFT);

            this.textOnDisplay('Left:    Previous option', { x: 0.05, y: 0.78 });
            this.textOnDisplay('Right:   Next option', { x: 0.05, y: 0.84 });
            this.textOnDisplay('Action:  Select', { x: 0.05, y: 0.9 });

            p.pop();
        }
    }
}

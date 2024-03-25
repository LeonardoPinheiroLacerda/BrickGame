import Game from '../Game';

import * as gamesJson from '../../../resources/games.json';
import GameMenuControls from './GameMenuControls';
import GameItem from '../../interface/GameItem';
import Sound from '../../enum/Sound';
import GameProps from '../../interface/GameProps';
import FontSize from '../../enum/FontSize';
import FontAlign from '../../enum/FontAlign';

export default class GameMenu extends Game {
    public selectedGame: number = 0;
    public games: GameItem[] = gamesJson;
    public playedStartTheme: boolean = false;

    constructor(props: GameProps) {
        super(props);

        this.gameControls = new GameMenuControls();
        this.gameControls.unbound(this);
        this.gameControls.bound(this);
    }

    async drawWelcome(): Promise<void> {
        if (!this.playedStartTheme) {
            this.playedStartTheme = true;
            this.gameSound.play(Sound.START_THEME);
        }
        const { p } = this;
        p.push();

        this.gameTexts.setTextSize(FontSize.LARGE);
        this.gameTexts.setTextState(true);
        this.gameTexts.setTextAlign(FontAlign.CENTER);

        this.gameTexts.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

        this.gameTexts.setTextSize(FontSize.SMALL);

        this.gameTexts.textOnDisplay('Wellcome to your', { x: 0.5, y: 0.25 });
        this.gameTexts.textOnDisplay('favorite brick game', { x: 0.5, y: 0.32 });
        this.gameTexts.textOnDisplay('simulator!', { x: 0.5, y: 0.39 });
        this.gameTexts.textOnDisplay('Press start', { x: 0.5, y: 0.66 });
        this.gameTexts.textOnDisplay('to continue.', { x: 0.5, y: 0.72 });

        p.pop();
    }

    async draw(): Promise<void> {
        if (this.state.running) {
            const { p } = this;
            p.push();

            this.gameTexts.setTextSize(FontSize.LARGE);
            this.gameTexts.setTextState(true);
            this.gameTexts.setTextAlign(FontAlign.CENTER);

            this.gameTexts.textOnDisplay('Menu', { x: 0.5, y: 0.15 });

            this.gameTexts.setTextSize(FontSize.SMALL);

            this.gameTexts.textOnDisplay('Choose a game and', { x: 0.5, y: 0.25 });
            this.gameTexts.textOnDisplay('Press action to play', { x: 0.5, y: 0.32 });

            this.gameTexts.setTextAlign(FontAlign.RIGHT);
            this.gameTexts.textOnDisplay('<', { x: 0.1, y: 0.54 });

            this.gameTexts.setTextAlign(FontAlign.LEFT);
            this.gameTexts.textOnDisplay('>', { x: 0.9, y: 0.54 });

            this.gameTexts.setTextSize(FontSize.MEDIUM);
            this.gameTexts.setTextAlign(FontAlign.CENTER);
            this.gameTexts.textOnDisplay(this.games[this.selectedGame].name, { x: 0.5, y: 0.55 });

            this.gameTexts.setTextSize(FontSize.EXTRA_SMALL);
            this.gameTexts.setTextAlign(FontAlign.LEFT);

            this.gameTexts.textOnDisplay('Left:    Previous option', { x: 0.05, y: 0.78 });
            this.gameTexts.textOnDisplay('Right:   Next option', { x: 0.05, y: 0.84 });
            this.gameTexts.textOnDisplay('Action:  Select', { x: 0.05, y: 0.9 });

            p.pop();
        }
    }
}

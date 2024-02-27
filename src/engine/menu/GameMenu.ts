import Game from '../Game';
import { FONT_COLOR } from '../../constants';

import * as gamesJson from '../../../resources/games.json';
import GameControls from '../GameControls';
import GameMenuControls from './GameMenuControls';
import GameItem from '../../interface/GameItem';
import Sound from '../../enum/Sound';
import GameProps from '../../interface/GameProps';

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

        p.textFont(this.defaultFontFamily);
        p.textSize(this.lgFontSize);

        p.fill(FONT_COLOR);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Menu', this.getDisplayPosX(0.5), this.getDisplayPosY(0.15));

        p.textSize(this.smFontSize);
        p.text('Wellcome to your', this.getDisplayPosX(0.5), this.getDisplayPosY(0.25));
        p.text('favorite brick game', this.getDisplayPosX(0.5), this.getDisplayPosY(0.32));
        p.text('simulator!', this.getDisplayPosX(0.5), this.getDisplayPosY(0.39));
        p.text('Press start', this.getDisplayPosX(0.5), this.getDisplayPosY(0.66));
        p.text('to continue.', this.getDisplayPosX(0.5), this.getDisplayPosY(0.72));

        p.pop();
    }

    async draw(): Promise<void> {
        if (this.state.running) {
            const { p } = this;
            p.push();

            p.textFont(this.defaultFontFamily);
            p.textSize(this.lgFontSize);
            p.fill(FONT_COLOR);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('Menu', this.getDisplayPosX(0.5), this.getDisplayPosY(0.15));

            p.textSize(this.smFontSize);
            p.text('Choose a game and', this.getDisplayPosX(0.5), this.getDisplayPosY(0.25));
            p.text('Press action to play', this.getDisplayPosX(0.5), this.getDisplayPosY(0.32));

            p.textAlign(p.RIGHT, p.CENTER);
            p.text('<', this.getDisplayPosX(0.1), this.getDisplayPosY(0.55));

            p.textAlign(p.LEFT, p.CENTER);
            p.text('>', this.getDisplayPosX(0.9), this.getDisplayPosY(0.55));

            p.textSize(this.mdFontSize);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(this.games[this.selectedGame].name, this.getDisplayPosX(0.5), this.getDisplayPosY(0.55));

            p.textSize(this.xsmFontSize);
            p.textAlign(p.LEFT, p.CENTER);
            p.text('Left: Previous option', this.getDisplayPosX(0.05), this.getDisplayPosY(0.78));
            p.text('Right: Next option', this.getDisplayPosX(0.05), this.getDisplayPosY(0.84));
            p.text('Action: Select', this.getDisplayPosX(0.05), this.getDisplayPosY(0.9));

            p.pop();
        }
    }
}

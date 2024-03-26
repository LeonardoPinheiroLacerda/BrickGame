import FontAlign from '../enum/FontAlign';
import FontSize from '../enum/FontSize';
import Coordinates from '../interface/Coordinates';
import Game from './Game';
import {
    FONT_COLOR,
    FONT_TURNED_OFF_COLOR,
    LARGE_FONT_SIZE,
    SMALL_FONT_SIZE,
    MEDIUM_FONT_SIZE,
    EXTRA_LARGE_FONT_SIZE,
    EXTRA_SMALL_FONT_SIZE,
} from '../constants';

export default class GameTexts {
    protected game: Game;

    protected defaultFontFamily: string = 'retro-gamming';
    private fontSizes: number[] = [0];

    constructor(game: Game) {
        this.game = game;
    }

    public defineFont(): void {
        this.game.p.textFont(this.defaultFontFamily);

        //Define o tamanho das fontes
        this.fontSizes = [];
        this.fontSizes.push(this.game.getRelativeValue(EXTRA_SMALL_FONT_SIZE));
        this.fontSizes.push(this.game.getRelativeValue(SMALL_FONT_SIZE));
        this.fontSizes.push(this.game.getRelativeValue(MEDIUM_FONT_SIZE));
        this.fontSizes.push(this.game.getRelativeValue(LARGE_FONT_SIZE));
        this.fontSizes.push(this.game.getRelativeValue(EXTRA_LARGE_FONT_SIZE));
    }

    public setTextState(state: boolean): void {
        this.game.p.fill(state ? FONT_COLOR : FONT_TURNED_OFF_COLOR);
    }

    public setTextSize(fontSize: FontSize): void {
        this.game.p.textSize(this.fontSizes[fontSize]);
    }

    public setTextAlign(fontAlign: FontAlign): void {
        this.game.p.textAlign(fontAlign, this.game.p.BASELINE);
    }

    public textOnHud(text: any, coord: Coordinates) {
        this.game.p.text(text, this.game.gameCoordinates.getHudPosX(coord.x), this.game.gameCoordinates.getHudPosY(coord.y));
    }

    public textOnDisplay(text: any, coord: Coordinates) {
        this.game.p.text(text, this.game.gameCoordinates.getDisplayPosX(coord.x), this.game.gameCoordinates.getDisplayPosY(coord.y));
    }
}

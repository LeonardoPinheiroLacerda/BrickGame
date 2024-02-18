import Game from '../../engine/Game';
import Sound from '../../enum/Sound';

export default class Tetris extends Game {
    protected setup(): void {
        this.gameSound.play(Sound.GAME_START);
    }

    drawWelcome(): void {
        const { p } = this;

        p.textSize(this.xlgFontSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Tetris', this.getDisplayPosX(0.5), this.getCanvasPosY(0.3));
    }
}

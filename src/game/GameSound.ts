import Sound from '../enum/Sound';

export default class GameSound {
    private volume: number = 0.025;
    private mute: Boolean = false;

    play(sound: Sound) {
        if (!this.mute) {
            const audio: HTMLAudioElement = new Audio(sound);
            audio.volume = this.volume;
            audio.play();
        }
    }

    setMute(mute: Boolean) {
        this.mute = mute;
    }

    getMute() {
        return this.mute;
    }
}

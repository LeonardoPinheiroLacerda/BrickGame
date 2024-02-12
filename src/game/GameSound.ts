import Sound from '../enum/Sound';

export default class GameSound {
    private volume: number = 0.025;

    play(sound: Sound) {
        const audio: HTMLAudioElement = new Audio(sound);
        audio.volume = this.volume;
        audio.play();
    }
}

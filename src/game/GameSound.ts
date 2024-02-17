import Sound from '../enum/Sound';

export default class GameSound {
    private volume: number = 0.025;
    private mute: boolean = false;

    private activeSounds: HTMLAudioElement[] = [];

    play(sound: Sound) {
        if (!this.mute) {
            const audio: HTMLAudioElement = new Audio(sound);
            audio.volume = this.volume;

            this.activeSounds.push(audio);
            audio.addEventListener('ended', () => {
                this.activeSounds = this.activeSounds.filter(s => s !== audio);
            });

            audio.play();
        }
    }

    stop(sound: Sound) {
        const getFileName = (url: string) => {
            const arr = url.split('/');
            return arr[arr.length - 1];
        };
        this.activeSounds.forEach(s => {
            if (getFileName(s.src) === getFileName(sound)) {
                s.volume = 0;
            }
        });
    }

    stopAll() {
        this.activeSounds.forEach(s => {
            s.volume = 0;
        });
    }

    setMute(mute: boolean) {
        if (mute) this.stopAll();
        this.mute = mute;
    }

    getMute() {
        return this.mute;
    }
}

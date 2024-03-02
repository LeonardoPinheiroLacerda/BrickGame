import Sound from '../enum/Sound';

export default class GameSound {
    private volume: number = 0.025;
    private mute: boolean = false;

    private activeSounds: HTMLAudioElement[] = [];

    private soundsLoaded: boolean = false;

    private audioContext: AudioContext;

    loadAll() {
        this.audioContext = new window.AudioContext();
        const load = (sound: Sound) => {
            const audioElement = document.createElement('audio');
            audioElement.id = this.soundId(sound);
            audioElement.src = sound;
            audioElement.volume = this.volume;
            document.body.append(audioElement);

            const audioSource = this.audioContext.createMediaElementSource(audioElement);
            audioSource.connect(this.audioContext.destination);
        };

        load(Sound.SPAWN);
        load(Sound.SCORE_1);
        load(Sound.SCORE_2);
        load(Sound.SCORE_3);
        load(Sound.KEY_PRESS);
        load(Sound.ACTION_1);
        load(Sound.ACTION_2);
        load(Sound.HIT_1);
        load(Sound.HIT_2);
        load(Sound.DODGE);
        load(Sound.DROP);
        load(Sound.EXPLOSION);
        load(Sound.GAME_START);
        load(Sound.SHOT);
        load(Sound.START_THEME);

        this.soundsLoaded = true;
    }

    soundId(sound: Sound) {
        return sound.replace('./sounds/', '').replace('.wav', '');
    }

    async play(sound: Sound): Promise<void> {
        if (this.soundsLoaded === false) {
            this.loadAll();
        }

        if (!this.mute) {
            try {
                const audio: HTMLAudioElement = document.querySelector(`#${this.soundId(sound)}`);
                audio.volume = this.volume;

                this.activeSounds.push(audio);
                audio.addEventListener('ended', () => {
                    this.activeSounds = this.activeSounds.filter(s => s !== audio);
                });

                audio.load();
                audio.play();
            } catch (err) {
                console.error(err);
            }
        }
    }

    async stop(sound: Sound): Promise<void> {
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

    async stopAll(): Promise<void> {
        this.activeSounds.forEach(s => {
            s.volume = 0;
        });
    }

    setMute(mute: boolean): void {
        if (mute) this.stopAll();
        this.mute = mute;
    }

    getMute(): boolean {
        return this.mute;
    }
}

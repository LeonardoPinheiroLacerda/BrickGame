import Sound from '../enum/Sound';
import { MUTED_KEY } from './../constants';

export default class GameSound {
    private _mute: boolean = JSON.parse(localStorage.getItem(MUTED_KEY)) != undefined ? JSON.parse(localStorage.getItem(MUTED_KEY)) : false;
    private _volume: number = 0.025;

    private activeSounds: HTMLAudioElement[] = [];
    private soundLibraryLoaded: boolean = false;

    async play(sound: Sound): Promise<void> {
        if (this.soundLibraryLoaded === false) {
            this.loadAll();
        }

        if (!this.mute) {
            try {
                const audio: HTMLAudioElement = document.querySelector(`#${this.soundId(sound)}`);

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

    private loadAll() {
        const audioContext = new window.AudioContext();
        const load = (sound: Sound) => {
            const audioElement = document.createElement('audio');
            audioElement.id = this.soundId(sound);
            audioElement.src = sound;
            audioElement.volume = this.volume;
            document.body.append(audioElement);

            const audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(audioContext.destination);
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

        this.soundLibraryLoaded = true;
    }

    private soundId(sound: Sound) {
        return sound.replace('./sounds/', '').replace('.wav', '');
    }

    public toogleMute() {
        this.mute = !this.mute;
    }

    public get mute(): boolean {
        return this._mute;
    }
    public set mute(value: boolean) {
        if (value) this.stopAll();
        this._mute = value;
        localStorage.setItem(MUTED_KEY, JSON.stringify(value));
    }

    public get volume(): number {
        return this._volume;
    }
    public set volume(value: number) {
        this._volume = value;
    }
}

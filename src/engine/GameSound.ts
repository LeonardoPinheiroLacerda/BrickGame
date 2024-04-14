import Sound from '../enum/Sound';
import { MUTED_KEY } from './../constants';

export default class GameSound {
    private _mute: boolean = JSON.parse(localStorage.getItem(MUTED_KEY)) != undefined ? JSON.parse(localStorage.getItem(MUTED_KEY)) : false;
    private _volume: number = 0.025;

    private soundLibraryLoaded: boolean = false;

    async play(sound: Sound): Promise<void> {
        if (this.soundLibraryLoaded === false) {
            this.loadAll();
        }

        if (!this.mute) {
            try {
                const audio: HTMLAudioElement = this.audioElementFromSound(sound);

                audio.load();
                audio.addEventListener('loadeddata', () => {
                    audio.play();
                });
            } catch (err) {
                console.error(err);
            }
        }
    }

    async stop(sound: Sound): Promise<void> {
        const element: HTMLAudioElement = this.audioElementFromSound(sound);
        element?.pause();
    }

    async stopAll(): Promise<void> {
        Object.values(Sound).forEach(sound => {
            const element: HTMLAudioElement = this.audioElementFromSound(sound);
            element?.pause();
        });
    }

    private audioElementFromSound(sound: Sound | string): HTMLAudioElement {
        return document.querySelector(`#${this.soundId(sound)}`);
    }

    private loadAll() {
        Object.values(Sound).forEach(sound => {
            const element = this.audioElementFromSound(sound);
            element?.parentElement.removeChild(element);
        });

        const audioContext = new window.AudioContext();

        const load = (sound: string) => {
            const audioElement = document.createElement('audio');
            audioElement.id = this.soundId(sound);
            audioElement.src = sound;
            audioElement.volume = this.volume;
            document.body.append(audioElement);

            const audioSource = audioContext.createMediaElementSource(audioElement);
            audioSource.connect(audioContext.destination);
        };

        Object.values(Sound).forEach(sound => {
            load(sound);
        });

        this.soundLibraryLoaded = true;
    }

    private soundId(sound: Sound | string) {
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

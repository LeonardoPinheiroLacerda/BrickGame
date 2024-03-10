import * as P5 from 'p5';
import { PARENT_SELECTOR } from './constants';

import GameBody from './engine/body/GameBody';
import Game from './engine/Game';

import './importResources';
import Tetris from './games/tetris/Tetris';

function redirect(version: string) {
    const params = new URL(document.location.href).searchParams;

    if (params.has('v') === false || params.get('v') !== version) {
        params.set('v', version);
        const url = window.location.href;
        const urlWithoutQueryParam = url.substring(0, url.indexOf('?'));
        window.location.href = `${urlWithoutQueryParam}?${params.toString()}`;
    }
}

export default new P5((p: P5) => {
    //Inicializando algumas variaveis
    const parentElement = document.querySelector(PARENT_SELECTOR);

    //Info versão
    const { version } = require('./../package.json');
    const versionElement = document.querySelector('#version');
    versionElement.innerHTML = `version: ${version}`;

    redirect(version);

    const body: GameBody = new GameBody({
        parent: parentElement,
        p,
    });

    let game: Game;

    p.setup = () => {
        const { canvasWidth, canvasHeight } = body.build();
        game = new Tetris({ p, canvasWidth, canvasHeight, body });
        body.bound(game);

        //Limpando splash screen
        const splash: HTMLDivElement = document.querySelector('#splash');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 250);
    };

    p.draw = () => {
        game.drawFrame();
    };
}, document.body);

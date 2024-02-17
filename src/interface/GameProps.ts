import * as p5 from 'p5';
import GameBody from '../engine/body/GameBody';

export default interface GameProps {
    p: p5;
    canvasWidth: number;
    canvasHeight: number;
    body: GameBody;
}

import * as p5 from 'p5';
import GameBody from '../engine/body/GameBody';

/**
 *
 * Used as argument in the Game constructor
 *
 * @interface
 */
export default interface GameProps {
    p: p5;
    canvasWidth: number;
    canvasHeight: number;
    body: GameBody;
}

import * as p5 from 'p5';
import Body from '../body/Body';

export default interface GameProps {
    p: p5;
    canvasWidth: number;
    canvasHeight: number;
    body: Body;
}

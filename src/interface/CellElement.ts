import Color from '../enum/Color';

export default interface CellElement {
    w: number;
    h: number;
    posX: number;
    posY: number;
    color: Color;
}

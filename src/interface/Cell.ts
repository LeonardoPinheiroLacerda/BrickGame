import Color from '../enum/Color';

/**
 *
 * Represents a game's display cell
 *
 * @interface
 */
export default interface Cell {
    value: number;
    color: Color;
}

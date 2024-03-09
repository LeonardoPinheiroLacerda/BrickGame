/**
 * Describes all posible states of a game in runtime
 *
 * @interface
 *
 */
export default interface GameState {
    /**
     * Defines if the GameBrick is on or off.
     */
    on: boolean;
    /**
     * Defines if the GameBrick is on start or pause state.
     */
    start: boolean;
    /**
     * Defines if the GameBrick will render the display's cells colored or not.
     */
    colorEnabled: boolean;
    /**
     * Defines if the GameBrick is on game over state.
     */
    gameOver: boolean;
    /**
     * Defines if the GameBrick has some game running (not on pause state).
     */
    running: boolean;
}

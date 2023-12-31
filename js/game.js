class Game {

    /**
     * Para implementar um novo game é necessário implementar:
     * - drawWelcome
     * - drawGameOver
     * - drawHowToPlay
     * - mapKeys
     * - pressUp
     * - pressDown
     * - pressLeft
     * - pressRight
     * - pressAction
     */
    constructor({ width, maxHeight, selector }, hiScoreKey, events) {

        this.hiScoreKey = hiScoreKey;

        //Grid
        this.gridX = 11;
        this.gridY = 18;
        this.grid = [];

        //Dimensions
        let bodyBuilder = new GameBrickBody(this, events);

        this.width = width / bodyBuilder.WIDTH_MULTIPLIER

        const calcDimensions = () => {
            this.hudWidth = this.width * 0.4;

            this.gameDisplayWidth = this.width - this.hudWidth;
            this.gameDisplayMargin = this.width * 0.04;

            this.cellMargin = this.width * 0.0005;
            this.cellSize = this.gameDisplayWidth / this.gridX - this.cellMargin - (this.cellMargin / this.gridX);

            this.height = this.cellSize * this.gridY + (this.cellMargin * (this.gridY + 1)) + (this.gameDisplayMargin * 2);
        }
        calcDimensions();

        //Speed
        this.initialFrameActionInterval = 20;

        this.frameActionInterval = this.initialFrameActionInterval;
        this.frameCount = 0;

        //Canvas
        this.canvas = document.createElement("canvas");
        this.body = document.querySelector(selector);

        this.body.append(this.canvas);

        /** @type{CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        //Correção de escala para telas com dpi maior
        const scaleDisplay = () => {
            this.canvas.style.width = `${this.width}px`
            this.canvas.style.height = `${this.height}px`

            this.scale = Math.ceil(window.devicePixelRatio);

            this.canvas.width = Math.floor(this.width * this.scale);
            this.canvas.height = Math.floor(this.height * this.scale);
        }
        scaleDisplay();

        //Carregando recursos e inicializando tela desligada
        this.inactiveCell = new Image();
        this.inactiveCell.src = "./assets/images/inactiveCell.svg";

        this.activeCell = new Image();
        this.activeCell.src = "./assets/images/activeCell.svg";

        this.inactiveCell.onload = () => {

            this.turnOff();
            this.mapKeys();
            this.resetGrid();

            const font = new FontFace(
                "retro-gaming",
                "url(./assets/fonts/digital-7.monoitalic.ttf)"
            );
            font.load().then(() => {
                document.fonts.add(font);
            });



            //Corrigindo proporções
            bodyBuilder.update(this);

            const canvasWidth = parseFloat(this.canvas.style.width.replace("px", ""));
            const canvasHeight = parseFloat(this.canvas.style.height.replace("px", ""));

            const bodyWidth = canvasWidth * bodyBuilder.WIDTH_MULTIPLIER;
            const bodyHeight = canvasHeight * bodyBuilder.HEIGHT_MULTIPLIER;

            const parentNode = this.body.parentNode;

            if (bodyWidth > parentNode.clientWidth) {
                this.width = parentNode.clientWidth * 0.7;
                calcDimensions();
                scaleDisplay();
            }

            else if (maxHeight < bodyHeight) {
                this.width = ((maxHeight * bodyWidth) / bodyHeight) / bodyBuilder.WIDTH_MULTIPLIER;
                calcDimensions();
                scaleDisplay();
            }


            //Contruindo body
            bodyBuilder.create();
            this.drawFrame();

        }

        //States
        this.isOn = false;
        this.isStart = false;
        this.isGameOver = false;
        this.isMuted = false;

        //Score and level
        this.score = 0;

        this.level = 1;
        this.maxLevel = 10;

    }


    gameOver() {
        clearInterval(this.interval);

        this.resetGrid();
        this.drawFrame();
        this.drawData();

        const actualHighScore = parseInt(localStorage.getItem(this.hiScoreKey));

        if (actualHighScore < this.score || !actualHighScore) {
            localStorage.setItem(this.hiScoreKey, this.score);
        }

        this.score = 0;
        this.level = 1;

        this.drawGameOver();
        navigator.vibrate(1500);
        this.playSound('./assets/sounds/gameover.wav');
    }

    //Canvas drawing
    scaleCanvas() {
        this.context.reset();
        this.context.scale(this.scale, this.scale);
    }

    drawCell(isActive, posX, posY) {
        const cell = isActive
            ? this.activeCell
            : this.inactiveCell

        this.context.drawImage(cell, posX, posY, this.cellSize, this.cellSize);
    }

    drawData() {
        this.context.font = this.width * 0.06 + "px retro-gaming"
        this.context.fillStyle = "rgb(19, 26, 18)";

        this.context.fillText("Score", this.width * 0.7, this.height * 0.1);
        this.context.fillText(this.score, this.width * 0.7, this.height * 0.15);

        const hiScore = !localStorage.getItem(this.hiScoreKey)
            ? 0
            : parseInt(localStorage.getItem(this.hiScoreKey));

        this.context.fillText("Hi-Score", this.width * 0.7, this.height * 0.23);
        this.context.fillText(hiScore, this.width * 0.7, this.height * 0.28);

        this.context.fillText("Level", this.width * 0.7, this.height * 0.74);
        this.context.fillText(`${this.level} - ${this.maxLevel}`, this.width * 0.7, this.height * 0.79);


        if (this.isStart)
            this.context.fillStyle = "rgb(166, 183, 165)";
        this.context.fillText("Paused", this.width * 0.734, this.height * 0.87);


        if (!this.isMuted)
            this.context.fillStyle = "rgb(166, 183, 165)";
        else
            this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.fillText("Muted", this.width * 0.7425, this.height * 0.93);
    }

    drawFrame() {
        this.scaleCanvas();

        this.context.rect(0, 0, this.width, this.height);
        this.context.fillStyle = '#adbeac';
        this.context.fill();

        this.context.lineWidth = this.width * 0.02;
        this.context.strokeStyle = "rgb(19, 26, 18)";
        this.context.stroke();

        this.context.lineWidth = this.width * 0.005;
        this.context.rect(this.gameDisplayMargin, this.gameDisplayMargin, this.gameDisplayWidth, this.height - this.gameDisplayMargin * 2);
        this.context.stroke();

        const rowPromises = [];

        const promise = (y) => {
            return new Promise(
                () => {
                    for (let x = 0; x < this.gridX; x++) {

                        const isActive = this.grid[y][x] !== 0;

                        const posX = this.gameDisplayMargin + this.cellMargin + (x * this.cellSize) + (x * this.cellMargin);
                        const posY = this.gameDisplayMargin + this.cellMargin + (y * this.cellSize) + (y * this.cellMargin);

                        this.drawCell(isActive, posX, posY);
                    }
                }
            );
        }

        for (let y = 0; y < this.gridY; y++) {
            rowPromises.push(promise(y));
        }

        Promise.all(rowPromises);
    }

    drawWelcome() {
    }

    drawGameOver() {
    }

    drawHowToPlay() {
    }


    resetGrid() {
        this.grid = (() => {
            const grid = [];
            for (let y = 0; y < this.gridY; y++) {
                grid.push([]);
                for (let x = 0; x < this.gridX; x++) {
                    grid[y][x] = 0;
                }
            }
            return grid;
        })()
    }

    //Commands
    pressUp() {
    }

    pressDown() {
    }

    pressLeft() {
    }

    pressRight() {
    }

    pressAction() {
    }

    //Keys
    mapKeys() {
    }

    //Actions
    turnOn() {
        this.isOn = true;

        this.resetGrid();

        this.score = 0;
        this.level = 1;

        this.drawFrame();
        this.drawWelcome();

    }

    turnOff() {
        this.isOn = false;
        clearInterval(this.interval);

        this.score = 0;
        this.level = 1;

        this.resetGrid();

        this.drawFrame();
    }

    reset() {
        this.score = 0;
        this.level = 1;

        this.isGameOver = false;

        this.resetGrid();

        this.start();
    }

    start(next = () => { console.log('next') }, beforeNext = () => { }) {

        if (this.isGameOver) {
            this.isGameOver = false;
        }

        this.isStart = true;

        clearInterval(this.interval);
        this.interval = setInterval(() => {

            this.drawFrame();
            this.drawData();

            beforeNext();

            this.frameCount += 1;
            if (this.frameCount % this.frameActionInterval === 0) {
                next();
            }

        }, 1000 / 30);
    }

    pause() {
        this.isStart = false;
        clearInterval(this.interval);
        this.drawData();
    }

    sound() {
        this.isMuted = !this.isMuted;
        this.drawData();
    }

    playSound(sound) {
        if (!this.isMuted) {
            const audio = new Audio(sound);
            audio.volume = 0.025;
            audio.play();
        }
    }
}
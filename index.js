const ROWS = 20;
const COLS = 20;
const WIDTH = 800;
const HEIGTH = 800;
const CELLS_SIZE = {x: WIDTH / ROWS, y: HEIGTH / COLS};
const startingPoint = {x: 0, y: 0};
const endingPoint = {x: ROWS - 1, y: COLS -1}
let doneGeneration;

const mazeGenerator = new MazeGenerator(WIDTH, HEIGTH, ROWS, COLS);
mazeGenerator.generateCells();
const aStar = new AStar(mazeGenerator.getCells(), mazeGenerator.cells[0], mazeGenerator.cells[23]);

function setup() {
    createCanvas(WIDTH, HEIGTH);
    mazeGenerator.processCells()
    aStar.createNodes();
    aStar.connectNodes();
}

function draw() {
    background(220);
    mazeGenerator.drawCells();
    aStar.startAlgorithm();
    aStar.drawCloseSet();
}

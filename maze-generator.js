class MazeGenerator {
    constructor(w, h, r, c) {
        this.width = w;
        this.heigth = h;
        this.rows = r;
        this.cols = c;
        this.cellSize = {x: w / this.rows, y: h / this.cols};
        this.cells = []
        this.stack = [];
        this.graph = [];
        this.currentVisiting = undefined;
        this.doneGeneration = false;
    }
    generateCells() {
        for(let i = 0; i < ROWS; i++) {
            for(let j = 0; j < COLS; j++) {
                this.cells.push(new Cell(i, j));
            }
        }
        this.currentVisiting = this.cells[0];
    }

    drawCells() {
        this.cells.forEach(e => {
            // rect(CELLS_SIZE.w * e.positionX, CELLS_SIZE.w * e.positionY, CELLS_SIZE.w, CELLS_SIZE.h);
            const w = this.cellSize.x;
            const h = this.cellSize.y;
            const x = e.positionX * w;
            const y = e.positionY * h;
            if (e.walls.top)     line(x, y,                 x + w, y);
            if (e.walls.left)    line(x, y,                 x               , y + h);
            if (e.walls.bottom)  line(x, y + w , x + w, y + h);
            if (e.walls.right)   line(x +  w, y, x + w, y + h);
        })
    }

    processCells(){
        while(!this.doneGeneration) {
            this.currentVisiting.visited = true;
            this.currentVisiting.changeColor(this.cellSize.x)
            const neighbours = this.currentVisiting.getNeighbours(this.cells);
            const next = neighbours[Math.floor(Math.random() * neighbours.length)];
            if(next) {
                this.stack.push(this.currentVisiting);
                next.visited = true;
                this.currentVisiting.connectTo(next);
                removeWall(this.currentVisiting, next);
                this.currentVisiting = next;
            } else {
                this.stack.pop();
                if(this.stack.length === 0) {
                    this.doneGeneration = true;
                    break;
                };
                this.currentVisiting = this.stack[this.stack.length - 1];
            }
        }
    }
    getCells() {
        return this.cells;
    }
}

class Cell {
    constructor (i,j) {
        this.positionX = i;
        this.positionY = j;
        this.walls = {top: true, left: true, bottom: true, right: true}
        this.visited = false;
        this.connectedTo = [];
    }
    connectTo(cell) {
        this.connectedTo.push(cell);
    }
    changeColor(cellSize) {
        const x = this.positionX;
        const y = this.positionY;
        const w = cellSize;
        square(w * x, y * w, w)
        fill(50);
    }
    getNeighbours(cells) {
        const x = this.positionX;
        const y = this.positionY;
        let neighbours = [];
        const top =    cells[index(x,     y - 1)]
        const left =   cells[index(x - 1, y)]
        const bottom = cells[index(x    , y + 1)]
        const right =  cells[index(x + 1, y)]
        if(top && !top.visited) neighbours.push(top);
        if(left && !left.visited) neighbours.push(left);
        if(bottom && !bottom.visited) neighbours.push(bottom);
        if(right && !right.visited) neighbours.push(right);
        return neighbours;
    }
    
}

function removeWall(a, b) {
    //top or bottom
    if(a.positionX === b.positionX){
        // top 
        if(a.positionY - 1 === b.positionY){
            a.walls.top = false;
            b.walls.bottom = false;
        }
        // bottom 
        else  {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }
    //left or right
    if(a.positionY === b.positionY){
        // left 
        if(a.positionX - 1 === b.positionX){
            a.walls.left = false;
            b.walls.right = false;
        }
        // right
        else  {
            a.walls.right = false;
            b.walls.left = false;
        }
    }
}

function index(i, j) {
    if(i < 0 || j < 0 || i > ROWS - 1|| j > ROWS - 1){
        return -1;
    }
    return i * COLS + j;
}
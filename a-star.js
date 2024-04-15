class AStar {
    constructor(cells, startingPoint, endingPoint) {
        this.endingPoint = endingPoint;
        this.startingPoint = startingPoint;
        this.current = startingPoint;
        this.cells = cells;
        this.nodes = [];
        this.path = [];
        this.openSet = [];
        this.closeSet = [];
    }

    startAlgorithm() {
        const openSet = this.openSet;
        const closeSet = this.closeSet;


        if(this.current === this.endingPoint ){
            return;
        } 
        else if (openSet.length > 0) {
            openSet.sort((a,b) => a.f - b.f);

            this.current = openSet.shift();
            closeSet.push(this.current);

            this.current.neighbours.forEach(successor => {
                const getCopy = this.nodes.filter(e => {
                    return successor.position.x === e.cell.positionX && successor.position.y === e.cell.positionY;
                })
                let neighbour = getCopy[0];
                if(closeSet.includes(neighbour)) return;
                if(!openSet.includes(neighbour)){
                    neighbour.g = successor.distance;
                    neighbour.h = neighbour.calculateHeuristics(this.endingPoint);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.previous = this.current
                    openSet.push(neighbour);
                }
                if(openSet.includes(neighbour)){
                    if(neighbour.g < this.current.g){
                        neighbour.g = successor.distance;
                        neighbour.f = neighbour.g + neighbour.h;
        
                    }
                }
            })
        }
        this.path = [];
        let temp = this.current;
        this.path.push(temp)
        while(temp.previous){
            this.path.push(temp.previous)
            temp = temp.previous;
        }

    }

    drawCloseSet() {
        this.path.forEach((e, index) => {
    const pos =  25;
    const size = 50;
    fill(150);
    if (e.previous) {
        const deltaX =  e.previous.cell.positionX-  e.cell.positionX;
        const deltaY =  e.previous.cell.positionY-  e.cell.positionY;
        const width = CELLS_SIZE.x - size + deltaX * CELLS_SIZE.x;
        const height = CELLS_SIZE.y - size + deltaY * CELLS_SIZE.y;
        rect(e.cell.positionX * CELLS_SIZE.x + pos, e.cell.positionY * CELLS_SIZE.y + pos, width, height);
    }
});
    }



    createNodes () {
        this.cells.forEach((e, idx) =>{
            if(e.connectedTo.length > 1){
                this.nodes.push(new Node(e));
            }
            if(!e.walls.top && !e.walls.bottom) return;
            else if(!e.walls.left && !e.walls.right ) return;
            else this.nodes.push(new Node(e));
        })
        this.startingPoint = this.nodes[0];
        this.endingPoint = this.nodes[this.nodes.length - 1];
        this.openSet.push(this.startingPoint)
    }

    findNearestNode(node, direction) {
        const arr = { top: [], left: [], bottom: [], right: [] };
        this.nodes.forEach(cell => {
            const e = cell.cell;
            switch (direction) {
                case 'top':
                    if (e.positionX === node.positionX && e.positionY < node.positionY) arr.top.push(e);
                    break;
                case 'left':
                    if (e.positionY === node.positionY && e.positionX < node.positionX) arr.left.push(e);
                    break;
                case 'bottom':
                    if (e.positionX === node.positionX && e.positionY > node.positionY) arr.bottom.push(e);
                    break;
                case 'right':
                    if (e.positionY === node.positionY && e.positionX > node.positionX) arr.right.push(e);
                    break;
            }
        });
        
        const nearestArray = arr[direction];
        if (nearestArray && nearestArray.length > 0) {
            const nearestNode = nearestArray.reduce((nearest, current) => {
                const nearestDistance = Math.abs(nearest.positionX - node.positionX) + Math.abs(nearest.positionY - node.positionY);
                const currentDistance = Math.abs(current.positionX - node.positionX) + Math.abs(current.positionY - node.positionY);
                return currentDistance < nearestDistance ? current : nearest;
            });
            const distanceToNearest = Math.abs(nearestNode.positionX - node.positionX) + Math.abs(nearestNode.positionY - node.positionY);
            return { node: nearestNode, distance: distanceToNearest};
        }
        
        return null;
    }

    connectNodes() {
        this.nodes.forEach(e => {
            let openWalls = [];
            if(!e.cell.walls.top) openWalls.push('top');
            if(!e.cell.walls.left) openWalls.push('left');
            if(!e.cell.walls.bottom) openWalls.push('bottom');
            if(!e.cell.walls.right) openWalls.push('right');
            openWalls.forEach(w => {
                const nearest = this.findNearestNode(e.cell, w);
                if (nearest) {
                    const node = new Node(nearest.node);
                    node.setGValue(nearest.distance);
                    e.neighbours.push({position: { x: node.cell.positionX, y: node.cell.positionY }, distance: nearest.distance});
                }
            })
        })
    }


}

class Node {
    constructor(cell) {
        this.cell = cell;
        this.neighbours = [];
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.previous = undefined;
    }

    calculateHeuristics(endingPoint) {
        // how far is this cell to the ending point
        const x = endingPoint.cell.positionX;
        const y = endingPoint.cell.positionY;
        return abs(this.cell.positionX - x) + abs(this.cell.positionY - y);
    }
    setGValue(value) {
        this.g = value;
    }
}
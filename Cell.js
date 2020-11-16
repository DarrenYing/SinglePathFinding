class Cell {
    constructor(x, y, isWall) {
        this.x = x;
        this.y = y;

        this.neighbors = [];

        this.dirs = [
            [-1, 0],
            [0, -1],
            [1, 0],
            [0, 1],
        ];

        // this.dirs = [
        //     [0, -1],
        //     [-1, 0],
        //     [0, 1],
        //     [1, 0]
        // ];

        //类型: 0-空白格，1-障碍物，2-起点，3-终点
        // this.wall = isWall;
        this.type = int(isWall);

    }

    init(){
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = undefined;

    }

    drawBack(color) {
        fill(color);
        strokeWeight(2);
        stroke(51);
        rect(this.x * cellw + left_pos + 1, this.y * cellh + top_pos + 1, cellw - 1, cellh - 1);
    }

    show(color) {
        switch (this.type) {
            case 0:
                this.drawBack(color);
                break;
            case 1:
                this.drawBack(100);
                break;
            case 2:
                this.drawBack(color);
                fill(255, 0, 0);
                ellipseMode(RADIUS);
                var r1 = min(cellw, cellh) / 3;
                ellipse(this.x * cellw + left_pos + cellw / 2, this.y * cellh + top_pos + cellh / 2, r1);
                break;
            case 3:
                this.drawBack(color);
                fill(0, 255, 0);
                ellipseMode(RADIUS);
                var r2 = min(cellw, cellh) / 3;
                ellipse(this.x * cellw + left_pos + cellw / 2, this.y * cellh + top_pos + cellh / 2, r2);
                break;
        }
    }


    //return node or null if request is out of bounds
    getNode(i, j, grid) {
        if (i < 0 || i >= grid.length ||
            j < 0 || j >= grid[0].length) {
            return null;
        }
        return grid[i][j];
    }

    addNeighbors(grid) {
        this.neighbors = []; //地图可能更新
        for (var k = 0; k < 4; k++) {
            var node = this.getNode(this.x + this.dirs[k][0], this.y + this.dirs[k][1], grid);
            if (node != null && !(node.type == 1)) {
                this.neighbors.push(node);
            }
        }
    }

    toggleWall() {
        let s = 1 - this.type;
        this.type = s;
        for (var k = 0; k < 4; k++) {
            var node = this.getNode(this.x + this.dirs[k][0], this.y + this.dirs[k][1], gameMap.grid);  //不论邻居是不是障碍物，都要更新
            if (node != null) {
                node.addNeighbors(gameMap.grid);
            }
        }

    }



}

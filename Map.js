class Map {

    constructor(mapCols, mapRows, mapWidth, mapHeight, wallRatio = 0.1) {
        this.cols = mapCols;
        this.rows = mapRows;

        this.grid = [];

        // this.left_pos = left_pos;
        // this.top_pos = top_pos;
        this.w = mapWidth;
        this.h = mapHeight;

        this.wallRatio = wallRatio;

        this.init();
    }

    init() {
        for (var i = 0; i < cols; i++) {
            this.grid[i] = [];
            for (var j = 0; j < rows; j++) {
                var isWall = random(1.0) < this.wallRatio;
                this.grid[i][j] = new Cell(i, j, isWall);
            }
        }

        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                this.grid[i][j].addNeighbors(this.grid);
            }
        }
    }

    removeCellStatus(){
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                this.grid[i][j].init();
            }
        }
    }

    // getMap(cols, rows, width, height) {
    //     return new Map(cols, rows, width, height)
    // }
}

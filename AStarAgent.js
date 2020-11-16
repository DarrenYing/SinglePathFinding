class AStarAgent {
    constructor(mapGrid, start, end) {
        this.map = mapGrid;
        this.start = start;
        this.start.type = 2;
        this.end = end;
        this.end.type = 3;

        this.init();

    }

    init(){
        this.openList = []; //之后优化为优先队列
        this.closeList = [];

        this.openList.push(this.start);

        this.lastNode = null; //不管有无解，所到的最后一个节点
    }

    heuristic(node1, node2) {
        // return dist(node1.x,node1.y,node2.x,node2.y);
        return abs(node1.x - node2.x) + abs(node1.y - node2.y);
    }

    removeFromArray(arr, ele) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == ele) {
                arr.splice(i, 1);
            }
        }
    }

    //拷贝map
    deepcopy(arr){
        var copy = [];
        for(let i=0; i<arr.length; i++){
            copy[i] = arr[i].slice(0);
        }
        return copy;
    }

    // 执行一次搜索步骤
    // @return 0--searching 1--find -1--no solution
    step() {
        if(this.lastNode == this.end){
            // console.log('done');
            return;
        }
        if (this.openList.length > 0) {
            var cur_index = 0;
            for (var i = 1; i < this.openList.length; i++) {
                if (this.openList[i].f < this.openList[cur_index].f) {
                    cur_index = i;
                }
                //优化：如果f值相等，选择g值更大的点
                else if (this.openList[i].f == this.openList[cur_index].f) {
                    if (this.openList[i].g > this.openList[cur_index].g) {
                        cur_index = i;
                    }
                    //如果g值相等，倾向于选择转弯少的，待优化

                }
            }

            var cur = this.openList[cur_index];
            this.lastNode = cur;

            // if (cur == this.end) {
            //     // noLoop();
            //     console.log('done!'); //之后可以换成 text 输出到屏幕上
            //     return 1;
            // }

            this.removeFromArray(this.openList, cur);
            this.closeList.push(cur);

            if (cur == this.end) {
                // noLoop();
                // console.log('done!'); //之后可以换成 text 输出到屏幕上
                return 1;
            }

            var neighbors = cur.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                if (!this.closeList.includes(neighbor)) {
                    var tmpG = cur.g + this.heuristic(neighbor, cur);

                    if (!this.openList.includes(neighbor)) {
                        this.openList.push(neighbor);
                    } else if (tmpG >= neighbor.g) {	//neighbor.g初始默认是0，有问题
                        continue;
                    }

                    neighbor.g = tmpG;
                    neighbor.h = this.heuristic(neighbor, this.end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = cur;
                }
            }

            return 0;

        } else {
            // console.log('no solution!');
            return -1;
        }
    }
}

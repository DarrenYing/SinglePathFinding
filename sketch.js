var cols;
var rows;
// var grid = new Array(cols);

var cellw = 20;
var cellh = 20;
var mapw;
var maph;
var left_pos = 10;
var top_pos = 10;
var status = "";

var agent;
var gameMap;
var mapGraph = null; //将地图存储为图片，节省每次刷新的绘制时间
var mapEdit; //在运行前可以更改地图

var flagStart;
var flagEnd;
var flagBlock;

// var paused = true;
var paused;
var stepsAllowed = 0;

var components = [];
var runPauseButton;
var stepButton;
var resetButton;

var canvas;
var inputRow;
var inputCol;
var wallPercent;

// radio buttons
var radioStart;
var radioEnd;
var radioBlock;


var isReady = false;

function initSearch() {
    mapGraph = null;
    mapEdit = true;

    status = "Parameter Tuning";

    agent1.init();
    gameMap.removeCellStatus();
}

function pickPos(row, col) {
    if (row == undefined) {
        var row = floor(random(0, rows));
    }
    if (col == undefined) {
        var col = floor(random(0, cols));
    }
    return [row, col];
}

function pickNode(row, col) {
    if (row == undefined) {
        var row = floor(random(0, rows));
    }
    if (col == undefined) {
        var col = floor(random(0, cols));
    }
    gameMap.grid[row][col].type = 0;
    return gameMap.grid[row][col];
}

function initCanvas() {


    rows = inputRow.value();
    cols = inputCol.value();
    wallRatio = wallPercent.value();

    mapw = cols*cellw;
    maph = rows*cellh;

    var canvasWidth = mapw+100;
    canvas = createCanvas(canvasWidth, canvasWidth);
    canvas.position(screen.availWidth / 2 - canvasWidth/2, 100);

    gameMap = new Map(cols, rows, mapw, maph, wallRatio);
    agent1 = new AStarAgent(gameMap.grid, pickNode(0, 0), pickNode());

    paused = true;
    initSearch();

    removeOrgButton(runPauseButton);
    runPauseButton = new Button("运行", mapw+30, 20, 50, 30, runpause);
    components.push(runPauseButton);

    removeOrgButton(stepButton);
    stepButton = new Button("单步", mapw+30, 70, 50, 30, step)
    components.push(stepButton);

    removeOrgButton(resetButton);
    resetButton = new Button("重置", mapw+30, 120, 50, 30, restart)
    components.push(resetButton);

    isReady = true;
}

function removeOrgButton(btn) {
    if (btn) {
        let i = components.indexOf(btn);
        components.splice(i, 1);
    }
}

function setup() {
    // translate(left_pos,top_pos);
    // createCanvas(mapw + left_pos * 2, maph + top_pos * 2);
    // canvas.class('myCav');

    radioStart = select('#start');
    radioEnd = select('#end');
    radioBlock = select('#block');

    inputRow = select('#row');
    inputCol = select('#col');
    wallPercent = select('#blockPercent');
    btn = select('#gmap');

    btn.mousePressed(initCanvas);

    // components.push(new SettingBox(""))

}

function pauseCheck(isPause) {
    paused = isPause;
    // console.log('pauseCheck:', paused);
    runPauseButton.label = paused ? "运行" : "暂停";
}

function runpause(button) {
    mapEdit = false;
    // console.log('runpause:', paused);
    pauseCheck(!paused);
}

function restart(button) {
    //重置状态
    initSearch();
    pauseCheck(true);
}

function step() {
    mapEdit = false;
    pauseCheck(true);
    stepsAllowed = 1;
}

function checkRadio() {
    if (radioStart.elt.checked) {
        flagStart = true;
        flagEnd = false;
        flagBlock = false;
    } else if (radioEnd.elt.checked) {
        flagEnd = true;
        flagStart = false;
        flagBlock = false;
    } else {
        flagBlock = true;
        flagStart = false;
        flagEnd = false;
    }
}

function isBoundSatisfied(x, y) {
    return x < cols && y < rows && x >= 0 && y >= 0;
}

function mouseClicked() {
    for (var i = 0; i < components.length; i++) {
        components[i].mouseClick(mouseX, mouseY);
    }
}

function mousePressed() {
    if (mapEdit) {
        let x = int((mouseX - left_pos) / cellw);
        let y = int((mouseY - top_pos) / cellh);
        // console.log(x, y);
        checkRadio();
        if (isBoundSatisfied(x, y)) {
            if (flagStart) {
                if (gameMap.grid[x][y].type != 1) {
                    //清除原来的start
                    agent1.start.type = 0;
                    agent1.openList.pop();
                    //设定新的start
                    gameMap.grid[x][y].type = 2;
                    agent1.start = gameMap.grid[x][y];
                    agent1.openList.push(agent1.start);
                }
            } else if (flagEnd) {
                if (gameMap.grid[x][y].type != 1) {
                    agent1.end.type = 0;
                    gameMap.grid[x][y].type = 3;
                    agent1.end = gameMap.grid[x][y];
                }
            } else {
                if (!(x == agent1.start.x && y == agent1.start.y) &&
                    !(x == agent1.end.x && y == agent1.end.y)) {
                    gameMap.grid[x][y].toggleWall();
                }
            }
        }
    }
}



function drawButtons() {
    for (var i = 0; i < components.length; i++) {
        components[i].show();
    }
}

function searchStep() {
    if (!paused || stepsAllowed > 0) {
        var result = agent1.step();
        stepsAllowed--;

        switch (result) {
            case -1:
                status = "No Solution";
                break;
            case 0:
                status = "Still Searching";
                break;
            case 1:
                status = "Goal Reached";
                break;
        }
    }
}

function drawMap() {
    if (mapEdit) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                gameMap.grid[i][j].show(color(255));
            }
        }
        mapGraph = get(left_pos, top_pos, gameMap.w + 1, gameMap.h + 1);
    } else {
        image(mapGraph, left_pos, top_pos);
    }
}

function calcPath(end) {
    path = []
    var tmp = end;
    while (tmp) {
        path.push(tmp);
        tmp = tmp.parent;
    }
    return path;
}

function drawPath(path) {
    noFill();
    stroke(255, 0, 200);
    strokeWeight(cellw / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(left_pos + path[i].x * cellw + cellw / 2, top_pos + path[i].y * cellh + cellh / 2);
    }
    endShape();
}

function drawAgentTrace(agent) {
    for (var i = 0; i < agent.closeList.length; i++) {
        agent.closeList[i].show(color(255, 0, 0, 50));
    }

    for (var i = 0; i < agent.openList.length; i++) {
        agent.openList[i].show(color(0, 255, 0, 50));
    }

    var path = calcPath(agent.lastNode);
    drawPath(path);
}

function draw() {


    // console.log(inputRow.value());
    // console.log(inputCol.value());

    if (isReady) {

        searchStep();

        background(255);

        drawButtons();

        text("当前状态:" + status, 10, 450);

        drawMap();

        drawAgentTrace(agent1);
    }

    // for (var i = 0; i < path.length; i++) {
    //     path[i].show(color(0, 0, 255));
    // }


}

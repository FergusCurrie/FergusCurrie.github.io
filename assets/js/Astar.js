// Class for cell on grid 
class Cell {
    constructor(x, y, w, s, f, pm) {
        this.x = x;
        this.y = y;
        this.wall = w;
        this.start = s;
        this.finish = f;
        this.g = 0;
        this.h = 0;
        this.f = -1;
        this.parent = null;
        this.path_member = pm;
    }

    draw_cell(context, x, y, cell_w, cell_h) {

        context.lineWidth = 1;
        context.strokeStyle = "#FFc800";
        context.strokeRect(x, y, cell_w, cell_h);
        if (this.path_member == true) {
            context.fillStyle = "#FFc800";
            context.fillRect(x, y, cell_w, cell_h);
        }
        if (this.start || this.finish) {
            context.fillStyle = "#00a520";
            context.fillRect(x, y, cell_w, cell_h);
        }
        if (this.wall == true) {
            context.fillStyle = "#003A8e";
            context.fillRect(x, y, cell_w, cell_h);
        }
    }
}

// Draws the graph for current num array 
function draw() {
    // Clear canvas
    var context = canAStar.getContext("2d");
    context.clearRect(0, 0, canAStar.width, canAStar.height);

    // Runs the A Star algorithm 
    if (astar_running) {
        // Remove old path
        resetAStarFields();
        // Get new path
        path = doAStar();
        if (path != null) {
            for (var i = 0; i < path.length; i++) {
                path[i].path_member = true;
            }
        }
    }

    // Draw grid 
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j].draw_cell(context, i * cell_w, j * cell_h, cell_w, cell_h);
        }

    }
}

// Checks an x,y position is inside the grid and not a wall
function valid_move(x, y) {
    if (x < 0 || x >= gridSize) {
        return false;
    }
    if (y < 0 || y >= gridSize) {
        return false;
    }
    if (grid[x][y].wall == true) {
        return false;
    }
    return true;
}

// Return distance between finish and given x,y
function euclidian(x, y) {
    return Math.sqrt(Math.pow(getFinish().x - x, 2) - Math.pow(getFinish().y - y, 2))
}

// Function to remove element e from list a
function remove(a, e) {
    var index = -1;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == e) {
            index = i;
        }
    }
    a.splice(index, 1);
}

// Function to check if element e is in list a
function does_contain(a, e) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == e) {
            return true;
        }
    }
    return false;
}

// Returns the start Cell object
function getStart() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j].start == true) {
                return grid[i][j];
            }
        }
    }
}

// Returns the finish Cell object
function getFinish() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            if (grid[i][j].finish == true) {
                return grid[i][j];
            }
        }
    }
}

// Function which executes A Star
function doAStar() {
    // Find start
    var current = getStart();
    var open = [];
    var closed = [];
    current.g = 0;
    current.h = euclidian(current.x, current.y);
    current.f = current.g + current.h;
    // While not goal
    var goal = getFinish();
    while (current != goal) {
        // For every adjacent node
        adj_matrix = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // UP , RIGHT, LEFT , DOWN
        for (var x = 0; x < adj_matrix.length; x++) {
            adj_m_value = adj_matrix[x];
            if (valid_move(current.x + adj_m_value[0], current.y + adj_m_value[1])) {
                var adj = grid[current.x + adj_m_value[0]][current.y + adj_m_value[1]];
                if (!does_contain(open, adj) && !does_contain(closed, adj)) {
                    open.push(adj);
                    // Decide on length of g
                    var dist = 1;
                    if (adj.x != current.x && adj.y != current.y) {
                        dist = Math.sqrt(2);
                    }
                    adj.g = current.g + dist;
                    adj.h = euclidian(adj.x, adj.y);
                    var newF = adj.g + adj.h;
                    if (newF < adj.F || adj.f == -1) {
                        adj.f = newF;
                        adj.parent = current;
                    }
                }
            }
        }
        closed.push(current);
        // Fail condition
        if (open.length == 0) {
            return null;
        }
        // Set current
        current = open[0];
        for (o in open) {
            if (o.f < current.f) {
                current = 0;
            }
        }
        remove(open, current);
    }
    // Make path
    path = [];
    var st = getStart();
    while (current != st) {
        path.push(current);
        current = current.parent;
    }
    path.push(st);
    return path;
}

// Function called when solve button pressed, toggles run button and wether A Star search is running
function doSearch() {
    if (astar_running) {
        document.getElementById("br").innerHTML = "Run";
        astar_running = false;
        // Remove path
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                grid[i][j].path_member = false;
            }
        }
    } else {
        document.getElementById("br").innerHTML = "Stop";
        astar_running = true;
    }
    draw();
}

// Resets g, h, f and path_member of each cell so that it can be run
function resetAStarFields() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j].path_member = false;
            grid[i][j].g = 0;
            grid[i][j].h = 0;
            grid[i][j].f = -1;
        }
    }
}

// Fully resets grid and start/finish poisition. Run/Stop button set to Run
function doReset() {
    astar_running = false;
    document.getElementById("br").innerHTML = "Run";
    for (var i = 0; i < gridSize; i++) {
        grid.push([]);
        for (var j = 0; j < gridSize; j++) {
            var s = false;
            var f = false;
            if (start[0] == i && start[1] == j) {
                s = true;
            }
            if (finish[0] == i && finish[1] == j) {
                f = true;
            }
            grid[i][j] = new Cell(i, j, false, s, f, false);
        }
    }
    draw();
}

// From a mouse event returns the cell that was clicked at that location
function getCell(event) {
    // Math to get correct grid index of click ssqaure
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left; //x position within the element.
    var y = event.clientY - rect.top;  //y position within the element.
    var box = [Math.round((cell_w / 2 + x) / cell_w), Math.round((cell_h / 2 + y) / cell_h)];
    return grid[box[0] - 1][box[1] - 1];
}

// Function for when a drag begins - sets variables. 
function startDrag() {
    dragging = true;
    adding = null;
    addedThisDrag = [];
    draggingStart = false;
    draggingFinish = false;
    // Check if dragging start or finish
    cell = getCell(event);
    if (cell.start == true) {
        draggingStart = true;
    }
    else if (cell.finish == true) {
        draggingFinish = true;
    }
    drag();
}

// Resets variables for when dragged again
function stopDrag() {
    dragging = false;
    draggingStart = false;
    draggingFinish = false;
}

// Function for when drag is occuring, will get called multiple times er drag
function drag() {
    if (dragging) {
        cell = getCell(event);
        if (cell == null) {
            return;
        }
        if (draggingFinish) {
            cell.wall = false;
            getFinish().finish = false;
            cell.finish = true;
        } else if (draggingStart) {
            cell.wall = false;
            getStart().start = false;
            cell.start = true;
        }
        else if (!does_contain(addedThisDrag, cell)) {
            if (addedThisDrag.lenth > 0) {
                if (grid[addedThisDrag[0][0]][addedThisDrag[0][1]].wall == true) {
                    adding = true;
                } else {
                    adding = false;
                }
            }
            else if (cell.wall == true) {
                if (adding == null) {
                    adding = false;
                }
                if (!adding && cell.start != true && cell.finish != true) {
                    cell.wall = false;
                }
            } else {
                if (adding == null) {
                    adding = true;
                }
                if (adding && cell.start != true && cell.finish != true) {
                    cell.wall = true;
                }
            }
            addedThisDrag.push(cell);
        }
        draw();
    }
}

//###############################################################################################

// Canvas varables
var canAStar = document.getElementById("myAstar");
resizeCanvasToDisplaySize(canAStar);

// Global variables
var gridSize = 20;
var start = [3, 3];
var finish = [15, 15];
var grid = [];
var astar_running = false;
cell_w = canAStar.width / gridSize;
cell_h = canAStar.height / gridSize;

// Listener variables 
var dragging = false;
var addedThisDrag = [];
var adding = null;
var draggingStart = false;
var draggingFinish = false;

// Create event listener
canAStar.addEventListener("mousedown", startDrag);
canAStar.addEventListener("mouseup", stopDrag);
canAStar.addEventListener('mousemove', drag);

// Reset A Star
doReset();

// Global variables
var sudukoVisualiser = [];
var intervalSudoku;
var solved = false;
var emptyBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var board = emptyBoard;
rand();
var initBoard = cloneBoard(board);
drawBoard(board);

// Function called when randomise button pressed
function rand(){
    solved = false;
    sudukoVisualiser = [];
    makeGoodBoard();
    drawBoard(board);
}

// Function which repeats making a new random board until it is a valid board
function makeGoodBoard(){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            board[i][j] = 0;
            if(Math.random() > 0.90){
                board[i][j] = Math.ceil(Math.random() * 9);
            }
        }
    }
    if(!isGoodBoard()){
        makeGoodBoard();
    }
}

// Function to test if a generated board is valid
function isGoodBoard(){
    for(var x = 0; x < board.length; x++){
        for(var y = 0; y < board[x].length; y++){
            if(board[y][x] != 0){
                clone_board = cloneBoard(board);
                clone_board[y][x] = 0;
                if(!goodPlace(x,y,board[y][x],clone_board)){
                    return false;
                }
            }
        }
    }
    return true;
}

// Function called when solve button pressed, uses solveBoard() to solve and the animates it with interval
// calling animateSolve()
function solve(){
    if(!solved){
        solved = true;
        initBoard = cloneBoard(board);
        board = solveBoard(0, 0, board);
        makeAnimation();
        intervalSudoku = setInterval(animateSolve, 10);
        drawBoard(board);
    }
}

// Make animate board visualiser 
function makeAnimation(){
    vBoard = cloneBoard(initBoard);
    for(var i = 0 ; i < 9; i++){
        for(var j = 0; j < 9; j++){
            vBoard[i][j] = board[i][j];
            sudukoVisualiser.push(cloneBoard(vBoard));
        }
    }
}

// Function to do one step of animation, removes and draws board state from list
function animateSolve(){
    if(sudukoVisualiser.length != 0){
        drawBoard(sudukoVisualiser.shift());
    }else{
        clearInterval(interval);
    }
}

// Recursivly solves board, keeps track of all board states for animate the solve
function solveBoard(x, y, tBoard) {
    if (y == 9) {
        sudukoVisualiser.push(tBoard);
        return tBoard;
    }
    if (tBoard[y][x] == 0) {
        // Board position is empty so try placing 1-9 on square
        for (var f = 1; f < 10; f++) {
            if (goodPlace(x, y, f, tBoard)) {
                tBoard[y][x] = f;
                var xi = x;
                var yi = y;
                if (xi == 8) {
                    xi = 0;
                    yi++;
                } else {
                    xi++;
                }
                var hold = solveBoard(xi, yi, cloneBoard(tBoard));
                if (hold != false && hold != undefined) {
                    return hold;
                }
            }
        }
    } else {
        // already placed, go next
        var xi = x;
        var yi = y;
        if (xi == 8) {
            xi = 0;
            yi++;
        } else {
            xi++;
        }
        var hold = solveBoard(xi, yi, cloneBoard(tBoard));
        if (hold != false && hold != undefined) {
            return hold;
        }
    }
}

// Returns a clone of board state - stops 
function cloneBoard(board){
    var newBoard = [];
    for(var i = 0; i < board.length; i++){
        newBoard.push([]);
        for(var j = 0; j < board[i].length; j++){
            newBoard[i].push(board[i][j]);
        }
    }
    return newBoard;
}


// Function tests if if a specific placement (desribed by a poisition x,y and value of place p) is possible, 
// Returns boolean 
function goodPlace(x, y, p, tBoard) {
    // Arrays which make function easier 
    var checkSquareLoc = [[1, 1],[4, 1],[7, 1], [1, 4],[4, 4], [7, 4],[1, 7],[4, 7],[7, 7]];
    var checkSquareMatrix = [-1, -1, 0, -1, 1, -1, -1, 0, 0, 0, 1, 0, -1, 1, 0, 1, 1, 1];
    
    // Check p isn't already in row or column
    for (var i = 0; i < 9; i++) {
        if (tBoard[i][x] == p) {
            return false;
        }
        if (tBoard[y][i] == p) {
            return false;
        }
    }
    
    // Find which sqaure the placement is in
    var index = -1;
    if (x < 3 && y < 3) {
        index = 0;
    } else if (x >= 3 && x < 6 && y < 3) {
        index = 1;
    } else if (x >= 6 && y < 3) {
        index = 2;
    } else if (x < 3 && y >= 3 && y < 6) {
        index = 3;
    } else if (x >= 3 && x < 6 && y >= 3 && y < 6) {
        index = 4;
    } else if (x >= 6 && y >= 3 && y < 6) {
        index = 5;
    } else if (x < 3 && y >= 6) {
        index = 6;
    } else if (x >= 3 && x < 6 && y >= 6) {
        index = 7;
    } else if (x >= 6 && y >= 6) {
        index = 8;
    }

    // Using checkSquareLoc find center sqaure that p is in then check surrounding sqaures with
    // checkSquareMatrix. 
    for (var i = 0; i < checkSquareMatrix.length; i++) {
        var xi = checkSquareLoc[index][0] + checkSquareMatrix[i];
        i += 1;
        var yi = checkSquareLoc[index][1] + checkSquareMatrix[i];
        if (tBoard[yi][xi] == p) {
            return false;
        }
    }
    return true;
}

// Wipes canvas and then redraws it
function drawBoard(board) {
    var start = 0;
    var canvas = document.getElementById("mySudoku");
    resizeCanvasToDisplaySize(canvas);
    var size = canvas.width;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFc800";
    ctx.lineWidth = 2;
    ctx.font = "1em Georgia";
    ctx.fillStyle = "#FFc800";
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            ctx.strokeRect(start+i*size/9,start+j*size/9,size/9,size/9);
            if(board[j][i] != 0){
                var inc = size/18; //size/18
                ctx.fillText(board[j][i],start+i*size/9+inc,start+j*size/9+inc);
                
            }
        }
    }
    ctx.lineWidth = 10;
    ctx.strokeRect(start+0, start+0, size, size);
    doLine(ctx,start+size/3,start+0,start+size/3,start+size);
    doLine(ctx,start+2*size/3,start+0,start+2*size/3,start+size);
    doLine(ctx,start+0,start+size/3,start+size,start+size/3);
    doLine(ctx,start+0,start+2*size/3,start+size,start+2*size/3);
}

// Function to draw a line on context between two points x1,y1 and x2,y2
function doLine(context,x1,y1,x2,y2){
   context.beginPath(); 
   context.moveTo(x1,y1);
   context.lineTo(x2,y2);
   context.stroke();
}

// Resizes canvas so that is appears in normal proportion 
function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
 }



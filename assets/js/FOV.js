
function drawFOV() {
    // Create 
    var context = canFOV.getContext("2d");
    context.clearRect(0, 0, canFOV.width, canFOV.height);

    // Draw light source
    context.strokeStyle = "#FFc800"
    context.fillStyle = "#FFc800";
    context.beginPath();
    context.arc(target[0], target[1], 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // Draw FOV
    for (var x = 0; x < polygons.length; x++) {
        var poly = polygons[x];
        //Create shadow
        poly_shadow = getPolyShadow(poly);
        poly_shadow = add_corners(poly_shadow);
        for (var i = 0; i < poly.length; i++) {
            poly_shadow.push(poly[i]);
        }
        while (poly_shadow.length > 2) {
            var start = poly_shadow[0];
            context.fillStyle = "#003A8e";
            for (var i = 2; i < poly_shadow.length; i++) {
                drawPolygon([start, poly_shadow[i], poly_shadow[i - 1]], context);
            }
            // Trying to eliminate white lines
            for (var i = 1; i < poly_shadow.length - 1; i++) {
                drawPolygon([start, poly_shadow[i], poly_shadow[i + 1]], context);
            }
            poly_shadow.splice(0, 1);
        }
    }

    // Draw walls 
    context.strokeStyle = "#FFc800";
    for (var x = 0; x < polygons.length; x++) {
        var poly = polygons[x];
        context.lineWidth = 2;
        doLine(context,poly[0][0], poly[0][1],poly[1][0], poly[1][1]);
    }
}



function add_corners(points) {
    var top = false;
    var right = false;
    var bot = false;
    var left = false;
    var p_left = -1;
    var p_top = -1;
    for (var i = 0; i < points.length; i++) {
        if (points[i][1] == 0) {
            top = true;
            p_top = points[i][0];
        }
        if (points[i][1] == canFOV.height) {
            bot = true;
        }
        if (points[i][0] == 0) {
            left = true;
            p_left = points[i][1];
        }
        if (points[i][0] == canFOV.width) {
            right = true;
        }
    }
    if (left == true && top == true) {
        points.push([0, 0]);
    }
    if (left == true && bot == true) {
        points.push([0, canFOV.height]);
    }
    if (right == true && top == true) {
        points.push([canFOV.width, 0]);
    }
    if (right == true && bot == true) {
        points.push([canFOV.width, canFOV.height]);
    }
    if(right && left){
        if(target[1] - p_left > 0){
            points.push([0,0]);
            points.push([canFOV.width, 0]);
        }else{
            points.push([canFOV.width, canFOV.height]);
            points.push([0, canFOV.height]);
        }
    }
    if(top && bot){
        if(target[0] - p_top > 0){
            points.push([0,0]);
            points.push([0,canFOV.height]);
        }else{
            points.push([canFOV.width,0]);
            points.push([canFOV.width,canFOV.height]);
        }
    }
    return points;
}


function getPolyShadow(poly) {
    res = [];
    // For each point 
    for (var y = 0; y < poly.length; y++) {
        // Calculate all 4 intercepts 
        var point = [poly[y][0], poly[y][1]];
        var pot_int = []; // Potential intercept 
        pot_int.push([valueOnLine(point[0], point[1], target[0], target[1], "x", 0), 0]); //x_min_int
        pot_int.push([0, valueOnLine(point[0], point[1], target[0], target[1], "y", 0)]); //y_min_int
        pot_int.push([valueOnLine(point[0], point[1], target[0], target[1], "x", canFOV.height), canFOV.height]); //y_max_int
        pot_int.push([canFOV.width, valueOnLine(point[0], point[1], target[0], target[1], "y", canFOV.width)]); //y_max_int

        // Get candidates that are in field of view
        var pic = []; //pot_int cleaned 
        for (var i = 0; i < pot_int.length; i++) {
            // if x in canvas range
            if (pot_int[i][0] >= 0 && pot_int[i][0] <= canFOV.width &&
                pot_int[i][1] >= 0 && pot_int[i][1] <= canFOV.height) { // OR OR AND 
                pic.push(pot_int[i]);
            }
        }

        dist_int0_target = Math.sqrt(Math.abs(Math.pow(target[0] - pic[0][0], 2) - Math.pow(target[1] - pic[0][1], 2)));
        dist_int0_poly_point = Math.sqrt(Math.abs(Math.pow(point[0] - pic[0][0], 2) - Math.pow(point[1] - pic[0][1], 2)));


        //if dist better
        if (dist_int0_poly_point < dist_int0_target) {
            res.push(pic[0])
        }
        else {
            res.push(pic[1]);
        }
    }
    return res;
}


// For line between two points (x1,y1) and (x2,y2) return x or y (xory) when other is at (value)
// uses Y = mx + c
function valueOnLine(x1, y1, x2, y2, xory, value) {
    var m = (y2 - y1) / (x2 - x1) //gradient
    var c = y1 - (m * x1);
    if (xory == "x") {
        return (value - c) / m;
    }
    if (xory == "y") {
        return (m * value) + c
    }
}

// 2D array list of points 
function drawPolygon(list, ctx) {
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(list[0][0], list[0][1]);
    for (var i = 1; i < list.length; i++) {
        ctx.lineTo(list[i][0], list[i][1]);
    }
    ctx.closePath();
    ctx.fill();
}

function resizecanFOVToDisplaySize(canAStar) {
    // look up the size the canAStar is being displayed
    const width = canAStar.clientWidth;
    const height = canAStar.clientHeight;

    // If it's resolution does not match change it
    if (canAStar.width !== width || canAStar.height !== height) {
        canAStar.width = width;
        canAStar.height = height;
        return true;
    }

    return false;
}


// Polygon is clockwise group of points


var fromEdge = 0.1;

//var polygons = [[[30,30]]];

var canFOV = document.getElementById("myFOV");
resizecanFOVToDisplaySize(canFOV);
var target = [canFOV.height / 2, canFOV.width / 2];
var draggingFOV = false;

var polygons = [[[fromEdge*2*canFOV.width,fromEdge*2*canFOV.height],[canFOV.width-fromEdge*2*canFOV.width,fromEdge*2*canFOV.height]],
[[fromEdge*2*canFOV.width,canFOV.height-fromEdge*2*canFOV.height],[canFOV.width-fromEdge*2*canFOV.width,canFOV.height-fromEdge*2*canFOV.height]],
[[fromEdge*2*canFOV.width,fromEdge*4*canFOV.height],[fromEdge*2*canFOV.width,canFOV.height-fromEdge*4*canFOV.height]],
[[canFOV.width-fromEdge*2*canFOV.width,fromEdge*4*canFOV.height],[canFOV.width-fromEdge*2*canFOV.width,canFOV.height-fromEdge*4*canFOV.height]]
];


function f_draggingFOV() {
    if (true) {
        var rect = event.target.getBoundingClientRect();
        var x = event.clientX - rect.left; //x position within the element.
        var y = event.clientY - rect.top;  //y position within the element.
        target = [x, y];
        drawFOV();
    }
}



canFOV.addEventListener('mousemove', function (event) {
    f_draggingFOV();
}, false);



drawFOV();


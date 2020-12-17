

//Global Variables 
var nums;
var numsVisualiser;
var sizeSort = 100;
var interval; // for animation 
var elementSize = 700;
var sorted = false;
loadArray();

//Returns golden ratio of longer side 
function goldenRatio(n){
    return (n / 1.61803398875);
}

//Draws the graph for current num array 
function makeGraph() {
    //Canvas 
    var canvas = document.getElementById("mySort");
    resizeCanvasToDisplaySize(canvas);
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    cW = canvas.width;
    cH = canvas.height;

    //Rectangle s
    context.fillStyle = "#FFc800";
    //context.fillRect(0, cH - 50 , 100 , cW / sizeSort )ø;
    for (var x = 0; x < sizeSort; x++) {
        var rectHeight = nums[x];
        context.strokeStyle = "#FFc800";
        context.strokeRect(x * (cW / sizeSort), cH - rectHeight / 2, cW / sizeSort, rectHeight);
        context.fillRect(x * (cW / sizeSort), cH - rectHeight / 2, cW / sizeSort, rectHeight);
    }
}


//Populates nums with random numbers 
function loadArray() {
    sorted = false;
    nums = [];
    numsVisualiser = [];
    for (var i = 0; i < sizeSort; i++) {
        nums[i] = Math.round(Math.random() * elementSize);
    }
    makeGraph();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Also not perfect rn bc we return everytime a change is made for purposes of animation .... 

//Try break or find shit functionality with stcount ubtton order preses 

//Becuase there is no wait funciton, need to code slightly differently... 

//First function called when sort button pressed, determines what type of sort to do then on interval displays
function sortArray() {
    if(!sorted){
        sorted = true;
        var selectBox = document.getElementById("sorttype").value;
        if (selectBox == "bubbleSort") {
            bubbleSort();
        }
        else if (selectBox == "quickSort") {
            if(nums == undefined){
                console.log("no good");
            }
            nums = quickSort(nums, 0, nums.length);
        }
        else if (selectBox == "mergeSort") {
            nums = mergeSort(nums, 0);
        }
        else if (selectBox == "insertionSort") {
            nums = insertionSort();
        }
        else if (selectBox == "selectionSort") {
            nums = selectionSort();
        }
        interval = setInterval(visualiser, 1);
    }
}

//Called on interval, makes graph of next iteration of sort 
function visualiser() {
    if (numsVisualiser.length <= 0) {
        clearInterval(interval);
    } else {
        nums = numsVisualiser.shift();
    }
    makeGraph();
}

//Deep copies an array
function deepCopy(l) {
    var n = [];
    for (var x = 0; x < l.length; x++) {
        n[x] = l[x];
    }
    return n;
}

//Swaps two things in array
function swap(A, i, j) {
    var hold = A[i];
    A[i] = A[j];
    A[j] = hold;
}

function goldenRatio(x){
    return x*1.61803398875;
}

//Inclusive both ends 
function copyArray(A, start, end, B) {
    for (var k = start; k <= end; k++) {
        B[k] = A[k];
    }
}

//Bubble Sort
function bubbleSort() {
    for (var i = 1; i < sizeSort; i++) {
        for (var j = 0; j < sizeSort - 1; j++) {
            //if ooo swap 
            if (nums[j] > nums[j + 1]) {
                swap(nums, j + 1, j)
                numsVisualiser.push(deepCopy(nums));
            }
        }
    }
}

function quickSort(A, start, end) {
    if (start < end) { // Stop condition 
        var pIndex = quickSortPartion(A, start, end);
        quickSort(A, start, pIndex - 1); // Left 
        quickSort(A, pIndex + 1, end); // Right
    }
}

//Used to partion into smaller chunks 
function quickSortPartion(A, start, end) {
    // Picking Pivot
    var pivot = A[end];
    // Positioning Pivot
    var pIndex = start;
    for (var i = start; i < end; i++) {
        if (A[i] <= pivot) {
            swap(A, i, pIndex);
            numsVisualiser.push(deepCopy(nums));
            pIndex++;
        }
    }
    swap(A, pIndex, end);
    numsVisualiser.push(deepCopy(nums));
    return pIndex;
}

function mergeSort(a, depth) {
    //Stop condition  
    if (a.length == 1) {
        return a;
    }

    //Split into two arrays
    var arrayOne = [];
    var arrayTwo = [];
    var middle = Math.floor(a.length / 2);
    copyArray(a, 0, middle - 1, arrayOne);
    copyArray(a, middle, a.length, arrayTwo);

    //Removes empty part of array that copyArray created
    var arrayTwo = arrayTwo.filter(function (el) {
        return el != undefined;
    });

    //Recursive call
    arrayOne = mergeSort(arrayOne, depth + 1);
    arrayTwo = mergeSort(arrayTwo, depth + 1);

    //Return 
    return mergeArray(arrayOne, arrayTwo);
}

function mergeArray(a, b) {
    var c = [];
    while (a.length > 0 && b.length > 0) {
        if (a[0] > b[0]) {
            c.push(b[0]);
            b.splice(0, 1);
        } else {
            c.push(a[0]);
            a.splice(0, 1);
        }
    }
    //Either a or b empty
    while (a.length > 0) {
        c.push(a[0]);
        a.splice(0, 1);
    }
    while (b.length > 0) {
        c.push(b[0]);
        b.splice(0, 1);
    }
    return c;
}

function insertionSort() {
    var i = 1;
    while (i < nums.length) {
        var j = i;
        while (j > 0 && (nums[j - 1] > nums[j])) {
            swap(nums, j, j - 1);
            numsVisualiser.push(deepCopy(nums));
            j -= 1;
        }
        i += 1;
    }
    return nums;
}

function selectionSort() {
    for (var i = 0; i < nums.length; i++) {
        var jMin = i;
        for (var j = i + 1; j < nums.length; j++) {
            if (nums[j] < nums[jMin]) {
                jMin = j;
            }
        }
        if (jMin != i) {
            swap(nums, i, jMin);
            numsVisualiser.push(deepCopy(nums));
        }
    }
    return nums;
}

function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
 
    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
 
    return false;
 }



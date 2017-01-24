var canvas;

//get the 2d context out of canvas
var context;

var width;
var height;

var xBoard = 0;
var oBoard = 0;

var score = {
    win: 0,
    lost: 0,
    tie:0
};

function drawBoard()
{
    context.beginPath();
    context.strokeStyle = 'black';

    // context.lineWidth = 4;
    // context.lineTo(100,100);

    var w3 =Math.round( height/3);
    for(y=1;y<3;y++)
    {
        context.moveTo(0,w3*y);
        context.lineTo(width,w3*y);
    }

var h3 =width/3;
    for(x=1;x<3;x++)
    {
        context.moveTo(h3*x,0);
        context.lineTo(h3*x,height);
    }

    context.stroke();
    context.closePath()
}


function drawX(x,y)
{
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.lineWidth = 4;
     
    var w3 = width/3;
    var h3 = height/3;

    var ix = Math.floor(x/w3);
    var iy = Math.floor(y/h3);

    context.stroke();
    context.closePath();
}

function drawO(x, y) {
    context.beginPath();
    context.strokeStyle = '#0000ff';
    context.lineWidth = 10;

    var ox = (width / 3) * .1;
    var bx = ox + x * (width / 3);
    var ex = -ox + (x + 1) * (width / 3);

    var oy = (height / 3) * .1;
    var by = oy + y * (height / 3);
    var ey = -oy + (y + 1) * (height / 3);

    console.log("drawO:ox=" + ox + ", bx=" + bx + ", ex=" + ex);
    console.log("drawO:oy=" + oy + ", by=" + by + ", ey=" + ey);

    /*
    context.moveTo(bx, by);
    context.lineTo(ex, ey);

    context.moveTo(bx, ey);
    context.lineTo(ex, by);
    */
    var rx = (ex - bx - ox) / 2;
    var ry = (ey - by - oy) / 2;
    var r = (rx > ry) ? ry : rx;
    
    context.arc(
        bx+(ex-bx)/2,
        by+(ey-by)/2,
        r,
        0,
        Math.PI*2,
        true
        );

    context.stroke();
    context.closePath();

}


function init(canvasID){
canvas = document.getElementById(canvasID);
//context = canvas.getContext('2d');
context = canvas.getContext('2d');
width = canvas.width;
height = canvas.height;
//canvas.addEventListener('click',clickHanler);
drawBoard();
 canvas.addEventListener('click', clickHandler)
//drawX(1,1);
//alert('width: '+ width + '\n'+ "hight: " + hight);
//console.log('width: '+ width + '\n'+ "hight: " + hight);
}
function isEmpty(xBoard, oBoard, bit) {
    return (((xBoard & bit) == 0) && ((oBoard & bit) == 0));
}
function drawX(x, y) {
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.lineWidth = 4;

    var ox = (width / 3);
    var bx = ox + x * (width / 3);
    var ex = -ox + (x + 1) * (width / 3);

    var oy = (height / 3);
    var by = oy + y * (height / 3);
    var ey = -oy + (y + 1) * (height / 3);



    context.moveTo(bx, by);
    context.lineTo(ex, ey);

    context.moveTo(bx, ey);
    context.lineTo(ex, by);


    context.stroke();
    context.closePath();

}

function clickHandler(event){
    var x = Math.floor((event.clientX-canvas.offsetLeft)/(width/3));
    var y = Math.floor((event.clientY - canvas.offsetTop) / (height / 3));

    var bit = (1 << x + (y * 3));

    console.log('ch:x=' + x + " ,y=" + y + " ,b=" + bit);
    if (isEmpty(xBoard, oBoard, bit)) {
        markBit(bit, 'X');
        if (!checkTie()) {
            if (checkWinner(xBoard)) {
                alert('You Win!');
                score.win++;
                restart();
            } else {
                play();
                if (!checkTie()) {
                    if (checkWinner(oBoard)) {
                        alert('You Lost!');
                        score.lost++;
                        restart();
                    }
                } else {
                    score.tie++;
                }

            }
        } else {
            score.tie++;
        }



    } else {
        alert('cell occupied');
    }

}
function checkWinner(board) {
    var winState = false;
    if(
        ((board | 0x1C0) === board)
        || ((board | 0x38) === board)
        || ((board | 0x7) === board)
        || ((board | 0x124) === board)
        || ((board | 0x92) === board)
        || ((board | 0x49) === board)
        || ((board | 0x111) === board)
        || ((board | 0x54) === board)
        )
    {
        winState=true;
    }
    return winState;
}

function markBit(markBit, player) {
    var bit = 1;
    var x = 0;
    var y = 0;

    while ((markBit & bit) == 0) {
        bit = bit << 1;
        x++;
        if (x > 2) {
            x = 0;
            y++;
        }
    }
    if (player === 'O') {
        oBoard = oBoard | bit;
        drawO(x, y);
    } else {
        xBoard = xBoard | bit;
        drawX(x, y);
    }
}
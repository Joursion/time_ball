/**
 * Created by m on 16-3-25.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var R = 8;
var MARGIN_LEFT = 10;
var MARGIN_TOP = 20;

const endTime = new Date();
var curShowTimeSeconds = 0;
var balls = [];
var colors = ["#2F974A","#33b5E5","#0099CC","#9933CC00",
    "#669900","#FF4444","CC00FF","#AA66CC"];

window.onload = function () {
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext("2d");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getShowTimeSeconds();
    setInterval(
        function () {
            render(context);
            update();
        },
        50
    );
};


//如果下一秒的时间和当前时间不一样，修改curShowTimeSeconds,注意curShowTimeSeconds 为全局变量
function update() {

    var nextShowTimeSeconds = getShowTimeSeconds();
    var nexthours = parseInt(nextShowTimeSeconds / 3600);
    var nextminutes = parseInt((nextShowTimeSeconds - nexthours*3600)/60);
    var nextseconds = parseInt(nextShowTimeSeconds % 60);

    var curhours = parseInt(curShowTimeSeconds / 3600);
    var curminutes = parseInt((curShowTimeSeconds - curhours*3600)/60);
    var curseconds = parseInt(curShowTimeSeconds % 60);

    if (nextseconds !== curseconds) {
        if(parseInt(curhours/10) != parseInt(nexthours/10)){
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curhours/10));
        }
        if(parseInt(curhours%10) != parseInt(nexthours%10)){
            addBalls(MARGIN_LEFT + 15*(R + 1), MARGIN_TOP, parseInt(curhours%10));
        }
        if(parseInt(curminutes/10) != parseInt(nextminutes/10)){
            addBalls(MARGIN_LEFT + 39*(R + 1), MARGIN_TOP, parseInt(curminutes/10));
        }
        if(parseInt(curhours%10) != parseInt(nexthours%10)){
            addBalls(MARGIN_LEFT + 54*(R + 1), MARGIN_TOP, parseInt(curminutes%10));
        }
        if(parseInt(curseconds/10) != parseInt(nextseconds/10)){
            addBalls(MARGIN_LEFT + 78*(R + 1), MARGIN_TOP, parseInt(curseconds/10));
        }
        if(parseInt(curseconds%10) != parseInt(nextseconds%10)){
            addBalls(MARGIN_LEFT + 93*(R + 1), MARGIN_TOP, parseInt(curseconds%10));
            console.log(curseconds);
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

function updateBalls() {
    for( var i = 0; i < balls.length; i ++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= WINDOW_HEIGHT - R) {
            balls[i].y = WINDOW_HEIGHT - R;
            balls[i].vy =  -balls[i].vy *0.75;
        }
    }

    //优化小球数量
    var cnt = 0;
    for (var i = 0; i < balls.length ; i ++ ) {
        console.log(balls.length);
        if (balls[i].x + R > 0 && balls[i].x - R < WINDOW_WIDTH) {
            balls[cnt ++] = balls[i];
        }
    }
    while (balls.length > Math.min(cnt, 300)) {
        balls.pop();
    }
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i ++) {
        for (var j = 0; j < digit[num][i].length; j ++) {
            if (digit[num][i][j] == 1) {
                var ball = {
                    x : x  + j * 2 * (R + 1) + (R + 1),
                    y : y  + i * 2 * (R + 1) + (R + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                    vy: -5 + (Math.random()),
                    color: colors[Math.ceil(Math.random()*colors.length)]
                };
                balls.push(ball);
            }
        }
    }
}

function getShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() + 1000*24*60*60 - curTime.getTime();
    ret = Math.round(ret / 1000); //get seconds
    return ret >= 0 ? ret : 0 ;
}

function render(cxt) {

    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
    var seconds = parseInt(curShowTimeSeconds % 60);

    //console.log(hours);
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10), cxt);
    renderDigit(MARGIN_LEFT + 15*(R + 1),MARGIN_TOP,parseInt(hours%10), cxt);
    renderDigit(MARGIN_LEFT + 30*(R + 1),MARGIN_TOP,10, cxt);
    renderDigit(MARGIN_LEFT + 39*(R + 1),MARGIN_TOP,parseInt(minutes/10), cxt);
    renderDigit(MARGIN_LEFT + 54*(R + 1),MARGIN_TOP,parseInt(minutes%10), cxt);
    renderDigit(MARGIN_LEFT + 69*(R + 1),MARGIN_TOP,10, cxt);
    renderDigit(MARGIN_LEFT + 78*(R + 1),MARGIN_TOP,parseInt(seconds/10), cxt);
    renderDigit(MARGIN_LEFT + 93*(R + 1),MARGIN_TOP,parseInt(seconds%10), cxt);

    renderBalls(cxt);
}

// centerX : x + j*2*(r+1) + (r+1)
// centerY: y + i*2*(r+1) + (r+1)
function renderDigit(x, y, num, cxt)  {
    cxt.fillStyle = "rgb(121,102,232)";
    for (var i = 0; i < digit[num].length; i ++) {
        for (var j = 0; j < digit[num][i].length; j ++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j *2*(R + 1) + (R + 1), y + i *2*(R + 1) + (R + 1), R, 0, 2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}

function renderBalls(cxt) {
    for (var i = 0; i < balls.length; i ++) {
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, R,0, 2*Math.PI, true);
        cxt.closePath();
        cxt.fill();
    }
}
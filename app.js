/*
 * Using your own pictures:
 * Create images around 50x70 px and put them in the subdir photos, numbered 0.png,1.png, ..., n.png
 * and set 
 */
// when using these values remove them from the html file
// const image_count=1;
// const imagedir = 'images/';
const width=51;
const height=78;
const imageExtension = '.png';

const nrs = [ 
    [[1,0], [2,0], [0,1], [3,1], [0,2], [3,2], [0,3], [3,3], [0,4], [3,4], [1,5], [2,5]],               //0
    [[1,0], [0,1], [1,1], [1,2], [1,3], [1,4], [0,5], [1,5], [2,5]],                                    //1
    [[1,0], [2,0], [0,1], [3,1], [2,2], [1,3], [0,4], [0,5], [1,5], [2,5], [3,5]],                      //2
    [[0,0], [1,0], [2,0], [3,0], [3,1], [2,2], [3,3], [0,4], [3,4], [1,5], [2,5]],                      //3
    [[0,0], [0,1], [0,2], [2,2], [0,3], [1,3], [2,3], [3,3], [2,4], [2,5]],                             //4
    [[0,0], [1,0], [2,0], [3,0], [0,1], [0,2], [1,2], [2,2], [3,3], [0,4], [3,4], [1,5], [2,5]],        //5
    [[1,0], [2,0], [0,1], [0,2], [1,2], [2,2], [0,3], [3,3], [0,4], [3,4], [1,5], [2,5]],               //6
    [[0,0], [1,0], [2,0], [3,0], [3,1], [2,2], [2,3], [1,4], [1,5]],                                    //7
    [[1,0], [2,0], [0,1], [3,1], [1,2], [2,2], [0,3], [3,3], [0,4], [3,4], [1,5], [2,5]],               //8
    [[1,0], [2,0], [0,1], [3,1], [0,2], [3,2], [1,3], [2,3], [3,3], [3,4], [1,5], [2,5]]                //9
];

const colon = [[ 0,1] , [ 0,3]];                                                                        //:
const colonOffset1 = [500,0];
const colonOffset2 = [1100,0];
const screenOffsetX = 100;
const screenOffsetY = 200;
//position of the digits
const offset = [
    [0,0] , [250,0] , [600,0] , [850,0], [1200,0] , [1450,0]
]

const STYLE_NONE=0;
const STYLE_FADE=1;
const STYLE_TRAVEL=2;

class AnimationStyle {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
    }
}

const animations = [
    new AnimationStyle(STYLE_TRAVEL,8000),
    new AnimationStyle(STYLE_TRAVEL,8000),
    new AnimationStyle(STYLE_TRAVEL,4000),
    new AnimationStyle(STYLE_TRAVEL,4000),
    new AnimationStyle(STYLE_TRAVEL,2000),
    new AnimationStyle(STYLE_FADE,500)
];

const canvas = document.getElementById('root')
const ctx = canvas.getContext('2d')

var images = [];
var clockImages = [];
var currentImage;
var animate=[0,0,0,0,0,0];
var previous=[0,0,0,0,0,0];

function init() {
    var date = new Date();
    for(var i=0;i<=6;i++) {
        previous[i]= getClockInteger(i,date);
    }

    loadImages();
    initClockImages();
}

window.onload = function() {
    init();
    loop();
};


function loadImages() {
    for(var i=0;i<image_count; i++) {
        var face  = new Image();
        face.src = imagedir + i + imageExtension;
        images[i] = face;
    }
    face = images[0];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function initClockImages() {
    for(var nr=0;nr<6;nr++) {
        var faces= [];
        for(var f=0;f<=13;f++) {
            faces[f] = getRandomInt(image_count);
        }
        clockImages[nr] = faces;
    }
}

function drawTime() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawColon();
    var date = new Date();
    for(var i=0;i<6;i++ ) {
        drawPostion(i,date);
    }
}

function drawPostion(pos, date) {
    var clockNr = getClockInteger(pos,date);
    var animation = animations[pos];

    var prevClockNr = previous[pos];

    if (prevClockNr != clockNr && animate[pos]==0) {
        animate[pos]=date.getTime() + animation.duration;
    }

    if(prevClockNr != clockNr) {
        var diff = animate[pos] - date.getTime();
        if (diff > 0) {
            var perc = 1 - (diff / animation.duration);
            animateNr(pos, prevClockNr, clockNr, perc, animation);
        } else {
            previous[pos]=clockNr;
            animate[pos]=0;
            drawNr(pos, clockNr);
        }
    } else {
        drawNr(pos, clockNr);
    }
}

function getClockInteger(pos,date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    var clockNr;
    switch(pos) {
        case 0:
            clockNr = Math.floor(h / 10);
            break;
        case 1:
            clockNr = h % 10;
            break;
        case 2:
            clockNr = Math.floor(m / 10);
            break;
        case 3:
            clockNr = m % 10;
            break;
        case 4:
            clockNr = Math.floor(s / 10);
            break;
        case 5:
            clockNr = s % 10;
            break;
    }
    return clockNr;
}

function loop(){ 
    drawTime();
    window.requestAnimationFrame(loop)   
}   

function drawNr(pos, clockDigit) {
    var image_offset = offset[pos];
    nr = nrs[clockDigit];
    for(var i=0;i<nr.length;i++) {
        currentImage = images[clockImages[pos][i]];
        drawImageAt(image_offset, nr[i]);
    }
}

function animateNr(pos, fromDigit, toDigit, perc, animation) {
    var image_offset = offset[pos];
    from = nrs[fromDigit];
    to = nrs[toDigit];
    var maxnr = Math.max(from.length,to.length);
   
    for(var i=0;i<maxnr;i++) {
        currentImage = images[clockImages[pos][i]];
        var point_from = null;
        var point_to = null;
        if(i<from.length) {
            point_from = from[i];
        }
        if(i<to.length) {
            point_to = to[i];
        }
        if (animation.name == STYLE_FADE) {
            fadeImageAt(image_offset, point_from,point_to, perc);
        } else if (animation.name == STYLE_TRAVEL) {
            travelImageAt(image_offset, point_from,point_to, perc);
        } else if (animation.name == STYLE_NONE) {
            drawImageAt(image_offset, point_to);
        } else {
            console.error("Unknown animation name '%s' ", animation.name);
        }
    }
}

function drawColon() {
    var current_millis = new Date().getMilliseconds();
    if (current_millis > 500) {
        currentImage = images[clockImages[0][12]];
        colon.forEach( element => drawImageAt(colonOffset1, element) );
        currentImage = images[clockImages[1][12]];
        colon.forEach( element => drawImageAt(colonOffset2, element) );
    }
}

function drawImageAt(offset, point) {
    if (point != null) { 
        x = point[0] * width + offset[0] + screenOffsetX;
        y = point[1] * height + offset[1] + screenOffsetY;
        ctx.drawImage(currentImage, x, y);
    }
}

function fadeImageAt(offset, point_from, point_to, perc) {
    if (point_from !=null ) {
        ctx.globalAlpha = 1-perc;
        x = point_from[0] * width + offset[0] + screenOffsetX;
        y = point_from[1] * height + offset[1] + screenOffsetY;
        ctx.drawImage(currentImage, x, y);
    }
    
    if (point_to !=null ) {
        ctx.globalAlpha = perc;
        x = point_to[0] * width + offset[0] + screenOffsetX;
        y = point_to[1] * height + offset[1] + screenOffsetY;
        ctx.drawImage(currentImage, x, y);
    }
    ctx.globalAlpha = 1;
}

function travelImageAt(offset, point_from, point_to, perc) {
    if (point_from == null ) {
        ctx.globalAlpha = perc;
        fx = point_to[0] * width + offset[0] + screenOffsetX;
        fy = point_to[1] * height + offset[1] + screenOffsetY;
    } else {
        fx = point_from[0] * width + offset[0] + screenOffsetX;
        fy = point_from[1] * height + offset[1] + screenOffsetY;
    }
    
    if (point_to == null) {
        ctx.globalAlpha = 1-perc;
        tx = fx;
        ty = fy;
    } else {
        tx = point_to[0] * width + offset[0] + screenOffsetX;
        ty = point_to[1] * height + offset[1] + screenOffsetY;
    }

    x = fx + (tx-fx) * perc; 
    y = fy + (ty-fy) * perc; 
    ctx.drawImage(currentImage, x, y);
    ctx.globalAlpha = 1;
}
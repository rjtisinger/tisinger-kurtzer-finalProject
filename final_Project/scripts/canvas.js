// canvas is the html canvas element
var canvas = document.querySelector('canvas');
const RAD = 30;
var width = canvas.width = window.innerWidth - RAD;
var height = canvas.height = window.innerHeight;

// c is short for context; 2d means 2 dimensions
var c = canvas.getContext('2d');

// Rectangles/Paddles:
// rectangles take whatever color the last fill style was
c.fillStyle = "white";
// x,y coordinates are determined from the top left of the canvas
c.fillRect(00,height/2, 15, 200);
c.fillRect(width-15, height/2, 15, 200);

function Paddle(x, y = height / 2, dy, width = 15, height = 200) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    // do not need a dx since paddles only go up and down
    this.width = width;
    this.height = height;

    this.draw = function() {

        c.fillRect(x, y, width, height);

    }

}

var leftPaddle = new Paddle(00, height/2, 1);
var rightPaddle = new Paddle(width-15, height/2, 1);



// ball: capital functions are objects
function Ball(x = (width-RAD)/2, y = height / 2, dx = 1, dy = 1, radius = RAD) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.strokeStyle = "white";
        c.arc( this.x, this.y,this.radius,0, Math.PI*2, false);
        c.stroke();
    }
    this.update = function() {
        // if we hit an edge, or a paddle!
        if (this.x + this.radius > width || this.x - this.radius < 0
            || isPaddleThere()  ) {
            this.dx*=-1;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
            this.dy*=-1;
        }
    
        this.x += this.dx;
        this.y += this.dy;

        this.draw();

    }
}

var ball = new Ball();

// returns true if the ball is currently inside of a paddle
function isPaddleThere(x, y) {

    //left paddle
    if (ball.x - ball.radius <= (leftPaddle.x + leftPaddle.width) &&
        ball.y - ball.radius <= leftPaddle.y + leftPaddle.height && 
        ball.y + ball.radius> leftPaddle.y ) {
            return true;
    }
    // right paddle
    else if (ball.x + ball.radius >= (rightPaddle.x) && 
            ball.y - ball.radius <= rightPaddle.y + rightPaddle.height && 
            ball.y + ball.radius> rightPaddle.y ) {
        return true;
    }
    else return false;
}

var radius = 30, ballX = (width-radius)/2, ballY = height/2, ballDX = 1, ballDY = 1;
function animate() {

    requestAnimationFrame(animate);

    c.clearRect(0,0,width, height);

    ball.update();
    leftPaddle.draw();
    rightPaddle.draw();
}
animate();
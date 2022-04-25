// canvas is the html canvas element
var canvas = document.querySelector('canvas');
const RAD = 30;
var width = canvas.width = window.innerWidth - RAD;
var heightG = canvas.height = window.innerHeight;
var ballColor = "white";

// c is short for context; 2d means 2 dimensions
var c = canvas.getContext('2d');

// Rectangles/Paddles:
// rectangles take whatever color the last fill style was
c.fillStyle = "white";


function Paddle(x, y = heightG / 2, dy, width = 15, height = 200) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    // do not need a dx since paddles only go up and down
    this.width = width;
    this.height = height;


    this.draw = function() {

        c.fillRect(this.x, this.y, this.width, this.height);
        

    }
    this.update = function() {

        if (this.y < 0) {
            this.y = 0;
        } else if(this.y +this.height > heightG) {
            this.y = heightG - this.height;
        }
        this.draw();


    }

}

var leftPaddle = new Paddle(00, heightG/2, .07);
var rightPaddle = new Paddle(width-15, heightG/2, .07);

// there should be 2 scores: 1 for each person
function Score(xIn, yIn) {
    this.score = 0; // score starts @ zero
    this.x = xIn;
    this.y = yIn;

    this.draw = function() {
        c.font = "80px Verdana";
        c.fillText(this.score, this.x, this.y);
    }

}
let quarterWidth = width / 4;
var leftScore = new Score(quarterWidth, 100);
var rightScore = new Score(width - quarterWidth, 100);

// ball: capital functions are objects
function Ball(x = (width-RAD)/2, y = heightG / 2, dx = 1, dy = 1, radius = RAD) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.strokeStyle = "white";
        c.fillStyle = ballColor;
        c.arc( this.x, this.y,this.radius,0, Math.PI*2, false);
        c.fill();
        c.stroke();
    }
    this.update = function() {
        // if we hit an edge then someone has scored
        if (this.x + this.radius > width || this.x - this.radius < 0
            && !isPaddleThere()  ) {
            

            // if we hit the left side then the right player scores
            if (this.x - this.radius < 0) {
                rightScore.score = rightScore.score + 1;
            }
            // if we hit the right side then the left player scores
            if (this.x + this.radius > width) {
                leftScore.score = leftScore.score + 1;
            }
            this.x=x;
            this.y = y;
        }
        // if we hit the top or bottom
        if (this.y + this.radius > heightG || this.y - this.radius < 0) {
            this.dy*=-1;
        }
        if (isPaddleThere()) {
            this.dx*=-1;

            if (this.x < 20) {
                x++;
            }
            else x--;

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

function updatePaddle(event) {
    if ('o' === event.key) {
        rightPaddle.y = rightPaddle.y - rightPaddle.dy;
    } 
    
    if(event.key === 'w') {
       leftPaddle.y = leftPaddle.y - leftPaddle.dy;
    } 
    
    if('l' === event.key) {
        rightPaddle.y+=rightPaddle.dy;
    } 
    
    if('s' === event.key) {
        leftPaddle.y+=leftPaddle.dy;
    }
};

function animate() {

    requestAnimationFrame(animate);

    c.clearRect(0,0,width, heightG);

    ball.update();

    document.addEventListener('keypress', (e) => this.updatePaddle(e));

    leftPaddle.update();
    rightPaddle.update();
    rightScore.draw();
    leftScore.draw();

}
animate();
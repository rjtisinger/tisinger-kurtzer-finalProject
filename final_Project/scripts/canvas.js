// canvas is the html canvas element
var canvas = document.querySelector('canvas');
const RAD = 30; // constant ball radius
var width = canvas.width = window.innerWidth - (RAD / 2 );
var heightG = canvas.height = window.innerHeight * .9; // *.9 leaves some space for us asking to play again
var ballColor = "white", winLimit = 10, ballSpeed = 2; // sets the default ball color & winLimit & ballSpeed
var leftDown = false, leftUp= false, rightDown = false, rightUp = false; 
var startTime; // this is our timer

// this function gets all the data from options.html and makes sure game.html can see it
function updateOptions() {

    sessionStorage.setItem("updatedOptions", true);

    // color
    if (document.getElementById("red").checked) {
        sessionStorage.setItem("bColor", "red");
    }
    else if (document.getElementById("pink").checked) {
        sessionStorage.setItem("bColor", "pink");
    }
    else if (document.getElementById("blue").checked) {
        sessionStorage.setItem("bColor", "blue");
    }
    else sessionStorage.setItem("bColor", "white");;

    // winLimit
    sessionStorage.setItem("maxScore", document.getElementById("endScore").value);
    
    // difficulty (ball speed)
    if (document.getElementById("easy").checked) {
        sessionStorage.setItem("bSpeed", 2.1);
    }
    else if (document.getElementById("hard").checked) {
        sessionStorage.setItem("bSpeed", 5);
    }

    console.log("Ball color: " + ballColor);
    console.log("Ball Speed:" + ballSpeed);
    console.log("Win limit: " + winLimit);

}


// c is short for context; 2d means 2 dimensions
var c = canvas.getContext('2d');

// creates a paddle object that stores position and velocity (position: x & y; velocity: dy)
function Paddle(x, y = heightG / 2, dy, width = 15, height = 200) {
    this.x = x;
    this.y = y;
    this.dy = dy;
    // do not need a dx since paddles only go up and down
    this.width = width;
    this.height = height;

    // draws a white rectangle for our paddle
    this.draw = function() {

        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.fillRect(this.x, this.y, this.width, this.height);
        

    }
    // does what this.draw() does, but also checks to ensure that paddles remain in bounds
    this.update = function() {

        if (this.y < 0) {
            this.y = 0;
        } else if(this.y + this.height > heightG) {
            this.y = heightG - this.height;
        }
        this.draw();


    }

}

// these are the paddles we will use
var leftPaddle = new Paddle(00, heightG/2, 2.5);
var rightPaddle = new Paddle(width-15, heightG/2, 2.5);

// there should be 2 scores: 1 for each person; score just contains where it is displayed and a value of points scored
function Score(xIn, yIn) {
    this.score = 0; // score starts @ zero
    this.x = xIn;
    this.y = yIn;

    // draws the score on the screen
    this.draw = function() {
        c.font = "5em Verdana";
        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.fillText(this.score, this.x, this.y);
    }

}

// sets up the scores. One is 1/4 accross the screen, the other is 3/4 accross the screen; they have the same height
let quarterWidth = width / 4;
var leftScore = new Score(quarterWidth, 100);
var rightScore = new Score(width - quarterWidth, 100);

// ball: capital functions are objects; creates a ball object that stores position (of center), radius and velocity
function Ball(x = (width-RAD)/2, y = heightG / 2, dx = 1, dy = 1, radius = RAD) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    // stops the ball from moving: only used when game ends
    this.freeze = function() {
        this.dy = 0;
        this.dx = 0;
    }
    // draws the ball as a circle of whatever color
    this.draw = function() {
        c.beginPath();
        c.strokeStyle = ballColor;
        c.fillStyle = ballColor;
        c.arc( this.x, this.y,this.radius,0, Math.PI*2, false);
        c.fill();
        c.stroke();
    }
    // does this.draw(), but also move the ball. If the ball hits an edge than someone scores, but if it hits a paddle it must change directions
    this.update = function() {
        // if we hit an edge (and not a paddle) then someone has scored
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

            // resets ball to original position
            this.x = x;
            this.y = y;
        }
        // if we hit the top or bottom change y direction of movement
        if (this.y + this.radius > heightG || this.y - this.radius < 0) {
            this.dy*=-1;
        }
        if (isPaddleThere()) {
            this.dx*=-1;

            // sometimes the ball rolls along the paddle, this if/else lessens that significantly by automatically moving the ball when it hits a paddle
            if (this.x < 20) {
                x+=2;
            }
            else x-=2;

        }
        // move the ball by its velocity
        this.x += this.dx;
        this.y += this.dy;

        this.draw();

    }
}
// there is only one ball we will need for the game
var ball = new Ball((width-RAD)/2,heightG / 2, ballSpeed, ballSpeed);

// returns true if the ball is currently inside of a paddle
function isPaddleThere() {

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

// moves the paddle when a key is pressed
function updatePaddle(event) {
    console.log("Key down"); // lets us know the method is firing
    if (!rightUp && 'o' == event.key) { // !rightUp allows shortcurcuiting and reduces lag
       rightUp = true;
    } 
    
    if(!leftUp && event.key == 'w') {
       leftUp = true;
    } 
    
    if(!rightDown && 'l' == event.key) {
        rightDown = true;
    } 
    
    if(!leftDown && 's' == event.key) {
        leftDown = true;
    }
};
// stops the paddle from moving when a key is released
function keyUpEvent( event ) {

    console.log("Key up");
    if ('o' == event.key) {
        rightUp = false;
     } 
     
     if(event.key == 'w') {
        leftUp = false;
     } 
     
     if('l' == event.key) {
         rightDown = false;
     } 
     
     if('s' == event.key) {
         leftDown = false;
     }


}
// taken from https://www.demo2s.com/javascript/javascript-canvas-game-timer.html
// I deleted a few lines and edited some others; this draws our timer on the screen
function drawElapsedTime() {
    var elapsed = parseInt((new Date() - startTime) / 1000);
    c.save();
    c.beginPath();
    c.fillStyle = "white";
    c.font = "5em Verdana"
    c.fillText(elapsed + " s.", width / 2, 100, 100);
    c.restore();
}

// game loop
function animate() {

    // wipe the screen: we'll redraw everything at its new position
    c.clearRect(0,0,width, heightG);

    // redraws the ball & moves its direction if needed
    ball.update();

    // if a button is pressed: MOVE
    if (leftUp) {
        leftPaddle.y -= leftPaddle.dy;
    }
    if (leftDown) {
        leftPaddle.y += leftPaddle.dy;
    }
    if (rightUp) {
        rightPaddle.y -= rightPaddle.dy;
    }
    if (rightDown) {
        rightPaddle.y += rightPaddle.dy;
    }

    // win conditions:
    // if right player won
    if (rightScore.score >= winLimit) {
        c.font = "6.25em Verdana";
        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.fillText("Right Player Wins!", width / 2 - 500, heightG / 2, width / 2);
        ball.freeze();

        document.getElementById("output").innerHTML = "Click here to play again!";

        setTimeout( () => window.location.replace("index.html"), 10000)

    }
    // if left player won
    else if (leftScore.score >= winLimit) {
        c.font = "6.25em Verdana";
        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText("Left Player Wins!", width / 2, heightG / 2), width / 2;
        ball.freeze();

        document.getElementById("output").innerHTML = "Click here to play again!";

        setTimeout( () => window.location.replace("index.html"), 10000)

    }
    // redraw our paddles & scores & timers
    leftPaddle.update();
    rightPaddle.update();
    rightScore.draw();
    leftScore.draw();
    drawElapsedTime();

    // re-call the game loop
    requestAnimationFrame(animate);
}
// gets all our data ready when a new game starts
function initialize() {

    if (sessionStorage.getItem("updatedOptions")) {

        // ball color
        ballColor = sessionStorage.getItem("bColor");

        // win limit
        let temp = sessionStorage.getItem("maxScore");
        if ( !(temp < 1) ) {
            winLimit = temp;
        }

        // difficulty
        ballSpeed = parseInt(sessionStorage.getItem("bSpeed"));

    }

    console.log("Ball color: " + ballColor);
    console.log("Ball Speed:" + ballSpeed);
    console.log("Win limit: " + winLimit);
    // resets all our variables
    ball.dy = ballSpeed;
    ball.dx = ballSpeed;
    leftUp = false;
    leftDown = false;
    rightUp = false;
    rightDown = false;
    document.getElementById("output").innerHTML = "You are playing Pong. Click here at anytime to reset the game.";

    // allows us to see when keys are pressed and released
    document.addEventListener('keydown', (e) => this.updatePaddle(e));
    document.addEventListener('keyup', (e) => this.keyUpEvent(e));

    startTime = new Date();

    // call the game loop
    animate();
}

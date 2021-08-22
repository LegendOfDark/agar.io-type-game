var canvas = document.querySelector('canvas');

// set canvas area to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// resize canvas to fullscreen
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// provide context
var c = canvas.getContext('2d');

// random color formula
const randomColor = () => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const random = Math.random();
    const bit = (random * 16) | 0;
    color += (bit).toString(16);
  };
  return color;
};

// capture key being pressed
let keysPressed = {};


// records the keys pressed
document.addEventListener('keydown', (e) => 
{
    keysPressed[e.key] = true;
    character.char_update();
});
document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
 });

 
// calculate the distance between two objects
let dstnc = (x1, y1, x2, y2) =>{
    dstnc_x = x2 - x1;
    dstnc_y = y2 - y1;
    return Math.hypot(dstnc_x, dstnc_y);
}

// score count and game_end banner
let score = 0;
let game_flag = false;
let drawScore = () => {
    c.font = "25px Arial";
    c.fillStyle = "#0095DD";
    c.textAlign = "left";
    c.fillText("Score: "+ score, canvas.width - 150, 50);
}
let game_end = () => {
    c.font = "100px Arial";
    c.fillStyle = "#000000";
    c.textAlign = "center";
    c.fillText("Game Ended", canvas.width/2, canvas.height/2);
}

// create a circle object
function Circle(x, y, rad, color) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
    this.flag = false;

  // drawing method
    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        c.fill();
        c.stroke();
    }

    // character interactivity
    this.char_update = () => {

        // based on the key pressed, move the circle in a certain direction

        let speed = 5; 

        if (keysPressed['ArrowRight'])
        {
            this.x += speed;
        }
        if (keysPressed['ArrowLeft'])
        {
            this.x += -speed;
        }
        if (keysPressed['ArrowUp'])
        {
            this.y += -speed;
        }
        if (keysPressed['ArrowDown'])
        {
            this.y += speed;
        }   

        // check if the ball touches the walls
        if (this.x + this.rad + 3 > canvas.width || this.x - this.rad - 3 < 0) {
            console.log('affirmative');
            this.dx = -this.dx;
        }
        if (this.y + this.rad + 3 > canvas.height || this.y - this.rad - 3 < 0) {
            console.log('affirmative');
            this.dy = -this.dy;
        }

        char_x = this.x;
        char_y = this.y;
    
        this.draw();

    }

    // food interactivity
    this.food_update = () => {
        // console.log(dstnc(this.x, this.y, char_x, char_y));
        if (dstnc(this.x, this.y, char_x, char_y) < this.rad + character.rad){
            this.flag = true;
            score++;
            character.rad += 0.2;

        }
        else{
            this.flag = false;
        }

    }
}

// create a spikes / stars object
function drawStar(cx, cy, spikes, outerRadius, innerRadius){
    this.rot = Math.PI / 2 * 3;
    this.cx = cx;
    this.cy = cy;
    this.x = this.cx;
    this.y = this.cy;
    this.spikes = spikes;
    this.step = Math.PI / spikes;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;    
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;

    this.draw = () => {
        c.strokeSyle = "#000";
        c.beginPath();
        c.moveTo(this.cx, this.cy - this.outerRadius)
        for (i = 0; i < this.spikes; i++) {
            this.x = this.cx + Math.cos(this.rot) * this.outerRadius;
            this.y = this.cy + Math.sin(this.rot) * this.outerRadius;
            c.lineTo(this.x, this.y)
            this.rot += this.step

            this.x = this.cx + Math.cos(this.rot) * this.innerRadius;
            this.y = this.cy + Math.sin(this.rot) * this.innerRadius;
            c.lineTo(this.x, this.y)
            this.rot += this.step
        }
        c.lineTo(this.cx, this.cy - this.outerRadius)
        c.closePath();
        c.lineWidth = 5;
        c.strokeStyle='blue';
        c.stroke();
        c.fillStyle='skyblue';
        c.fill();
    }
    

    this.update = () => {

        if (this.cx + this.outerRadius + 25 > canvas.width || this.cx - this.outerRadius - 25  < 0){
            this.dx = -this.dx;
            // console.log(this.dx);
        }
        if (this.cy + this.outerRadius + 20 > canvas.height || this.cy - this.outerRadius - 20 < 0){
            this.dy = -this.dy;
        }
        this.cx += this.dx;
        this.cy += this.dy;
        this.draw();
        // spike interactivity
        if (dstnc(this.x, this.y, char_x, char_y) < this.outerRadius + character.rad){
            game_flag = true;
        }
    }
}


// make the character
let char_x = 0;
let char_y = 0;
let char_radius = 30;
var character = new Circle( Math.random() * (canvas.width - char_radius * 2) + char_radius, Math.random() * (canvas.height - char_radius * 2) + char_radius, char_radius, randomColor())

// intialize extra variables used in functions
var foodArr = [];
let starArr = [];
let flag = null;

// function creates a certain # of food
var food_num;
function init() {

  foodArr = [];
  starArr = [];

  for (let j = 0; j < 5; j++){
    var outerRadius = 30;
    var x = Math.random() * (canvas.width - outerRadius * 2) + outerRadius;
    var y = Math.random() * (canvas.height - outerRadius * 2) + outerRadius;
    var spikes = 20;
    var innerRadius = 25;
    starArr.push(new drawStar(x, y, spikes, outerRadius, innerRadius));
  }

  // intialize random properties of the cirle
  food_num = 100;
  for (let i = 0; i < food_num; i++) {
    var rad = (Math.random() * 5.5) + 2.5;
    var x = Math.random() * (canvas.width - rad * 2) + rad;
    var y = Math.random() * (canvas.height - rad * 2) + rad;
    var color = randomColor();

    // save the food to the Array
    foodArr.push(new Circle(x, y, rad, color));
    }
}


// animate the canvas by constantly reloadng the page
let animate = () => {
    //sets animation
    requestAnimationFrame(animate);

    // clear the screen after each frame
    c.clearRect(0, 0, canvas.width, canvas.height);

    // creates spikes on screen
    for (let d = 0; d < starArr.length; d++){
        starArr[d].update();
    }
    
    // update scorebaord
    drawScore();
    
    // creates food on screen
    for (var i = 0; i < foodArr.length; i++) {
        foodArr[i].draw();
        foodArr[i].food_update();
        
        
        // checks if food is eaten
        flag = foodArr[i].flag;
        if (flag){
            foodArr = foodArr.filter(food => food.flag != true);
            flag = false;
        }
    }
 
    // When game ends...
    if (foodArr.length == 0 && score == food_num || game_flag)
    {
        c.clearRect(0, 0, canvas.width, canvas.height);
        game_end();
        setTimeout("location.reload(true);", 7000);
    } 
    else{
        character.char_update();
    }
}

// intial call of functions
animate();
init();
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

    this.char_update = () => {

        // based on the key pressed, move the circle in a certain direction

        let speed = 7; 

        if (keysPressed['ArrowRight'])
        {
            this.dx = speed;
            this.dy = 0;
        }
        if (keysPressed['ArrowLeft'])
        {
            this.dx = -speed;
            this.dy = 0;
        }
        if (keysPressed['ArrowUp'])
        {
            this.dy = -speed;
            this.dx = 0;
        }
        if (keysPressed['ArrowDown'])
        {
            this.dy = speed;
            this.dx = 0;
        }   

        // check if the ball touches the walls
        if (this.x + this.rad + 3 > canvas.width || this.x - this.rad - 3 < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.rad + 3 > canvas.height || this.y - this.rad - 3 < 0) {
            this.dy = -this.dy;
        }


        this.x += this.dx;
        this.y += this.dy;

        char_x = this.x;
        char_y = this.y;
    
        this.draw();

    }

    this.food_update = () => {
        // console.log(dstnc(this.x, this.y, char_x, char_y));
        if (dstnc(this.x, this.y, char_x, char_y) < this.rad + char_radius){
            this.flag = true;
        }
        else{
            this.flag = false;
        }

    }
}


// make the chracter
let char_x = 0;
let char_y = 0;
let char_radius = 30;

var character = new Circle( Math.random() * (canvas.width - char_radius * 2) + char_radius, 
                            Math.random() * (canvas.height - char_radius * 2) + char_radius,
                            char_radius, randomColor())

var foodArr = [];

// function creates a certain # of food
function init() {

  foodArr = [];

  // intialize random properties of the cirle
  for (let i = 0; i < 500; i++) {
    var rad = (Math.random() * 5) + 1;
    var x = Math.random() * (canvas.width - rad * 2) + rad;
    var y = Math.random() * (canvas.height - rad * 2) + rad;
    var dx = (Math.random() - 0.5) * 5;
    var dy = (Math.random() - 0.5) * 5;
    var color = randomColor();

    // save the food to the Array
    foodArr.push(new Circle(x, y, rad, color));
    // console.log(i, 'and', foodArr[i]);
    }
}


let flag = null;

// animate the canvas by constantly reloadng the page
let animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < foodArr.length; i++) {
    foodArr[i].draw();
    foodArr[i].food_update();
    flag = foodArr[i].flag;
    console.log(flag);
    if (flag){
        foodArr = foodArr.filter(food => food.flag != true);
        flag = false;
    }
  } 
  character.char_update();
}

animate();
init();
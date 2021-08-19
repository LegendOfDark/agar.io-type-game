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

// create a circle object
function Circle(x, y, rad, color) {

  this.x = x;
  this.y = y;
  this.rad = rad;
  this.color = color;

  // drawing method
  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.strokeStyle = this.color;
    c.fill();
    c.stroke();
  }

//   this.update = () => {
    // this.draw();
//   }
}

// make the chracter
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
  }
}

// animate the canvas by constantly reloadng the page
let animate = () => {
  requestAnimationFrame(animate);
  console.log("hi");
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < foodArr.length; i++) {
    foodArr[i].draw();
    character.draw();
  } 
}
animate();
init();
/*** 
Birds: Beginner 

This exercise is about drawing a single bird in many poses. 
It encourages you to look closely at how a bird moves, and represent that simply - paying close attention.

The exercise is as follows so far
1. Find a bird in a park that is moving quite a bit.
2. For 30 seconds at a time, try to sketch the bird in as many poses as possible. Do this as many times as you like. If its helpful, take 30 second recordings of the bird, and sketch the interesting frames. 
3. Returning back to your computer, choose one of the sequences and draw the first pose with a few simple shapes. 
4. Now, copy and paste that, and try to get the second pose with minimal changes. 


**/

let regularFrames = [bird0];
let flappingFrames = [bird1, bird2, bird3, bird4, bird5, bird5];
let birds = [...regularFrames, ...flappingFrames];

let moveX = 0;

let isFlapping = false;
let flapStart = 0;
let legColor = "white";
let bodyColor = "white";
let headColor = bodyColor;
let wingColor = "rgb(150, 255, 20)";
let beakColor = "yellow";
let prn = new PreRand();

function setup() {
  createCanvas(birds.length * 200, 600);
  angleMode(DEGREES);

  frameRate(6);
}

function draw() {
  prn.reset();
  background(225);
  stroke("black");

  // testDraw();
  // noLoop();
  
  animateFrames();
  push();
  translate(100, 500);
  for (let i = 0; i < birds.length; i++) {
    birds[i]();
    translate(150, 0);
  }
  pop();
  
}
function animateFrames() {
  if (isFlapping) {
    if (frameCount - flapStart >= 100) {
      isFlapping = false;
      frameRate(2);
    }
  } else {
    moveX += 1;
    isFlapping = Math.random() > 0.92;
    if (isFlapping) {
      frameRate(24);
      flapStart = frameCount;
    }
  }
  push();
  translate(width * 0.5 - moveX, 200);
  scale(2.0);
  if (isFlapping) {
    let n = frameCount % flappingFrames.length;
    flappingFrames[n]();
  } else {
    
    let n = frameCount % regularFrames.length;
    regularFrames[n]();
  }
  pop();
}

function body(move) {
  
  //legs
  push();
  // fill(legColor);
  rotate(move ? random(0, 5): 3)
  translate(0, 20);
  mTri(0, 0, 10, 0, 5, 25);
  
  rotate(move ? random(-10, -20) : -15);
  translate(10, 0);
  mTri(0, 0, 10, 0, 5, 25);
  pop();

  //body
  // fill(bodyColor);
  mEllipse(0, 0, 80, 50);

  //head
  push();
  // fill(headColor);
  translate(-35, -50);

  //neck
  push();
  translate(7, -8);
  mTri(0, 0, 0, 52, 20, 52);
  pop();

  //facetw
  mEllipse(0, 0, 25, 27);
  line(3, -5, 3, 0);
  line(-3, -5, -3, 0);

  //beak
  // fill(beakColor);
  push();
  rotate(move ? random(80, 120) : 90);
  translate(5, -5);
  mRect(0, 0, 20, 8, 10);
  line(0, 4, 20, 4);
  pop();
  pop();

}

function bird0() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-20, 20);
  rotate(random(200,210));
  mRect(0, 0, 30, 40);
  pop();
  
  body(true);

  
  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(random(-43, -47));
  mRect(0, 0, 30, 40);
  pop();
  
  pop();
}

function bird1() {
  push();

  rotate(15);

  push();
  // fill(wingColor);
  translate(-40, -10);
  mRect(0, 0, 20, 30);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(10);
  mRect(0, 0, 40, 30);
  translate(40, 0);
  mTri(0, 0, 0, 30, 30, 30);
  pop();

  pop();
}

function bird2() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-50, -20);
  rotate(10);
  mRect(0, 0, 30, 30);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 60, 35);
  translate(35, 35);
  mTri(0, 0, 25, 0, 0, 35);
  pop();

  pop();
}

function bird3() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-20, 10);
  rotate(200);
  mRect(0, 0, 60, 30);
  translate(60, 0);
  mTri(0, 0, 40, 0, 0, 30);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 50, 30);
  translate(50, 0);
  mTri(0, 0, 40, 0, 0, 30);
  pop();

  pop();
}

function bird4() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-20, 10);
  rotate(200);
  mRect(0, 0, 60, 25);
  translate(35, 0);
  rotate(-45);
  mTri(0, 0, 60, 0, 0, 35);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 60, 25);
  translate(60, 0);
  rotate(45);
  mTri(0, 0, 60, 0, 0, 35);
  pop();

  pop();
}

function bird5() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-10, 20);
  rotate(200);
  mRect(0, 0, 60, 45);
  translate(60, 0);
  mTri(0, 0, 45, 0, 0, 45);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(random(-40, -50));
  mRect(0, 0, 50, 40);
  translate(70, 0);
  rotate(random(85, 95));
  mTri(0, 0, 60, 0, 0, 60);

  pop();

  pop();
}

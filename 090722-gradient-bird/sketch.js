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
  colorMode(HSB);

  frameRate(6);
}

function draw() {
  prn.reset();
  background(200, 20, 60);
  stroke("black");

  testDraw();
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
    if (frameCount - flapStart >= 200) {
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

function gg(hs,he, s =100, b=100) {
  return {GRAD_COL: [[hs,s,b], [he, s,b], [0,1]]};
}
const WING_COLOR = gg(40,60, 20, 100);

function body(move) {
  
  //legs
  
  push();
  // fill(legColor);
  rotate(move ? random(0, 5): 3)
  translate(0, 20);
  mTri(0, 0, 10, 0, 5, 25, gg(40,60));
  
  rotate(move ? random(-10, -20) : -15);
  translate(10, 0);
  mTri(0, 0, 10, 0, 5, 25, gg(40,60));
  pop();

  //body
  // fill(bodyColor);
  mEllipse(0, 0, 80, 50, gg(40,60));

  //head
  push();
  // fill(headColor);
  translate(-35, -50);

  //neck
  push();
  translate(7, -8);
  mTri(0, 0, 0, 52, 20, 52, gg(40,60, 90, 70));
  pop();

  //facetw
  mEllipse(0, 0, 25, 27, gg(40,60,90,70));
  mL(3, -5, 3, 0, gg(40,50, 0, 0));
  mL(-3, -5, -3, 0, gg(40,50,0,0));

  //beak
  // fill(beakColor);
  push();
  rotate(move ? random(80, 120) : 90);
  translate(5, -5);
  mRect(0, 0, 20, 8, gg(50,50));
  mL(0, 4, 20, 4, gg(50,50));
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
  mRect(0, 0, 30, 40, WING_COLOR);
  pop();
  
  body(true);

  
  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(random(-43, -47));
  mRect(0, 0, 30, 40, WING_COLOR);
  pop();
  
  pop();
}

function bird1() {
  push();

  rotate(15);

  push();
  // fill(wingColor);
  translate(-40, -10);
  mRect(0, 0, 20, 30, WING_COLOR);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(10);
  mRect(0, 0, 40, 30, WING_COLOR);
  translate(40, 0);
  mTri(0, 0, 0, 30, 30, 30, WING_COLOR);
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
  mRect(0, 0, 30, 30, WING_COLOR);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 60, 35, WING_COLOR);
  translate(35, 35);
  mTri(0, 0, 25, 0, 0, 35, WING_COLOR);
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
  mRect(0, 0, 60, 30, WING_COLOR);
  translate(60, 0);
  mTri(0, 0, 40, 0, 0, 30, WING_COLOR);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 50, 30, WING_COLOR);
  translate(50, 0);
  mTri(0, 0, 40, 0, 0, 30, WING_COLOR);
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
  mRect(0, 0, 60, 25, WING_COLOR);
  translate(35, 0);
  rotate(-45);
  mTri(0, 0, 60, 0, 0, 35, WING_COLOR);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(-20);
  mRect(0, 0, 60, 25, WING_COLOR);
  translate(60, 0);
  rotate(45);
  mTri(0, 0, 60, 0, 0, 35, WING_COLOR);
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
  mRect(0, 0, 60, 45, WING_COLOR);
  translate(60, 0);
  mTri(0, 0, 45, 0, 0, 45, WING_COLOR);
  pop();

  body();

  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(random(-40, -50));
  mRect(0, 0, 50, 40, WING_COLOR);
  translate(70, 0);
  rotate(random(85, 95));
  mTri(0, 0, 60, 0, 0, 60, WING_COLOR);

  pop();

  pop();
}

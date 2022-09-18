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
let prn = new PreRand(10000);
let ww = prn.rn(300,400);
let wh = prn.rn(40,50)

let direction = 1;

let falseFrameCount = 0;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  colorMode(HSB, 360,100, 100,100);
  frameRate(24);
}

function draw() {
  prn.reset();
  clear()

  background(200, 20, 60);



  // testDraw();
  // noLoop();
  
  push();

  translate(width/2, height/2);
  animateFrames();
  pop();


  // makeNoise();
  
}
function animateFrames() {
  if (dist(mouseX, mouseY, width/2, height/2) < ww/2) {
    isFlapping = true;
  } else {
    isFlapping = false;
  }
  if (isFlapping) {
    falseFrameCount += 1;
    // if (falseFrameCount - flapStart >= 100) {
    //   isFlapping = false;
    //   // frameRate(2);
    // }
  } else {
    if (frameCount % 2 == 0) {
      falseFrameCount += 1
      moveX += direction;
      if (moveX > ww/2) {
        direction = -1;
      } if (moveX < -ww/2) {
        direction = +1;
      }
     
      if (isFlapping) {
        // frameRate(24);
        flapStart = falseFrameCount;
      }
    }

  }
  push();
  // scale(1.5);

  
  push();
  translate(0, 50);
  water();
  
  push();
  
  translate(-moveX, -50);
  scale(direction, 1);
  if (isFlapping) {
    let n = falseFrameCount % flappingFrames.length;
    flappingFrames[n]();
  } else {
    let n = falseFrameCount % regularFrames.length;
    regularFrames[n]();
  }
  pop();

  prn.reset()
  frontreeds();
  pop();

  pop();
}

function gg(hs,he, s =100, b= 90) {
  return {GRAD_COL: [[hs,s,b], [he, s,b], [0,1]]};
}
function fc(h, s= 100, b = 100) {
  return {FILL_COL: [h,s,b]};
}
const WING_COLOR = gg(40,60, 20, 90);

function body(move) {
  
  //legs
  

  let lp = { ...gg(40, 60),...fc(60) };
  // fill(legColor);
  
  push();
    rotate(move && (falseFrameCount % 2 == 0) ? -5 :0);
    translate(0, 20);
    mTri(0, 0, 7, 0, 5, 20, lp);
    mTri(5,20, -10, 24, 0, 29, lp);
  pop();
  
  push();
    rotate(move && (falseFrameCount % 2 == 1) ? -5 : 0);
    translate(10, 20);
    mTri(0, 0, 7, 0, 5, 20, lp);
    mTri(5,20, -10, 24, 0, 29, lp);
  pop();


  //head
  push();
  // fill(headColor);
  translate(-35, -50);

  //neck
  push();
  translate(7, -8);
  mTri(0, 0, 0, 52, 20, 52, {...gg(40,60, 90, 70), OVERDRAW: 0});
  pop();

  //facetw
  mEllipse(0, 0, 25, 27, gg(40,60,90,70), 20);
  mL(3, -5, 3, 0, gg(40,50, 0, 0));
  mL(-3, -5, -3, 0, gg(40,50,0,0));

  //beak
  // fill(beakColor);
  push();
  rotate(move ? prn.rn(80, 120) : 90);
  translate(5, -5);
  mRect(0, 0, 20, 8, {...gg(50,50), ...fc(50)});
  mL(0, 4, 20, 4, gg(50,50));
  pop();
  pop();

    //body
  // fill(bodyColor);
  mEllipse(0, 0, 80, 50, gg(40,60), 15);



}

function bird0() {
  push();

  rotate(15);

  //wing2
  push();
  // fill(wingColor);
  translate(-20, 20);
  rotate(prn.rn(200,210));
  mRect(0, 0, 30, 40, WING_COLOR);
  pop();
  
  body(true);

  
  //wing1
  push();
  // fill(wingColor);
  translate(0, -25);
  rotate(prn.rn(-43, -47));
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
  rotate(prn.rn(-40, -50));
  mRect(0, 0, 50, 40, WING_COLOR);
  translate(70, 0);
  rotate(prn.rn(85, 95));
  mTri(0, 0, 60, 0, 0, 60, WING_COLOR);

  pop();

  pop();
}


function makeNoise() {

  for (let i =0 ; i< rn(100,200); i++) {
    let ll = 2;
    let p = prn.rn();
    if (p > 0.5) {
      let p0 = [rn(0, width), rn(0, height)];
      let p1 = [p0[0] + rnd(-ll,ll), p0[1] + rnd(-ll,ll)];
      mL(p0[0], p0[1], p1[0], p1[1], {GRAD_COL: undefined, RAND_COL: [[100,100,30]]});
    }
  }
}

function water() {

  for (let i  =0 ; i< 5; i++) {
    push();
    mEllipse(0, 0, i == 0 ? ww : prn.rn(ww * 0.4, ww), i == 0 ? wh : prn.rn(wh * 0.75, wh), {
      ...gg(200, 220, 100, 100),
      RAND_ROT: [-1, 1],
      OVERDRAW: 2,
      FILL_COL: undefined,
    });
    pop();
  }




  //back reeds
  reeds(PI,TAU, 0.01);
}

function frontreeds() {
  reeds(0,PI, 0.8);
}
function reeds(s, e, p) {
  for (let t =s; t< e; t+= PI/32) {
    if (prn.rn() > ( p || 0.2)) {
      let x1 = (ww / 2) * cos(t);
      let y1 = (wh / 2) * sin(t);
      mL(x1,y1,x1, y1 - prn.rn(80,150), {
        GRAD_COL: [[130, 50, 30], [130, 100, 100] ],
        RAND_STROKE: [2,2],
        RAND_ROT: [-1,1],
        OVERDRAW: 0
      })
    }
  
  }
}

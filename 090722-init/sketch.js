let prn = new PreRand();

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);

  frameRate(6);
}

function draw() {
  prn.reset();
  background(225);
  stroke("black");
  strokeWeight(0.1);
  testDraw();
}

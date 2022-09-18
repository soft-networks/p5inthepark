

function setup(){
  createCanvas(500,500);
  colorMode(RGB, 255,255,255,100);
  strokeCap(SQUARE);
  angleMode(DEGREES);
}

let prn = new PreRand();
let ll = 20;
let sw = 2;
let lo = 0.2;
let ls = (n, o = 0.2, r) => (1- (r ? rnd(o*0.75, o*1.25) : o)) * n;

function draw() {

  background("white");

  testDraw();
  noLoop();
  return;
  // for (let r = 0; r < 5; r++) {
  //   stroke(255,125,50,80);  
  //   fillRect(rn(0,width), rn(0,height), rn(20,100) , rn(20,100));
  // }
  noLoop()
}

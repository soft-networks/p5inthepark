let prn = new PreRand();
let w = 500;
let h = 500;
let fC; //fill canvas
let mC; //mask canvas
let masked;
let DEBUG = false;

function setup() {
  if (DEBUG) {
    createCanvas(w * 2, h);
  } else {
    createCanvas(w, h);
  }
  
  fC = createGraphics(w,h);
  mC = createGraphics(w,h);
  
}

let mi; //mask instructions 
let bi; //border instructions

function draw() {

  //Clear 
  mi = [];
  bi = [];
  mC.fill("black");
  mC.rectMode(CENTER);
  rectMode(CENTER);
  noFill();
  stroke("black");
  strokeWeight(2);

  //Fill colors
  gradient(fC);

  //Actual drawing 
  //mEllipse(w/2, h/2, w/4, h/4);
  
  plant(3, cv(w/2,h));
  
  //Do the transitions
  if (DEBUG) {
    mi.forEach(m => m());
    bi.forEach(b => b());
    image(mC.get(), 0, 0, w, h);
    image(fC.get(), w,0 ,w,h);
  }  else {
    mi.forEach(m => m());
    masked = fC.get();
    masked.mask(mC);
    image(masked, 0,0, w,h);
    bi.forEach(b => b());
  }
}

function gradient(c, colstart = [0,0,0], colend = [255,255,255]) {
  let barheight = 5;
  for (let y =0; y<c.height; y+= barheight){
    let l = y / c.height;
    let col = lerpCol(colstart, colend,l);
    c.noStroke();
    c.fill(col);
    c.rect(0,y, c.width,  barheight);
  }
} 

function mTranslate(x,y) {
  mi.push(() => mC.translate(x,y));
  bi.push(() => translate(x,y));
}
function mEllipse(x,y,w,h, prefs) {
  mi.push(() => mC.ellipse(x,y,w,h));
  bi.push(() => ellipse(x,y,w,h));
}
function mRect(x,y,w,h, precs) {
  mi.push(() => mC.rect(x,y,w,h));
  bi.push(() => rect(x,y,w,h));
}

let thickness = 10;
let perheight = 50;
function plant(index, cP) {
  
  if (index == 0) {
    return;
  }

  
  mRect(cP.x, cP.y, thickness, -perheight);
  // mEllipse(cP.x, cP.y, 2,2);

  plant(index - 1, addv(cP, cv(0, - perheight)));
  
  
}
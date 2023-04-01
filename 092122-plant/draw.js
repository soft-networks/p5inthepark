
let DEBUG = false;
let maskCanvas, fillCanvas, strokeCanvas;
let canvasSize;
let prn = new PreRand();

/**

type point = {x: number, y: number}
type bounds = point[];

interface PrefType {
  lrStroke?: {l: bounds r: bounds }
}

**/


function setupCanvases(w = 600,h = 600) {
  canvasSize = cv(w,h);
  if (DEBUG) createCanvas(w * 3, h);
  else createCanvas(w, h);
  maskCanvas = createGraphics(w,h);
  fillCanvas = createGraphics(w,h);
  strokeCanvas = createGraphics(w,h);
  
  maskCanvas.noStroke();
  maskCanvas.fill("black");

  strokeCanvas.noFill();
  fillCanvas.colorMode(HSB);
}

function gradientBackground(colstart = [0,0,0], colend = [255,255,255]) {
  let barheight = 5;
  for (let y =0; y<fillCanvas.height; y+= barheight){
    let l = y / fillCanvas.height;
    let col = lerpCol(colstart, colend,l);
    fillCanvas.noStroke();
    fillCanvas.fill(col);
    fillCanvas.rect(0,y, fillCanvas.width,  barheight);
  }
} 
function noiseBackground() {
  let pixelSize  = 4;
  let off = cv(0,0);
  let offStep = 0.1;
  for (let i =0 ; i< w; i+=pixelSize) {
    off.y = 0;
    for (let j =0 ; j<h;j+=pixelSize){
      let p = noise(off.x,off.y);
      fillCanvas.noStroke();
      if (p < 0.5) {
        fillCanvas.fill("red");  
      } else {
        fillCanvas.fill("blue")
      }
      fillCanvas.rect(i ,j, pixelSize, pixelSize)
      off.y += offStep;
    }
    off.x += offStep;
  }
}
function mEllipse(x,y,w,h, prefs) {
  maskCanvas.ellipse(x,y,w,h);
  strokeCanvas.ellipse(x,y,w,h);
}
function mRect(x,y,w,h, prefs) {
  let bounds = [cv(x, y), cv(x + w, y), cv(x + w, y + h), cv(x, y + h)];
  mPoly(bounds, prefs, 2 * (w + h));
}

function mPoly(bounds, prefs, size) {
  size = size || boundaryLength(bounds);
  if (prefs.jiggle) {
    bounds = bounds.map( b => cv(b.x + jiggle(size), b.y + jiggle(size)));
  }
  if (prefs.fill !== "noFill") 
    polyMask(bounds, prefs);

  if (prefs.lrStroke) {
    polyStroke(prefs.lrStroke.l, prefs);
    polyStroke(prefs.lrStroke.r, prefs);
  } else {
    polyStroke(bounds, prefs)
  }
}
function polyMask(bounds, prefs) {
  maskCanvas.beginShape();
  for (let i =0; i<bounds.length; i++) {
    let current = bounds[i];
    maskCanvas.vertex(current.x, current.y);
  }
  maskCanvas.endShape(CLOSE);
}
function polyStroke(bounds, prefs) {
  for (let i =0; i<bounds.length; i++) {
    if (prefs.lrStroke && i == bounds.length - 1) continue; //dont connect last two first
    let current = bounds[i];
    let next = bounds[(i+1) % bounds.length]
    strokeCanvas.line(current.x, current.y, next.x, next.y);
  }
}

function mTranslate(x,y) {
  maskCanvas.translate(x,y);
  strokeInstructions.translate(x,y);
}

function resetCanvases() {

  fillCanvas.clear();
  strokeCanvas.clear();
  maskCanvas.clear();
}
function drawCanvases() {
  let w = canvasSize.x;
  let h = canvasSize.y;

  
  if (DEBUG) {
    image(maskCanvas.get(), 0, 0, w, h);
    image(strokeCanvas.get(), w, 0, w, h);
    image(fillCanvas.get(), w * 2,0 ,w,h);
  }  else {
    masked = fillCanvas.get();
    masked.mask(maskCanvas);
    image(masked, 0,0, w,h);
    image(strokeCanvas.get(), 0,0,w,h);
  }


  resetCanvases();
}



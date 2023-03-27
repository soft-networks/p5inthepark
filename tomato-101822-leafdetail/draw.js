
let DEBUG = false;
let maskCanvas, fillCanvas, strokeCanvas;
let canvasSize;
let prn = new PreRand();

/**

type point = {x: number, y: number}
type bounds = point[];

interface PrefType {
  lrStroke?: {l: bounds r: bounds }
  foregroundFill?: color
  strokeFill?: color
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
  strokeCanvas.colorMode(HSB);
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
  if (prefs.foregroundFill) {
    strokeCanvas.noStroke();
    strokeCanvas.fill(prefs.foregroundFill);
  }
  if (prefs.strokeFill) {
    strokeCanvas.stroke(prefs.strokeFill);
  }
  //TODO : ERROR maskCanvas.ellipse(x,y,w,h);
  strokeCanvas.ellipse(x,y,w,h);
}
function mRect(x,y,w,h, prefs) {
  let bounds = [cv(x, y), cv(x + w, y), cv(x + w, y + h), cv(x, y + h)];
  mPoly(bounds, prefs, 2 * (w + h), prefs);
}
function mPoly(bounds, prefs , size) {
  prefs = prefs || {};
  size = size || boundaryLength(bounds);
  if (prefs.jiggle) {
    bounds = bounds.map( b => cv(b.x + jiggle(size), b.y + jiggle(size)));
  }
  polyMask(bounds, prefs);
  if (prefs.lrStroke) {
    polyStroke(prefs.lrStroke.l, prefs);
    polyStroke(prefs.lrStroke.r, prefs);
  } else if (prefs.strokeFill) {
    polyStroke(bounds, prefs)
  }
} 
function polyMask(bounds, prefs) {
  function fillIntoCanvas(cnv, c = "black") {
    cnv.push();
    cnv.noStroke();
    cnv.fill(c)
    cnv.beginShape();
    for (let i =0; i<bounds.length; i++) {
      let current = bounds[i];
      cnv.vertex(current.x, current.y);
    }
    cnv.endShape(CLOSE);
    cnv.pop();
  }
  fillIntoCanvas(maskCanvas);
  if (prefs.foregroundFill) {
    fillIntoCanvas(strokeCanvas, prefs.foregroundFill)
  }
}
function polyStroke(bounds, prefs) {
  for (let i =0; i<bounds.length; i++) {
    if (prefs.lrStroke && i == bounds.length - 1) continue; //dont connect last two first
    let current = bounds[i];
    let next = bounds[(i+1) % bounds.length]
    if (prefs.strokeWeight) strokeCanvas.strokeWeight(prefs.strokeWeight);
    strokeCanvas.stroke(prefs.strokeFill || "black");
    strokeCanvas.line(current.x, current.y, next.x, next.y);
  }
}

function mTranslate(x,y) {
  maskCanvas.translate(x,y);
  strokeInstructions.translate(x,y);
}

function resetCanvases() {

  //fillCanvas.clear();
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



function keyPressed() {
  if (key == "s") {
    let d = new Date();
    console.log("saving");
    saveCanvas("park" + window.location.pathname + ":" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds(), "png");
  }
};
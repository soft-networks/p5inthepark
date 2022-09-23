let DEBUG = false;
let maskCanvas, fillCanvas, strokeCanvas;
let canvasSize;
let prn = new PreRand();

function setupCanvases(w = 600,h = 600) {
  canvasSize = cv(w,h);
  if (DEBUG) createCanvas(w * 2, h);
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
function mEllipse(x,y,w,h, prefs) {
  maskCanvas.ellipse(x,y,w,h);
  strokeCanvas.ellipse(x,y,w,h);
}
function mRect(x,y,w,h, prefs) {
  maskCanvas.rect(x,y,w,h);
  strokeCanvas.rect(x,y,w,h);
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
  clear();

  let w = canvasSize.x;
  let h = canvasSize.y;

  
  if (DEBUG) {
    image(maskCanvas.get(), 0, 0, w, h);
    image(strokeCanvas.get(), 0, 0, w, h);
    image(fillCanvas.get(), w,0 ,w,h);
  }  else {
    masked = fillCanvas.get();
    masked.mask(maskCanvas);
    image(masked, 0,0, w,h);
    image(strokeCanvas.get(), 0,0,w,h);
  }


  resetCanvases();
}
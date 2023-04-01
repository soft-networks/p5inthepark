
let w = 500;
let h = 500;

function setup() {

  setupCanvases(w,h)  
  
}

function draw() {

  clear();
  

  //Actual drawing 
  gradientBackground([frameCount % 360, 0,0], [frameCount % 360, 100,50]);
  mEllipse(mouseX, mouseY, w/4, h/4);
  
  // plant(3, cv(w/2,h));
  
  drawCanvases();

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
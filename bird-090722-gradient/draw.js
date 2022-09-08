//Gradient focus
const PREFS = {
  LINE_LENGTH: 5,
  RAND_STROKE: [1,2],
  RAND_ROT: [0,10],
  RAND_COL: ["black", "rgb(10,10,10)"],
  GRAD_COL: [[100,100, 100], [200,100,100], [0,1]], //for now this always has to kinda be [0,1] because any other version doesnt really work
  OVERDRAW: 2,
};

//NOTE: that in then shape functions , i make it so that the grad_color is controlled on a per SHAPE basis (ie: changes along the shape) rather than line
//This can be changed back by just removing the shape grad_color code
function mEllipse(x0, y0, w, h, prefs ) {
  let {GRAD_COL, LINE_LENGTH} = {...sp(prefs)};
  let circ = PI * (w/2 + h/2);
  let polygonSides = circ / LINE_LENGTH;
  let step = TAU / polygonSides;
  let bounds = [];
  //Note that this method is less efficient, but it allows us to use mPoly which is nice
  for (let t = 0; t <= TAU; t += step) {
    let x1 = x0 + (w / 2) * cos(t);
    let y1 = y0 + (h / 2) * sin(t);
    bounds.push(cv(x1,y1));    
  }
  mPoly(bounds, prefs);
}
function mRect(x1, y1, w, h, prefs) {
  let bounds = [cv(x1,y1), cv(x1 + w, y1), cv(x1 + w, y1+h), cv(x1, y1+h)];
  mPoly(bounds, prefs, w+h);
}
function mTri(x1, y1, x2, y2, x3, y3, prefs) {
  let bounds = [cv(x1,y1), cv(x2,y2), cv(x3,y3)];
  mPoly(bounds, prefs);
}
function mPoly(bounds, prefs, size) {
  let {GRAD_COL} = {...sp(prefs)};

  //Draw boundary
  if (GRAD_COL) {
    let s = size || boundaryLength(bounds);
    let lengthCovered = 0;
    for (let i =0; i< bounds.length; i++) {
      let p0 = bounds[i];
      let p1 = bounds[(i+1) % bounds.length];
      let myLength = distv(p0,p1);
      let myGrad = [GRAD_COL[0], GRAD_COL[1], [ lengthCovered / s, (lengthCovered + myLength) / s]];
      mL(p0.x,p0.y, p1.x, p1.y, {...prefs, GRAD_COL: myGrad});
      lengthCovered +=myLength;
    }
  } else {
    for (let i =0; i< bounds.length; i++) {
      let p0 = bounds[i];
      let p1 = bounds[(i+1) % bounds.length];
      mL(p0.x,p0.y, p1.x, p1.y, prefs);
    }
  }

}
function mL(x1, y1, x2, y2, prefs) {
  let { LINE_LENGTH, RAND_ROT, RAND_STROKE, RAND_COL, OVERDRAW, GRAD_COL } = {...sp(prefs)};
  if (GRAD_COL && RAND_COL) RAND_COL = false; //gradients take preference :)
  function mLL() {
    let l = dist(x1, y1, x2, y2);
    let p1 = createVector(x1, y1);
    let p2 = createVector(x2, y2);
    //if line length longer than l, max 1 step
    let step = 1 / Math.max(l / LINE_LENGTH, 1);
    let c1 = p1;
    let covered = 0;
    do {
      console.log(covered + " : covered, step: " , step );
      covered += step;
      covered = Math.min(covered, 1) //clip not to overextend
      c2 = p5.Vector.lerp(p1, p2, covered);
      push();
      if (RAND_COL) stroke(RAND_COL[floor(prn.rn(0, RAND_COL.length))]);
      if (GRAD_COL) {
        let [r,g,b] = lerpCol(GRAD_COL[0], GRAD_COL[1], covered, GRAD_COL[2]);
        stroke(r,g,b);
      }
      if (RAND_STROKE) strokeWeight(prn.rn(RAND_STROKE[0], RAND_STROKE[1]));
      if (RAND_ROT) rotate(prn.rn(RAND_ROT[0], RAND_ROT[1]));
      line(c1.x, c1.y, c2.x, c2.y);
      pop();
      c1 = c2;
    } while (covered < 1);
  }
  mLL();
  if (OVERDRAW) {
    for (let i =1; i<OVERDRAW; i++){
      mLL();
    }
  }
}

function testDraw() {
  push();
  translate(100, 100);
  mL(0, 0, 50, 50);

  // push();
  // stroke("red");
  // point(0, 0);
  // point(50, 50);
  // pop();

  //   translate(75, 0);
  //   mRect(0, 0, 50, 50);
  
    translate(75, 0);
    mEllipse(25, 25, 50, 50, {LINE_LENGTH: 5, OVERDRAW: undefined});
  
    // translate(75, 0);
    // mTri(0, 0, 50, 50, 0, 50);
    // pop();
  
}

function keyPressed() {
  if (key == "s") {
    let d = new Date();
    console.log("saving");
    saveCanvas("park" + window.location.pathname + ":" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds(), "png");
  }
};
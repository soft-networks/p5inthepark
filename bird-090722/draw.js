const PREFS = {
  LINE_LENGTH: 50,
  RAND_STROKE: [1, 3],
  RAND_ROT: [-5, 5],
  RAND_COL: ["black", "rgb(10,10,10)"],
  GRAD_COL: ["gray", "black"],
  OVERDRAW: 2,
};

function mRect(x1, y1, w, h) {
  mL(x1, y1, x1 + w, y1);
  mL(x1 + w, y1, x1 + w, y1 + h);
  mL(x1 + w, y1 + h, x1, y1 + h);
  mL(x1, y1 + h, x1, y1);
}
function mEllipse(x0, y0, w, h) {
  let polygonSides = 20;
  let step = TAU / polygonSides;
  for (let t = 0; t < TAU; t += step) {
    let x1 = x0 + (w / 2) * cos(t);
    let y1 = y0 + (h / 2) * sin(t);

    let x2 = x0 + (w / 2) * cos(t + step);
    let y2 = y0 + (h / 2) * sin(t + step);

    strokeWeight(1);
    mL(x1, y1, x2, y2);
  }
}
function mTri(x1, y1, x2, y2, x3, y3) {
  mL(x1, y1, x2, y2);
  mL(x2, y2, x3, y3);
  mL(x3, y3, x1, y1);
}
function mL(x1, y1, x2, y2, prefs = {}) {
  let { LINE_LENGTH, RAND_ROT, RAND_STROKE, RAND_COL, OVERDRAW } = { ...PREFS, ...prefs };
  function mLL() {
    let l = dist(x1, y1, x2, y2);
    let p1 = createVector(x1, y1);
    let p2 = createVector(x2, y2);

    //if line length longer than l, max 1 step
    let step = 1 / Math.max(l / LINE_LENGTH, 1);

    let c1 = p1;
    let covered = 0;

    do {
      covered += step;
      //clip to 1 to not overextend, can be changed for art
      c2 = p5.Vector.lerp(p1, p2, Math.min(covered, 1));

      push();
      if (RAND_COL) stroke(RAND_COL[floor(prn.rn(0, RAND_COL.length))]);
      if (RAND_STROKE) strokeWeight(prn.rn(RAND_STROKE[0], RAND_STROKE[1]));
      if (RAND_ROT) rotate(prn.rn(RAND_ROT[0], RAND_ROT[1]));
      line(c1.x, c1.y, c2.x, c2.y);
      pop();

      c1 = c2;
    } while (covered <= 1);
  }
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

  push();
  stroke("red");
  point(0, 0);
  point(50, 50);
  pop();

  translate(75, 0);
  mRect(0, 0, 50, 50);

  translate(75, 0);
  mEllipse(25, 25, 50, 50);

  translate(75, 0);
  mTri(0, 0, 50, 50, 0, 50);
  pop();
}

function keyPressed() {
  if (key == "s") {
    let d = new Date();
    console.log("saving");
    saveCanvas("park" + window.location.pathname + ":" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds(), "png");
  }
};
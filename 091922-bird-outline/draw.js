//Gradient focus

const J = 0.003;
const jiggle = (l) => prn.rn(-l * J, l * J);

const PREFS = {
  LINE_LENGTH: 10,
  RAND_STROKE: [1, 3],
  RAND_ROT: [-5, 5],
  RAND_COL: ["black", "rgb(10,10,10)"],
  GRAD_COL: [
    [0, 90, 100],
    [360, 90, 100],
    [0.1, 0.5],
  ], //for now this always has to kinda be [0,1] because any other version doesnt really work
  OVERDRAW: 5,
  FILL_COL: [200, 5, 100],
};

//NOTE: that in then shape functions , i make it so that the grad_color is controlled on a per SHAPE basis (ie: changes along the shape) rather than line
//This can be changed back by just removing the shape grad_color code
function mEllipse(x0, y0, w, h, prefs, steps) {
  let { GRAD_COL, LINE_LENGTH } = { ...sp(prefs) };
  let circ = PI * (w / 2 + h / 2);
  let polygonSides = steps || Math.max(circ / LINE_LENGTH, 5);
  let step = TAU / polygonSides;
  let bounds = [];
  let c = 0;
  //Note that this method is less efficient, but it allows us to use mPoly which is nice
  for (let t = 0; t <= TAU; t += step) {
    c++;
    let x1 = x0 + (w / 2) * cos(t);
    let y1 = y0 + (h / 2) * sin(t);
    let p = cv(x1, y1);
    if (c % 2 == 0) {
      //p = addv(p, cv(jiggle(circ), jiggle(circ)));
    }
    bounds.push(p);
  }
  mPoly(bounds, prefs, circ / 5);
}
function mRect(x1, y1, w, h, prefs) {
  let bounds = [cv(x1, y1), cv(x1 + w, y1), cv(x1 + w, y1 + h), cv(x1, y1 + h)];
  mPoly(bounds, prefs, 2 * (w + h));
}
function mTri(x1, y1, x2, y2, x3, y3, prefs) {
  let bounds = [cv(x1, y1), cv(x2, y2), cv(x3, y3)];
  mPoly(bounds, prefs);
}
function mPoly(bounds, prefs, size, disableJiggle) {
  let {OVERDRAW} = {...sp(prefs)};
  
  function jiggleAndDraw(o) {
    size = size || boundaryLength(bounds);
    let jbounds = [...bounds];
    for (let i = 0; i < bounds.length; i++) {
      jbounds[i] = addv(jbounds[i], cv(jiggle(size), jiggle(size)));
    }
    jbounds[jbounds.length] = jbounds[0];
    if (o)
      makeShape(jbounds, {...prefs, GRAD_COL: undefined});
    else
      makeShape(jbounds, prefs);
  }
  jiggleAndDraw(false);
  for (let i =1; i<OVERDRAW; i++) {
    jiggleAndDraw(true)
  }
}
function mL(x1, y1, x2, y2, prefs) {
  let lineBounds = subdivideLine(x1, y1, x2, y2);
  makeShape(lineBounds, prefs);
}

function subdivideLine(x1, y1, x2, y2, prefs) {
  return [cv(x1, y1), cv(x2, y2)];
  let p1 = createVector(pa.x, pa.y);
  let p2 = createVector(pb.x, pb.y);

  let { LINE_LENGTH } = { ...sp(prefs) };
  let l = dist(p1.x, p1.y, p2.x, p2.y);

  //if line length longer than l, max 1 step
  let step = 1 / Math.max(l / LINE_LENGTH, 1);

  let covered = 0;
  let linebounds = [];
  do {
    let lc = Math.min(covered, 1);
    let p = p5.Vector.lerp(p1, p2, lc);
    linebounds.push(cv(p.x, p.y));
    covered += step;
  } while (covered < 1 + step);

  return linebounds;
}

function makeShape(bounds, prefs) {
  let { FILL_COL, RAND_STROKE, GRAD_COL } = { ...sp(prefs) };

  push();
  strokeWeight(1);
  noFill();
  if (FILL_COL) fill(FILL_COL);
  if (FILL_COL) stroke(FILL_COL);

  stroke(10, 10, 10, 80);
  if (GRAD_COL) fill(GRAD_COL[0]);
  else noFill();

  beginShape();
  for (let i = 0; i < bounds.length; i++) {
    let p = bounds[i];
    vertex(p.x, p.y);
  }
  endShape();
  pop();
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
  mEllipse(25, 25, 50, 50, { OVERDRAW: undefined });

  translate(75, 0);
  mTri(0, 0, 50, 50, 0, 50);
  pop();

  translate(width / 2, height / 2);
  mEllipse(0, 0, 200, 200);
}

function keyPressed() {
  if (key == "s") {
    let d = new Date();
    console.log("saving");
    saveCanvas(
      "park" + window.location.pathname + ":" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds(),
      "png"
    );
  }
}

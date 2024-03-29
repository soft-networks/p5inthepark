let PI = Math.PI;
let TAU = 2 * PI;

function movev(v, a, l) {
  return cv(v.x + cos(a) * l, v.y + sin(a) * l)
}

function boundaryLength(bounds) {
  let runningLength = 0;
  for (let i =0; i< bounds.length; i++) {
    let p0 = bounds[i];
    let p1 = bounds[(i+1)% bounds.length ];
    runningLength += distv(p0,p1);
  }
  return runningLength;
}

const jiggle = (l) => prn.rn(-l * JIGGLE, l * JIGGLE);
function lerpCol(c1, c2, t, lerpRange = [0,1]) {
  const newLerp = (t * (lerpRange[1] - lerpRange[0])) + lerpRange[0];
  return [
    lerp(c1[0], c2[0], newLerp),
    lerp(c1[1], c2[1], newLerp),
    lerp(c1[2], c2[2], newLerp),
  ];
}
let floor = Math.floor;
function distv(p1,p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function cv(x, y , z ) {
  return { x: x || 0, y: y ||0 , z: z ||0};
}
function cpv(v) {
  return { ...v };
}
function addv(v1, v2) {
  return cv(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}
function subv(v1, v2) {
  return cv(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

function mulv(v, m) {
  return cv(v.x * m, v.y * m, v.z * m);
}
function divv(v, m) {
  return mulv(v, 1 / m);
}
function setmag(v, m) {
  let mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  let scale = m / mag;
  return cv(v.x * scale, v.y * scale, v.z * scale);
}

function rn(min, max) {
  return Math.random() * (max - min) + min;
}

function fliprn() {
  return rn(0, 10) >= 5 ? 1 : -1;
}

class PreRand {
  constructor(n = 100) {
    this.randomNumbers = [];
    this.index = 0;
    for (let i =0; i< n; i++) {
      this.randomNumbers.push(Math.random())
    }
  }
  reset() {
    this.index = 0;
  }
  rn(min, max) {
    let r = this.randomNumbers[this.index];
    if (min || max) {
      r = map(r, 0, 1, min,max)
    }
    this.index = (this.index + 1) % this.randomNumbers.length;
    return r;
  }
}

let rnd = rn;
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
const setupLeafPoints = (nsegments, w, h) => {
  leafPoints = [];
  for (let i =0; i< nsegments;i++) {
    let sinamplitude = sin( i * (PI/nsegments)) * h;
    let dampen = 1 - (i / nsegments);
    let leafPoint = cv(i * w/nsegments, dampen *  sinamplitude);
    leafPoints.push(leafPoint);
  }
  for (let i = nsegments; i>=0;i--) {
    let sinamplitude = -1 * sin( i * (PI/nsegments)) * h;
    let dampen = 1 - (i / nsegments);
    let leafPoint = cv(i * w/nsegments, dampen *  sinamplitude);
    leafPoints.push(leafPoint);
  }
  return leafPoints;
}

let cos = Math.cos;
let sin = Math.sin;
let round = Math.round;
let max = Math.max;
let abs = Math.abs;
const map = (n, start1, stop1, start2, stop2) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
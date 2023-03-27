
/**
 
 * interface node {
 *    numChildren: number //ONLY FOR FIRST NODE, stores ove time
 *    type: undefined
 *    depth: number
 *    index: number
 *    produces: "leaf" | "fruit"
 *    x: number,
 *    y: number
 *    angle: number (radians),
 *    thickness: 20, 
 *    height: number,
 * }
 * 
 * interface produceNode {
 *    type: "leaf"  | "fruit",
 *    color: color lol
 *    size: number,
 *    stem: {
 *      x: number,
 *      y: number
*       height: number,
 *      angle: number,
 *      thickness: number 
 *    }
 * }
 */

let w = 500;
let h = 500;


const BRANCH_PROB = (depth, index) => {
  if (depth > 0 && index == 0) return 0;
  else return 0.1 * (depth + 1);
};
const MAX_INDEX_REACHED = (depth, index) =>{
  if (depth == 0) return false;
  else return index > 10;
}
const MAX_BRANCH_DEPTH = 3;
const PRODUCE_PROB = 0.7;
const FRUIT_PROB = 0.1;
const CURVE_ANGLE = 0.05;
const THICKNESS_STEP = 0.1;
const THICKNESS_JUMP_RATIO = 0.5;
const STEM_LENGTH_STEP = 0.1;
const PADDING = 100;
const MAIN_STEM_WAVE_PROB = 0.05;
const PRODUCE_INIT_SIZE = {
  "fruit": 1,
  "leaf": 1,
}
const PRODUCE_MAX_SIZES = {
  "fruit" : 10,
  "leaf": 30
}
const PRODUCE_STEPS = {
  "fruit": 1,
  "leaf": 2
}

let initNode = { x: w / 2, y: h-1, angle: -PI / 2, thickness: 15, height: 8, depth: 0, index: 0, numChildren: 0 };
let branches = [[initNode]];
let produceNodes = []; 




function setup() {

  setupCanvases(w,h)  
  if (DEBUG) frameRate(5);
  frameRate(12);
}

function draw() {

  clear();

  //Actual drawing 
   gradientBackground([50, 50,50], [100, 100,100]);
  //noiseBackground();

  //Draw each node
  branches.forEach((branch) => branch.forEach((node) => {
    let branchPoly = branchToPoly(branch);
    mPoly(branchPoly.bounds, { lrStroke: branchPoly.lrStroke }, branchPoly.size);
  }));
  produceNodes.forEach((produceNode) => {
    let stemPoly = stemToPoly(produceNode.stem);
    let producePoint = stemPoly.stemEnd;
    mPoly(stemPoly.bounds, {lrStroke: stemPoly.lrStroke}, stemPoly.size);
    if (produceNode.type == "fruit") {
      mEllipse(producePoint.x, producePoint.y, produceNode.size, produceNode.size, {foregroundFill: produceNode.color || "pink"});
    } else {
      mPoly(leafToPoly(producePoint, produceNode), {foregroundFill: "green"})
    }
  });

  //Do the next one
  plant();
  
  background("white");
  drawCanvases();

}


function plant() {
  let newBranches = [];
  let numCurrentBranches = branches.length;
  for (let i =0; i< numCurrentBranches; i++) {
    let branch = branches[i]
    let latestNode = branch[branch.length -1];
    if (latestNode.culled) continue;
    if (inBounds(latestNode) && !MAX_INDEX_REACHED(latestNode.depth, latestNode.index)) {
      branch.push(growNode(latestNode));
      if (!latestNode.produces) {
        if (Math.random() < BRANCH_PROB(latestNode.depth, latestNode.index)){
          branch[0].numChildren = branch[0].numChildren + 1;
          newBranches.push(branchNode(latestNode, branch[0].numChildren));
        } 
      } else {
        if (Math.random() < PRODUCE_PROB) {
          branch[0].numChildren = branch[0].numChildren + 1;
          produceNodes.push(newProduce(latestNode, branch[0].numChildren));
        }
      }
    } else {
      latestNode.produces = 'leaf';
      produceNodes.push(newProduce(latestNode, 'final'));
      latestNode.culled = true;
    }
  }
  branches.push(...newBranches);
  for (let i =0; i< produceNodes.length; i++) {
    growProduce(produceNodes[i]);
  }
}



function growNode(node) {
  //Core node has no type
  let nextNode = {...node};
  let nextP = movev(cv(node.x, node.y), node.angle, node.height);
  nextNode.x = nextP.x;
  nextNode.y = nextP.y;
  nextNode.index += 1;
  if (nextNode.depth == 0)  {

    if (rn() < MAIN_STEM_WAVE_PROB) {
      nextNode.angle += prn.rn(-PI/4, PI/4);
    }
  }
  else {
    nextNode.angle += (nextNode.angle > - PI/2 ? 1 : -1) * CURVE_ANGLE; //TODO: Gravity
  }
  nextNode.thickness = max(initNode.thickness/2, nextNode.thickness  - THICKNESS_STEP);
  return nextNode;
}
function branchNode(node, branchNum) {
  let nextNode = {
    index: 0,
    depth: node.depth + 1,
    x: node.x,
    y: node.y,
    height: node.height,
    thickness: node.thickness * THICKNESS_JUMP_RATIO,
    numChildren: 0
  };
  // let flip = fliprn() > 0;  //random flips
  // let flip = branches.length % 2 == 0;
  let flip = branchNum % 2 == 0;
  // let flip = false;
  nextNode.angle = flip ? node.angle + PI/4 : node.angle - PI/4;
  if (nextNode.depth == MAX_BRANCH_DEPTH) {
    nextNode.produces = fliprn() <= FRUIT_PROB ? "fruit" : "leaf";
  }
  // nextNode.angle = PI/4;
  return [nextNode];
}

function newProduce(branchNode, produceNumber) {
  let angle, stemStart;
  if (produceNumber == 'final') {
    angle = branchNode.angle;
    stemStart = cv(branchNode.x, branchNode.y);
  } else {
    angle = produceNumber % 2 == 0 ? branchNode.angle + PI/2 : branchNode.angle - PI/2;
    stemStart = movev(cv(branchNode.x, branchNode.y), angle, branchNode.thickness/2);
  }
  let produceNode = {
    size: PRODUCE_INIT_SIZE[branchNode.produces],
    type: branchNode.produces,
    color: branchNode.produces == 'fruit' ? [prn.rn(0,50), 100,90] : undefined,
    stem: {
      x: stemStart.x, 
      y: stemStart.y,
      angle: angle,
      thickness: branchNode.thickness/ 2,
      height: branchNode.thickness * 1.25,
    }
  }
  return produceNode
}

function growProduce(produceNode) {
  let maxSize = PRODUCE_MAX_SIZES[produceNode.type];
  let sizeStep = PRODUCE_STEPS[produceNode.type];
  if (produceNode.size < maxSize) {
    produceNode.size += sizeStep;
  }
  if (produceNode.stem.height < 10) 
    produceNode.stem.height += STEM_LENGTH_STEP;
}

//DRAWING FUNCTIONS

function branchToPoly(branch) {
  let l = [];
  let r = [];
  let rl = 0;
  for (let i =0 ; i<branch.length; i++) {
    let n = branch[i];
    let lp = movev(cv(n.x, n.y), n.angle + PI/2, 0.5 * n.thickness);
    l.push(lp);

    let rp =  movev(cv(n.x, n.y), n.angle -PI/2, 0.5 * n.thickness);
    r.unshift(rp);
    rl += 2* n.y;
    if (i == 0 || i == branch.length- 1) rl += n.thickness
  }
  return {bounds: [...l, ...r], lrStroke: {l: l, r: r}, size: rl};
}
function stemToPoly(stem) {
  let l = [];
  let r = [];
  let rl = 0;
  let stemStart = cv(stem.x, stem.y);
  let stemEnd = movev(stemStart, stem.angle, stem.height);
  let stemBranch = [stemStart, stemEnd];
  for (let i =0 ; i<stemBranch.length; i++) {
    let p = stemBranch[i];
    let lp = movev(cv(p.x, p.y), stem.angle + PI/2, 0.5 * stem.thickness);
    l.push(lp);
    let rp =  movev(cv(p.x, p.y), stem.angle -PI/2, 0.5 * stem.thickness);
    r.unshift(rp);
    rl += 2* p.y;
    if (i == 0 || i == stem.length- 1) rl += stem.thickness
  }
  //noLoop();
  return {bounds: [...l, ...r], lrStroke: {l: l, r: r}, size: rl, stemEnd: stemEnd};
}
function leafToPoly(producePoint,produceNode) {
  let leafEnd = movev(producePoint, produceNode.stem.angle, produceNode.size);
  let halfPoint = lerpv(producePoint, leafEnd, 0.5);
  let leafLeft = movev(halfPoint, produceNode.stem.angle + PI/2, produceNode.size/4);
  let leafRight = movev(halfPoint, produceNode.stem.angle -PI/2, produceNode.size/4);
  return [ producePoint, leafLeft, leafEnd, leafRight];
}
function inBounds(node) {
  return node.x < w && node.x > PADDING && node.y < h && node.y > PADDING;
}
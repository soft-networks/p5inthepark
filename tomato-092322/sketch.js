
let w = 500;
let h = 500;

let curveAngle = 0;
let thicknessStep = 0.2;
let stemLengthStep = 0.1;

/**
 
 * interface node {
 *    type: undefined
 *    depth: number
 *    index: number
 *    produces: "leaf" | "fruit"
 *    x: number,
 *    y: number
 *    angle: number (radians),
 *    thickness: 20, 
 *    height: number
 * }
 * 
 * interface produceNode {
 *    type: "leaf"  | "fruit"
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
let initNode = { x: w / 2, y: h - 20, angle: -PI / 2, thickness: 20, height: 10, depth: 0, index: 0 };
let branches = [[initNode]];
let produceNodes = []; 

let MAX_BRANCH_DEPTH = 2;
let PRODUCE_MAX_SIZES = {
  "fruit" : 10,
  "leaf": 20
}
let PRODUCE_STEPS = {
  "fruit": 1,
  "leaf": 1
}

function setup() {

  setupCanvases(w,h)  
  if (DEBUG) frameRate(5);
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
    console.log(stemPoly);
    let producePoint = stemPoly.stemEnd;
    mPoly(stemPoly.bounds, {lrStroke: stemPoly.lrStroke}, stemPoly.size);
    if (produceNode.type == "fruit") {
      mEllipse(producePoint.x, producePoint.y, produceNode.size, produceNode.size, {foregroundFill: "red"});
    } else {
      mRect(producePoint.x, producePoint.y, produceNode.size/2, produceNode.size/2, {foregroundFill: "blue"});
    }
  });

  //Do the next one
  plant();
  
  background("white");
  drawCanvases();

}


function plant() {
  let newBranches = [];
  for (let i =0; i<branches.length; i++) {
    let branch = branches[i]
    let latestNode = branch[branch.length -1];
    if (latestNode.culled) continue;
    if (inBounds(latestNode)) {
      branch.push(growNode(latestNode));
      if (!latestNode.produces) {
        if (Math.random() > 0.86)
          newBranches.push(branchNode(latestNode));
      } else {
        if (Math.random() > 0.3)
          produceNodes.push(newProduce(latestNode));
      }
    } else {
      console.log("Branch culled" , i, latestNode);
      latestNode.culled = true;
    }
  }
  branches.push(...newBranches);
  for (let i =0; i< produceNodes.length; i++) {
    //growProduce(produceNodes[i]);
  }
}

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
  console.log(stem);
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
function inBounds(node) {
  return node.x < w && node.x > 0 && node.y < h && node.y > 0;
}

function growNode(node) {

  //Core node has no type
  let nextNode = {...node};
  let nextP = movev(cv(node.x, node.y), node.angle, node.height);
  nextNode.x = nextP.x;
  nextNode.y = nextP.y;
  nextNode.index += 1;
  nextNode.angle += curveAngle;
  nextNode.thickness = max(initNode.thickness/2, nextNode.thickness  - thicknessStep);
  return nextNode;
}
function branchNode(node) {
  let nextNode = {
    index: 0,
    depth: node.depth + 1,
    x: node.x,
    y: node.y,
    height: node.height,
    thickness: node.thickness,
  };
  nextNode.angle = fliprn() > 0 ? node.angle + PI/4 : node.angle - PI/4;
  if (nextNode.depth == MAX_BRANCH_DEPTH) {
    nextNode.produces = fliprn() > 0 ? "fruit" : "leaf";
  }
  // nextNode.angle = PI/4;
  return [nextNode];
}

function newProduce(branchNode) {
  let produceNode = {
    size: 10,
    type: branchNode.produces,
    stem: {
      x: branchNode.x, 
      y: branchNode.y,
      angle: fliprn() > 0 ? branchNode.angle + PI/2 : branchNode.angle - PI/2,
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
    produceNode.stem.height += stemLengthStep;
}

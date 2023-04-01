/**
 
 * interface node {
 *    numChildren: number //ONLY FOR FIRST NODE, stores ove time
 *    timeSinceBranch: 0 // ONLY FOR FIRST NODE
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

//gray
// let PALETTE = {
//   background: [240, 3, 100],
//   plant: [[150, 80, 50], [100, 50, 70]],
//   tomato: [[55, 98, 98], [356, 100, 100]]
  
// }

//yellow
let PALETTE = {
  background: [55, 15, 100],
  plant: [[150, 97, 35], [140, 50, 60]],
  tomato: [ [356, 100, 100],[45, 100, 100], [85, 30, 100]]
  
}

let w = 500;
let aspect = 20/28;
let h = w / aspect;
const MAX_BRANCH_DEPTH = 2;
const MIN_THICKNESS = 0.2;

const BRANCH_PROB = (node) => {
  let { depth } = node;
  if (depth == 0) return 0.2;
  if (depth == 1 && node.index >= 1 ) return 0.5;
  if (depth == 2) return 0.96;
  return 0;
};
const END_REACHED = (node) => {
  let { depth, index } = node;
  if (depth == 0) return node.y < 0 || index > 1;
  if (depth == 1) return node.thickness < 1 || index > 15;
  if (depth == 2) return node.thickness < MIN_THICKNESS || index > 10;
};

const WOBBLE_ANGLE = (node) => {
  return map(node.depth, 0,2, PI/32, PI/64);
};

const FRUIT_PROB = 0.4;
const CURVE_ANGLE = PI/100;
const INIT_THICKNESS = 40;
const HEIGHT_PER_INDEX = 50;

const THICKNESS_STEP = 0.6;
const THICKNESS_JUMP_RATIO = 0.67
const HEIGHT_JUMP_RATIO = 0.55;
const STEM_LENGTH_STEP = 0.09;
const PADDING = 0;
const MAIN_STEM_WAVE_PROB = 0;
const BRANCH_ANGLES = [PI / 6, PI / 4];
const PRODUCE_INIT_SIZE = {
  fruit: 20,
  leaf: 50,
  stem: 0
};

const d3Thickness = INIT_THICKNESS * Math.pow(THICKNESS_JUMP_RATIO, 3);
const PRODUCE_MAX_SIZES = {
  fruit: (node) => PRODUCE_INIT_SIZE['fruit'],
  leaf: (node) => PRODUCE_INIT_SIZE['leaf'],
  stem: (node) => PRODUCE_INIT_SIZE['stem']
};
const PRODUCE_STEPS = {
  fruit: 0.1,
  leaf: 1,
};
const PRODUCE_COLORS = {
  fruit: () => rndArr(PALETTE.tomato),
  leaf: () => {
    let lcolors = [
      [120, 90, 60],
      [110, 50, 20],
      [130, 60, 50],
    ];
    return lcolors[floor(rnd(0, lcolors.length))];
  },
};
let initNode = {
  x: w / 2,
  y: h - PADDING,
  angle: -PI / 2,
  thickness: INIT_THICKNESS,
  height: HEIGHT_PER_INDEX,
  depth: 0,
  index: 0,
  numChildren: 0,
  color: PALETTE.plant[0]
};
let branches = [[initNode]];
let produceNodes = [];

function setup() {
  setupCanvases(w, h);
  if (DEBUG) frameRate(5);
  colorMode(HSB);
  frameRate(12);

  gradientBackground(PALETTE.plant[0], PALETTE.plant[1]);
}

function draw() {
  clear();

  
  //Actual drawing
  //noiseBackground();

  //Draw each node
  
  branches.forEach((branch) =>
    branch.forEach((node) => {
      let branchPoly = branchToPoly(branch);
      let strokeMe =  { lrStroke: branchPoly.lrStroke, strokeFill: "green" }
      strokeMe = {};
      mPoly(branchPoly.bounds, {}, branchPoly.size);
    })
  );
  produceNodes.forEach((produceNode) => {
    let stemPoly = stemToPoly(produceNode.stem);
    let producePoint = stemPoly.stemEnd;
    // let producePoint = cv(produceNode.stem.x, produceNode.stem.y);
    let strokeMe =  { lrStroke: stemPoly.lrStroke, strokeFill: "green" };
    strokeMe = {}
    mPoly(stemPoly.bounds, {}, stemPoly.size);
    if (produceNode.type == "fruit") {
      mEllipse(producePoint.x, producePoint.y, produceNode.size, produceNode.size, {
        foregroundFill: produceNode.color,
        strokeFill: undefined
      });
    } else {
      mPoly(leafToPoly(producePoint, produceNode), {foregroundFill: produceNode.color});
    }
  });

  //Do the next one
  plant();

  // background(180, 50, 50);
  
  background(PALETTE.background);
  drawCanvases();
}

function plant() {
  let newBranches = [];
  let numCurrentBranches = branches.length;
  for (let i = 0; i < numCurrentBranches; i++) {
    let branch = branches[i];
    let latestNode = branch[branch.length - 1];
    if (latestNode.culled) continue;
    if (!END_REACHED(latestNode) && inBounds(latestNode) ) {
      branch.push(growNode(latestNode));
      const shouldBranch =  (latestNode.depth == 0 && branch[0].timeSinceBranch == 4) || Math.random() < BRANCH_PROB(latestNode)
      if (shouldBranch) {
        branch[0].numChildren = branch[0].numChildren + 1;
        branch[0].timeSinceBranch = 0;
        if (!latestNode.produces) {
          newBranches.push(branchNode(latestNode, branch[0].numChildren));
        } else {
          produceNodes.push(newProduce(latestNode, branch[0].numChildren));
        }
      } else {
        branch[0].timeSinceBranch = branch[0].timeSinceBranch + 1;
      }
    } else {
      latestNode.produces = "leaf";
      produceNodes.push(newProduce(latestNode, "final"));
      latestNode.culled = true;
    }
  }
  branches.push(...newBranches);
  for (let i = 0; i < produceNodes.length; i++) {
    growProduce(produceNodes[i]);
  }
}

function growNode(node) {
  //Core node has no type
  let nextNode = { ...node };
  let nextP = movev(cv(node.x, node.y), node.angle, node.height);
  nextNode.x = nextP.x;
  nextNode.y = nextP.y;
  nextNode.index += 1;
  nextNode.color = node.color;
  if (nextNode.depth == 0) {
    if (rn() < MAIN_STEM_WAVE_PROB) {
      nextNode.angle += prn.rn(-PI / 4, PI / 4);
    }
  } else {
    if (node.angle < 0 && node.angle > -PI) {
      let depthLerp = node.depth == MAX_BRANCH_DEPTH ? 1 : 0.5;
      let thicknessLerp = map(nextNode.thickness, MIN_THICKNESS, initNode.thickness, 2, 0);
      let tomatoGravity = nextNode.produces == "fruit" ? 2 : 1;
      nextNode.angle += (nextNode.angle > -PI / 2 ? 1 : -1) * depthLerp * thicknessLerp * tomatoGravity * CURVE_ANGLE;
    } else {
      nextNode.angle += (nextNode.angle > -PI / 2 ? 1 : -1) * CURVE_ANGLE; //TODO: Gravity
    }
  }
  nextNode.thickness = nextNode.thickness - THICKNESS_STEP;

  const wobbleAngle = WOBBLE_ANGLE(node);
  nextNode.angle += rnd(-wobbleAngle, wobbleAngle);
  //nextNode.thickness = max(initNode.thickness/2, nextNode.thickness  - THICKNESS_STEP);
  return nextNode;
}
function branchNode(node, branchNum) {
  let nextNode = {
    index: 0,
    depth: node.depth + 1,
    x: node.x,
    y: node.y,
    height: node.height * HEIGHT_JUMP_RATIO, //ODO: DAMPEN VIBES
    thickness: node.thickness * THICKNESS_JUMP_RATIO,
    numChildren: 0,
    color: rndArr(PALETTE.plant)
  };
  // let flip = fliprn() > 0;  //random flips
  // let flip = branches.length % 2 == 0;
  let flip = branchNum % 2 == 0;
  // let flip = false;
  let myBranchAngle = BRANCH_ANGLES[node.depth] || BRANCH_ANGLES[0];
  nextNode.angle = flip ? node.angle + myBranchAngle : node.angle - myBranchAngle;
  if (nextNode.depth == MAX_BRANCH_DEPTH) {
    nextNode.produces = rnd() <= FRUIT_PROB ? "fruit" : "leaf";
  }
  // nextNode.angle = PI/4;
  return [nextNode];
}

function newProduce(branchNode, produceNumber) {
  let stem;
  if (produceNumber == "final") {
    stem = {
      angle: branchNode.angle,
      x: branchNode.x,
      y: branchNode.y,
      height: 0,
      thickness: branchNode.thickness,
    };
  } else {
    let angle = produceNumber % 2 == 0 ? branchNode.angle + PI / 2 : branchNode.angle - PI / 2;
    let stemStart = movev(cv(branchNode.x, branchNode.y), angle, branchNode.thickness / 2);
    stem = {
      x: stemStart.x,
      y: stemStart.y,
      angle: angle,
      thickness: branchNode.thickness / 2,
      height: PRODUCE_INIT_SIZE['stem'],
      color: branchNode.color
    };
  }

  let produceColor = branchNode.produces == "fruit" ? rndArr(PALETTE.tomato) : rndArr(PALETTE.plant);

  let produceNode = {
    size: PRODUCE_INIT_SIZE[branchNode.produces],
    type: branchNode.produces,
    color: produceColor,
    stem: stem,
  };
  return produceNode;
}

function growProduce(produceNode) {
  let maxSize = PRODUCE_MAX_SIZES[produceNode.type](produceNode);
  let sizeStep = PRODUCE_STEPS[produceNode.type];
  if (produceNode.size < maxSize) {
    produceNode.size += sizeStep;
  }
  //TODO: SHOULD STEM GROW? NAH.
  if (produceNode.type == "fruit") produceNode.stem.height = produceNode.size;
  if (produceNode.stem.height <= PRODUCE_MAX_SIZES['stem'](produceNode)) {
    produceNode.stem.height += STEM_LENGTH_STEP;
  }
    
}

//DRAWING FUNCTIONS

function branchToPoly(branch) {
  let l = [];
  let r = [];
  let rl = 0;
  for (let i = 0; i < branch.length; i++) {
    let n = branch[i];
    let lp = movev(cv(n.x, n.y), n.angle + PI / 2, 0.5 * n.thickness);
    l.push(lp);

    let rp = movev(cv(n.x, n.y), n.angle - PI / 2, 0.5 * n.thickness);
    r.unshift(rp);
    rl += 2 * n.y;
    if (i == 0 || i == branch.length - 1) rl += n.thickness;
  }
  return { bounds: [...l, ...r], lrStroke: { l: l, r: r }, size: rl };
}
function stemToPoly(stem) {
  let l = [];
  let r = [];
  let rl = 0;
  let stemStart = cv(stem.x, stem.y);
  let stemEnd = movev(stemStart, stem.angle, stem.height);
  let stemBranch = [stemStart, stemEnd];
  //TODO: MAKE THIS A SPECIAL KINDA "LEAF" that becomes narrow at the end
  for (let i = 0; i < stemBranch.length; i++) {
    let p = stemBranch[i];
    let lp = movev(cv(p.x, p.y), stem.angle + PI / 2, 0.5 * stem.thickness);
    l.push(lp);
    let rp = movev(cv(p.x, p.y), stem.angle - PI / 2, 0.5 * stem.thickness);
    r.unshift(rp);
    rl += 2 * p.y;
    if (i == 0 || i == stem.length - 1) rl += stem.thickness;
  }
  //noLoop();
  return { bounds: [...l, ...r], lrStroke: { l: l, r: r }, size: rl, stemEnd: stemEnd };
}
function leafToPoly(leafStart, produceNode) {
  let bounds = [];

  bounds.push(leafStart);

  let numSteps = 5;
  let maxWidth = 20;
  let step = produceNode.size / numSteps;

  let lpoints =[]; 
  let rpoints = [];
  
  let currentPoint = leafStart;
  for (let i= 0; i< numSteps ; i++) {
    let x= i/numSteps;
    
    let width = maxWidth * (1-x);

    //https://www.desmos.com/calculator/dobb44f84y
    //let width = maxWidth * (sin((PI*x - PI * 0.1) + 0.5) * (1-x) + 0.1);

    lpoints.push(movev(currentPoint, produceNode.stem.angle - PI/2, width));
    rpoints.unshift(movev(currentPoint, produceNode.stem.angle + PI/2, width));

    currentPoint = movev(currentPoint,  produceNode.stem.angle, step);
  }
  
  bounds.push(...lpoints);
  let leafEnd = movev(currentPoint, produceNode.stem.angle, step);
  bounds.push(leafEnd);
  bounds.push(...rpoints);

  return bounds;
}
function inBounds(node) {
  return node.x <= w && node.x > PADDING && node.y <= h && node.y > PADDING;
}

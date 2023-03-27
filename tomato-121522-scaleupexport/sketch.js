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



//Colorway 1
let PALETTE = {
  background: "#D4D6D8",
  plantGradient: [ [120, 30,70], [200, 20,100]],
  plant: [ [150,80, 50]],
  leaves: [  [150, 50, 60], [180,  90,  50], [120,  40 ,  50]],
  tomato: [ [10, 80, 100], [30, 96, 100], [70, 50, 90], [150, 50, 90]]
}


//purple 
// let PALETTE = {
//   background: [270, 40, 60],
//   plantGradient: [ [130, 80, 10], [150, 80, 30]],
//   plant: [ [150,80, 40]],
//   leaves: [[150, 50, 10], [180,  90,  30], [120,  40 ,  40]],
//   tomato: [ [10, 80, 100], [30, 96, 70], [70, 50, 80]]
// }

//yellow
// let PALETTE = {
//   background: [60, 95, 90],
//   plantGradient: [ [130, 80, 40], [150, 80, 50]],
//   plant: [ [150,80, 40]],
//   leaves: [[150, 50, 10], [180,  90,  30], [120,  40 ,  40]],
//   tomato: [ [10, 80, 100], [30, 96, 70], [70, 50, 80]]
// }



let w = 600;
let aspect = 1;
let h = w / aspect;
const MAX_BRANCH_DEPTH = 2;
const MIN_THICKNESS = 0.8;

const BRANCH_PROB = (node) => {
  let { depth } = node;
  if (depth == 0) return 0.8;
  if (depth == 1 && node.index >= 1 ) return 0.7;
  if (depth == 2) {
    if (node.produces == 'fruit') return 1.0;
    else return 0.3;
  };
  return 0;
};
const END_REACHED = (node) => {
  let { depth, index } = node;
  if (node.thickness < MIN_THICKNESS) return true;
  if (depth == 0) return node.y < 0 || index > rnd(25, 35);
  if (depth == 1) index > rnd(15,20);
  if (depth == 2) index > rnd(10,15);
};

const WOBBLE_ANGLE = (node) => {
  return map(node.depth, 0,2, PI/32, PI/64);
};

const FRUIT_PROB = 0.25;
const CURVE_ANGLE = (node) => {
  let c = map(node.index, 0, 20, 0, PI/4);
  return c * rnd(0.8,1.2);
};
const INIT_THICKNESS = 10;
const HEIGHT_PER_INDEX = 15;

const THICKNESS_STEP = 0.29;
const THICKNESS_JUMP_RATIO = 0.65
const HEIGHT_JUMP_RATIO = 0.51;
const STEM_LENGTH_STEP = 0.5;
const PADDING = 100;
const MAIN_STEM_WAVE_PROB = 0;
const BRANCH_ANGLES = [PI / 6, PI / 4, PI/2 - PI/6];
const PRODUCE_INIT_SIZE = {
  fruit: 5,
  leaf: 13,
  stem: 4
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

let initNode = {
  x: w / 2,
  y: h - h/5,
  angle: -PI / 2,
  thickness: INIT_THICKNESS,
  height: HEIGHT_PER_INDEX,
  depth: 0,
  index: 0,
  numChildren: 0,
  color: PALETTE.plant[0]
};
initNode.angle -= PI/30;

let rightPlant = {...initNode};
rightPlant.x += w/6;
rightPlant.angle += PI/12;

let leftPlant = {...initNode};
leftPlant.x -= w/4;
leftPlant.angle += PI/16;

let branches = [[initNode]];
let produceNodes = [];

function setup() {
  setupCanvases(w, h);
  if (DEBUG) frameRate(5);
  colorMode(HSB);
  frameRate(12);

  gradientBackground(PALETTE.plantGradient[1], PALETTE.plantGradient[0]);
}

function draw() {
  clear();

  
  //Actual drawing
  //noiseBackground();

  //Draw each node

  if (SAVE_ALL_FRAMES) {
    frameRate(1);
  } else {
    frameRate(12);
  }
  
  
  branches.forEach((branch) =>
    branch.forEach((node) => {
      let branchPoly = branchToPoly(branch);
      let strokeMe =  { lrStroke: branchPoly.lrStroke, strokeFill: node.color }
      mPoly(branchPoly.bounds, strokeMe, branchPoly.size);
    })
  );
  produceNodes.forEach((produceNode) => {
    let stemPoly = stemToPoly(produceNode.stem);
    let producePoint = stemPoly.stemEnd;
    
    mPoly(stemPoly.bounds, { strokeFill: produceNode.stem.color, lrStroke: stemPoly.lrStroke}, stemPoly.size);
    if (produceNode.type == "fruit") {
      
      mEllipse(producePoint.x, producePoint.y, produceNode.size, produceNode.size, {
        foregroundFill: produceNode.color,
        strokeFill: [produceNode.color[0], produceNode.color[1] * 2, produceNode.color[2]/ 2]
      });
      let miniLeafPoint = movev(producePoint, produceNode.stem.angle, -produceNode.size/2);
      mEllipse(miniLeafPoint.x, miniLeafPoint.y, 2, 3, {
        foregroundFill: produceNode.stem.color,
        strokeFill: [produceNode.stem.color[0], produceNode.stem.color[1] / 2, produceNode.stem.color[2] /2]
      });
    } else {
      mPoly(leafToPoly(producePoint, produceNode), {
        strokeFill: produceNode.color,
        foregroundFill: [produceNode.color[0], produceNode.color[1] ,  produceNode.color[2], 30],
      });
    }
  });

  //Do the next one
  plant();

  // background(180, 50, 50);
  
  //background(PALETTE.background);
  
  let ground = [cv(w * 0.1, initNode.y), cv(w * 0.9, initNode.y)];
  mPoly(ground, {strokeFill: "gray"});
  // fill("brown");
  // noStroke();
  // rect(initNode.x - 100/2, initNode.y, 100, 75);
  drawCanvases();
  if (SAVE_ALL_FRAMES) saveFrame();

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
      nextNode.angle += (nextNode.angle > -PI / 2 ? 1 : -1) * CURVE_ANGLE(node);
    } else {
      nextNode.angle += (nextNode.angle > -PI / 2 ? 1 : -1) * CURVE_ANGLE(node); //TODO: Gravity
    }
  }
  nextNode.thickness = nextNode.thickness - THICKNESS_STEP;

  const wobbleAngle = WOBBLE_ANGLE(node);
  nextNode.angle += rnd(-wobbleAngle, wobbleAngle);
  //nextNode.thickness = max(initNode.thickness/2, nextNode.thickness  - THICKNESS_STEP);
  return nextNode;
}
function branchNode(node, branchNum) {
  
  let nextDepth = node.depth + 1;
  let shouldBecomeSucker = node.depth == 0 && rnd() > 0.99;
  if (shouldBecomeSucker) nextDepth = 0;
  let nextNode = {
    index: 0,
    depth: nextDepth,
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
    let isFruit = rnd() <= FRUIT_PROB; 
    nextNode.produces = isFruit ? "fruit" : "leaf";
    if (isFruit) {
      nextNode.tomatoColor = PALETTE.tomato[floor(rnd(0,PALETTE.tomato.length))];
    }
    // if (isFruit) nextNode.color = "red"
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
      height: PRODUCE_INIT_SIZE['stem'] / 2,
      thickness: branchNode.thickness,
      color: branchNode.color
    };
  } else {
    const branchAngle = rn(0.95, 1.05) * BRANCH_ANGLES[2];
    let angle = produceNumber % 2 == 0 ? branchNode.angle +branchAngle : branchNode.angle - branchAngle;
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

  let produceColor = "white";
  let size =  PRODUCE_INIT_SIZE[branchNode.produces];
  if (branchNode.produces == "leaf" )  {
    produceColor =  rndArr(PALETTE.leaves);
    size = size * map(branchNode.thickness, INIT_THICKNESS * THICKNESS_STEP, MIN_THICKNESS, 1, 0.8);
  } else {
    produceColor = branchNode.tomatoColor || PALETTE.tomato[0];
    size = size * map(branchNode.thickness, INIT_THICKNESS * THICKNESS_STEP, MIN_THICKNESS, 1.1, 0.9);
  }
  
  let produceNode = {
    size: size,
    type: branchNode.produces,
    color: produceColor,
    stem: stem,
  };
  return produceNode;
}

function growProduce(produceNode) {
  // let maxSize = PRODUCE_MAX_SIZES[produceNode.type](produceNode);
  // let sizeStep = PRODUCE_STEPS[produceNode.type];
  // if (produceNode.size < maxSize) {
  //   produceNode.size += sizeStep;
  // }
  // //TODO: SHOULD STEM GROW? NAH.
  // if (produceNode.type == "fruit") produceNode.stem.height = produceNode.size;
  // if (produceNode.stem.height <= PRODUCE_MAX_SIZES['stem'](produceNode)) {
  //   produceNode.stem.height += STEM_LENGTH_STEP;
  // }
    
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

  let numSteps = 4;
  let maxWidth = produceNode.size ;
  let step = produceNode.size / numSteps;

  let lpoints =[]; 
  let rpoints = [];
  
  let currentPoint = leafStart;
  for (let i= 0; i< numSteps ; i++) {
    let x= i/numSteps;
    
    //let width = maxWidth * (1-x);

    //https://www.desmos.com/calculator/dobb44f84y
    let width = maxWidth * sin(PI*x/2) * (1-x);

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

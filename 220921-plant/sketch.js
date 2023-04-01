

let w = 500;
let h = 500;

let curveAngle = 0.01;
let thicknessStep = 0.2;
let MAX_BRANCH_DEPTH = 1;
let initNode = { x: w / 2, y: h - 20, angle: -PI / 2, thickness: 20, height: 10, depth: 0, index: 0 };
let branches = [[initNode]];

function setup() {

  setupCanvases(w,h)  
  if (DEBUG) frameRate(1);
}

function draw() {

  
  clear();
  
  

  //Actual drawing 
  // gradientBackground([50, 50,50], [100, 100,100]);
  noiseBackground();

  //Draw each node
  branches.forEach((branch) => branch.forEach((node) => {
    let branchPoly = plantToPoly(branch);
    mPoly(branchPoly.bounds, { lrStroke: branchPoly.lrStroke }, branchPoly.size);
  }));

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
      if (latestNode.depth < MAX_BRANCH_DEPTH && Math.random() > 0.95) {
        newBranches.push(branchNode(latestNode));
      }
    } else {
      console.log("Branch culled" , i, latestNode);
      latestNode.culled = true;
    }
  }
  branches.push(...newBranches);
  
}

function plantToPoly(branch) {

  let l = [];
  let r = [];
  let rl = 0;
  for (let i =0 ; i<branch.length; i++) {
    let n = branch[i];
    //TODO FIX THIS!
    let lp = translatev(cv(n.x, n.y), n.angle + PI/2, 0.5 * n.thickness);
    l.push(lp);

    let rp =  translatev(cv(n.x, n.y), n.angle -PI/2, 0.5 * n.thickness);
    r.unshift(rp);
    rl += 2* n.y;
    if (i == 0 || i == branch.length- 1) rl += n.thickness
  }
  return {bounds: [...l, ...r], lrStroke: {l: l, r: r}, size: rl};
}

function inBounds(node) {
  return node.x < w && node.x > 0 && node.y < h && node.y > 0;
}

function growNode(node) {
  let nextNode = {...node};
  let nextP = translatev(cv(node.x, node.y), node.angle, node.height);
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
  // nextNode.angle = PI/4;
  return [nextNode];
}
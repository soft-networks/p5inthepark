
function mRect(x1,y1,w,h) {
  mL(x1, y1, x1 + w, y1);
  mL(x1 + w, y1, x1 +w , y1 + h);
  mL(x1 + w, y1 + h, x1, y1 + h );
  mL(x1, y1+h, x1, y1);
}
function mEllipse(x0,y0,w,h) {

  let step = TAU/10;
  for (let t = 0; t< TAU; t+= step) {
    let x1 = x0 + w/2 * cos(t)
    let y1 = y0 + h/2 * sin(t)    
    
    let x2 = x0 + w/2 * cos(t + step);
    let y2 = y0 + h/2 * sin(t + step);

    strokeWeight(1);
    mL(x1,y1,x2,y2);
  }
  
}
function mTri(x1,y1,x2,y2,x3,y3) {
  mL(x1,y1,x2,y2);
  mL(x2,y2,x3,y3);
  mL(x3,y3,x1,y1);
}
function mL(x1,y1,x2,y2) {

  let l = dist(x1,y1,x2,y2);
  let p1 = createVector(x1,y1);
  let p2 = createVector(x2,y2);
  let step = 1/10;

  let c1 = p1;
  let covered = step;

  do {
    c2 = p5.Vector.lerp(p1, p2, covered);

    strokeWeight(prn.rn(1,3));
    line(c1.x, c1.y, c2.x, c2.y);

    c1 = c2;
    covered += step;
  } while (covered < 1);
  
}



function testDraw() {
  push();
  translate(100,100);
  mL(0,0,50,50);

  translate(75,0);
  mRect(0,0,50,50);

  translate(75,0);
  mEllipse(25,25,50,50);

  translate(75,0);
  mTri(0,0, 50,50, 0, 50);
  pop();

}
function keyPressed() {
  if (key == "s") {
    let d = new Date();
    console.log("saving");
    saveCanvas("park" + window.location.pathname + ":" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds(), "png");
  }
};
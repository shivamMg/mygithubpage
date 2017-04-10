var ele = document.getElementById("fluorine");
var clientWidth = window.innerWidth || document.body.clientWidth;
var centerX = clientWidth / 2;
var centerY = 220 / 2;
var INNERORBITRADIUS = 50;
var OUTERORBITRADIUS = 80;
var NUCLEUSRADIUS = 30;
// Angle between electrons in outer orbit
var ANGLE = (Math.PI * 2) / 7;
var DEGREE = Math.PI / 180;
var two = new Two({ width: clientWidth, height: 220 }).appendTo(ele);


// 9 Electrons
var outerElectrons = two.makeGroup();
var innerElectrons = two.makeGroup();
var electronCenters = [
  [0, -INNERORBITRADIUS],
  [0, INNERORBITRADIUS],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 1), -OUTERORBITRADIUS * Math.cos(ANGLE * 1)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 2), -OUTERORBITRADIUS * Math.cos(ANGLE * 2)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 3), -OUTERORBITRADIUS * Math.cos(ANGLE * 3)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 4), -OUTERORBITRADIUS * Math.cos(ANGLE * 4)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 5), -OUTERORBITRADIUS * Math.cos(ANGLE * 5)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 6), -OUTERORBITRADIUS * Math.cos(ANGLE * 6)],
  [OUTERORBITRADIUS * Math.sin(ANGLE * 7), -OUTERORBITRADIUS * Math.cos(ANGLE * 7)],
];

for (var i = 0; i < 2; i++) {
  var e = two.makeCircle(electronCenters[i][0], electronCenters[i][1], 6);
  e.fill = "#aaa";
  innerElectrons.add(e);
}

for (var i = 2; i < electronCenters.length; i++) {
  var e = two.makeCircle(electronCenters[i][0], electronCenters[i][1], 6);
  e.fill = "#aaa";
  outerElectrons.add(e);
}

outerElectrons.translation.set(centerX, centerY);
innerElectrons.translation.set(centerX, centerY);

// 9 Protons + 10 Neutrons
var nucleonCenters = [
  ["p", 6, -16],
  ["n", -6, -16],
  ["n", 16, -6],
  ["p", 16, 6],
  ["n", 6, 16],
  ["p", -6, 16],
  ["n", -16, -6],
  ["p", -16, 6],

  ["p", 0, 10],
  ["p", -10, 0],
  ["p", 10, 0],
  ["p", 0, -10],

  ["n", -10, -10],
  ["n", 10, -10],
  ["n", -10, 10],
  ["n", 10, 10],
];

var nucleons = [];
var nucleonsGrp = two.makeGroup();
for (var i = 0; i < nucleonCenters.length; i++) {
  var nucleon = two.makeCircle(nucleonCenters[i][1], nucleonCenters[i][2], 6);
  if (nucleonCenters[i][0] == "p") {
    nucleon.fill = "#bcbcbc";
    nucleon.linewidth = 0.5;
    nucleon.stroke = "#848484";
  } else {
    nucleon.fill = "#1111ff";
    nucleon.linewidth = 0.5;
    nucleon.stroke = "#424242";
  }
  nucleonsGrp.add(nucleon);
  nucleons.push(nucleon);
}

// Center Nucleon (Neutron)
var n = two.makeCircle(0, 0, 6);
n.fill = "#1111ff";
n.linewidth = 0;
nucleonsGrp.add(n);

nucleonsGrp.translation.set(centerX, centerY);

// Overlay to bind functions to
var nucleonOverlay = two.makeCircle(centerX, centerY, NUCLEUSRADIUS);
nucleonOverlay.fill = "transparent";
nucleonOverlay.linewidth = 0;

two.update();

// Animate electrons
two.bind("update", function(frameCount) {
  innerElectrons.rotation -= DEGREE;
  outerElectrons.rotation += DEGREE;
}).play();

// Used for binding events
var overlayEle = document.getElementById(nucleonOverlay.id);

// Used in normalizing displacement
var SLICES = 20;

// Displacement for nucleons toward the nucleus perimeter
var dispXY = [];
for (var i = 0; i < nucleonCenters.length; i++) {
  var nx = nucleonCenters[i][1] + centerX;
  var ny = nucleonCenters[i][2] + centerY;
  var d = Math.sqrt(Math.pow(centerX - nx, 2) + Math.pow(centerY - ny, 2));
  var sinT = (nx - centerX) / d;
  var cosT = (ny - centerY) / d;
  var dispX = sinT * (NUCLEUSRADIUS - d);
  var dispY = cosT * (NUCLEUSRADIUS - d);
  // Normalizing for later use
  dispXY.push([dispX / SLICES, dispY / SLICES]);
}

var counterToSlice1 = 1;
function scatterNucleons(frameCount) {
  if (counterToSlice1 > SLICES) {
    two.unbind("update", scatterNucleons);
    return;
  }

  for (var i = 0; i < nucleons.length; i++) {
    nucleons[i].translation.set(
      nucleons[i].translation.x + dispXY[i][0],
      nucleons[i].translation.y + dispXY[i][1]
    );
  }
  counterToSlice1++;
}

overlayEle.onmouseenter = function() {
  two.bind("update", scatterNucleons).play();
}

var counterToSlice2 = 1;
overlayEle.onmouseleave = function() {
  two.unbind("update", scatterNucleons);
  counterToSlice1 = 1;

  var sliceArray = [];
  for (var i = 0; i < nucleons.length; i++) {
    var dispX = (nucleons[i].translation.x - nucleonCenters[i][1]) / SLICES;
    var dispY = (nucleons[i].translation.y - nucleonCenters[i][2]) / SLICES;
    sliceArray.push([dispX, dispY]);
  }

  function convergeNucleons() {
    if (counterToSlice2 > SLICES) {
      two.unbind("update", convergeNucleons);
      counterToSlice2 = 1;
      return;
    }

    for (var i = 0; i < nucleons.length; i++) {
      nucleons[i].translation.set(
        nucleons[i].translation.x - sliceArray[i][0],
        nucleons[i].translation.y - sliceArray[i][1]
      );
    }
    counterToSlice2++;
  }
  two.bind("update", convergeNucleons);
}

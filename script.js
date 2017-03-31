var s = Snap("#fluorine");
var clientWidth = window.innerWidth || document.body.clientWidth;
var centerX = clientWidth / 2;
var centerY = 110;
var innerOrbitRadius = 50;
var outerOrbitRadius = 80;
var nucleusRadius = 30;
var electrons = [];
var nucleons = [];

// 9 Electrons
// Angle between electrons in outer orbit
var ANGLE = (Math.PI * 2) / 7;
var electronCenters = [
  [centerX, centerY - innerOrbitRadius],
  [centerX, centerY + innerOrbitRadius],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 1), centerY - outerOrbitRadius * Math.cos(ANGLE * 1)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 2), centerY - outerOrbitRadius * Math.cos(ANGLE * 2)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 3), centerY - outerOrbitRadius * Math.cos(ANGLE * 3)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 4), centerY - outerOrbitRadius * Math.cos(ANGLE * 4)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 5), centerY - outerOrbitRadius * Math.cos(ANGLE * 5)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 6), centerY - outerOrbitRadius * Math.cos(ANGLE * 6)],
  [centerX + outerOrbitRadius * 1 * Math.sin(ANGLE * 7), centerY - outerOrbitRadius * Math.cos(ANGLE * 7)]
];
for (var i = 0; i < electronCenters.length; i++) {
  var e = s.circle(electronCenters[i][0], electronCenters[i][1], 6).attr({
    fill: s.gradient("r(0.5, 0.5, 0.5)#aaa-#ccc")
  });
  electrons.push(e);
}

var nucleonCenters = [
  // 9 Protons + 10 Neutrons
  ["p", centerX + 6, centerY - 16],
  ["n", centerX - 6, centerY - 16],
  ["n", centerX + 16, centerY - 6],
  ["p", centerX + 16, centerY + 6],
  ["n", centerX + 6, centerY + 16],
  ["p", centerX - 6, centerY + 16],
  ["n", centerX - 16, centerY - 6],
  ["p", centerX - 16, centerY + 6],

  ["p", centerX, centerY + 10],
  ["p", centerX - 10, centerY],
  ["p", centerX + 10, centerY],
  ["p", centerX, centerY - 10],

  ["n", centerX - 10, centerY - 10],
  ["n", centerX + 10, centerY - 10],
  ["n", centerX - 10, centerY + 10],
  ["n", centerX + 10, centerY + 10],
];

for (var i = 0; i < nucleonCenters.length; i++) {
  if (nucleonCenters[i][0] == "p") {
    var p = s.circle(nucleonCenters[i][1], nucleonCenters[i][2], 6).attr({
      fill: s.gradient("r(0.5, 0.5, 0.5)#ccc-#aaa"),
      strokeWidth: 1
    });
    nucleons.push(p);
  } else {
    var n = s.circle(nucleonCenters[i][1], nucleonCenters[i][2], 6).attr({
      fill: s.gradient("r(0.5, 0.5, 0.5)#0000fc-#0000ce"),
      stroke: "#0101bc",
      strokeWidth: 1
    });
    nucleons.push(n);
  }
}

var n = s.circle(centerX, centerY, 6).attr({
  fill: s.gradient("r(0.5, 0.5, 0.5)#0000fc-#0101bc"),
  stroke: "#0101bc",
  strokeWidth: 1
});

// Displacement of nucleon toward nucleon perimeter
var dispXY = [];
for (var i = 0; i < nucleonCenters.length; i++) {
  var nx = nucleonCenters[i][1];
  var ny = nucleonCenters[i][2];
  var d = Math.sqrt(Math.pow(centerX - nx, 2) + Math.pow(centerY - ny, 2));
  var sinT = (nx - centerX) / d;
  var cosT = (ny - centerY) / d;
  var dispX = sinT * (nucleusRadius - d);
  var dispY = cosT * (nucleusRadius - d);
  dispXY.push([dispX, dispY]);
}

function animateElectron(electron, duration, clockwise) {
  electron.transform("r0 " + [centerX, centerY]);
  electron.animate({ transform: ((clockwise) ? "r360 " : "r-360 ") + [centerX, centerY] }, duration, mina.linear, function() {
    animateElectron(electron, duration, clockwise);
  });
}

function animateElectrons() {
  for (var i = 0; i < 2; i++) {
    animateElectron(electrons[i], 5000, false);
  }
  for (var i = 2; i < electrons.length; i++) {
    animateElectron(electrons[i], 6000, true);
  }
}

function scatterNucleons() {
  for (var i = 0; i < nucleons.length; i++) {
    nucleons[i].animate({ transform: "t" + dispXY[i] }, 200, mina.linear);
  }
}

function convergeNucleons() {
  for (var i = 0; i < nucleons.length; i++) {
    var nx = nucleonCenters[i][1];
    var ny = nucleonCenters[i][2];
    var x = nucleons[i].node.cx.baseVal.value;
    var y = nucleons[i].node.cy.baseVal.value;

    nucleons[i].animate({ transform: "t" + [x - nx, y - ny] }, 200, mina.linear);
  }
}

animateElectrons();
var nucleus = s.circle(centerX, centerY, nucleusRadius).attr({
    fill: "transparent",
    stroke: "none"
  });
nucleus.mouseover(scatterNucleons);
nucleus.mouseout(convergeNucleons);

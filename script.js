var s = Snap("#fluorine");
var clientWidth = window.innerWidth || document.body.clientWidth;
var centerX = clientWidth / 2;
var centerY = 140;
var innerOrbitRadius = 70;
var outerOrbitRadius = 100;
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
    fill: s.gradient("r(0.5, 0.5, 0.5)#0000fc-#0101bc")
  });
  electrons.push(e);
}

// 9 Protons
var protonCenters = [
  [centerX, centerY - 10],
  [centerX, centerY + 10],
  [centerX - 10, centerY],
  [centerX + 10, centerY],
  [centerX + 15, centerY - 15],
  [centerX + 20, centerY + 5],
  [centerX + 18, centerY + 12],
  [centerX - 5, centerY + 18],
  [centerX - 18, centerY - 4],
];
for (var i = 0; i < protonCenters.length; i++) {
  var p = s.circle(protonCenters[i][0], protonCenters[i][1], 6).attr({
    fill: s.gradient("r(0.5, 0.5, 0.5)#3e2723-#261614"),
  });
  nucleons.push(p);
}

// 10 Neutrons
var neutronCenters = [
  [centerX - 10, centerY - 10],
  [centerX + 10, centerY - 10],
  [centerX - 10, centerY + 10],
  [centerX + 10, centerY + 10],
  [centerX + 5, centerY - 16],
  [centerX + 20, centerY - 5],
  [centerX - 5, centerY - 18],
  [centerX - 18, centerY + 6],
  [centerX + 5, centerY + 18],
];
var n = s.circle(centerX, centerY, 6).attr({
  fill: s.gradient("r(0.5, 0.5, 0.5)#514f4f-#1c1818")
});

for (var i = 0; i < neutronCenters.length; i++) {
  var n = s.circle(neutronCenters[i][0], neutronCenters[i][1], 6).attr({
    fill: s.gradient("r(0.5, 0.5, 0.5)#514f4f-#1c1818")
  });
  nucleons.push(n);
}

// Save all Nucleon centers
var nucleonCenters = protonCenters.concat(neutronCenters);
// Displacement of nucleon toward nucleon perimeter
var dispXY = [];
for (var i = 0; i < nucleonCenters.length; i++) {
  var nx = nucleonCenters[i][0];
  var ny = nucleonCenters[i][1];
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
    var nx = nucleonCenters[i][0];
    var ny = nucleonCenters[i][1];
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

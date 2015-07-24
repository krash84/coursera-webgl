"use strict";

var gl;
var points = [];
var program;
var vertices = [
  vec2(-0.5, -0.5),
  vec2(0, 0.5) ,
  vec2(0.5, -0.5)
];
var bufferId;


window.onload = init;

function init() {
  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  showTriangle();

}

function triangle(a, b, c) {
  points.push(a, b, c);
}

function divideTriangle(a, b, c, count) {
  if (count === 0 || count < 0) {
    triangle(a, b, c);
  } else {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);
    --count;

    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
    divideTriangle(ab, bc, ac, count);
  }
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

function showTriangle(e) {
  points = [];

  var NumTimesToSubdivide = parseInt(document.getElementById('nsubdivs').value);
  if (typeof NumTimesToSubdivide == 'undefined') {
    NumTimesToSubdivide = 5;
  }
  console.log("nsubdivs: ", NumTimesToSubdivide);

  var theta = parseFloat(document.getElementById('rotangle').value);
  if (typeof theta == 'undefined') {
    theta = 60.0;
  }

  divideTriangle(vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

  var thetaLoc = gl.getUniformLocation(program, "theta");
  gl.uniform1f(thetaLoc, theta);

  // Load the data into the GPU
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
}
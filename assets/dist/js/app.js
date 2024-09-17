window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas;
var context;
var canvasWidth = 400;
var canvasHeight = 400;
var radius = 200; // شعاع دایره
var centerX = canvasWidth / 2;
var centerY = canvasHeight / 2;
var marginLeft = 0;
var marginBottom = 0;
var colorOffset = 0;

function draw() {
  canvas = document.getElementById("canv");
  context = canvas.getContext("2d");
  setInterval(update, 60);
}

// نویز
function noise(x, y) {
  return (Math.sin(y * 0.172) + Math.sin((x + (y * 0.347)) * 0.2)) * 2.55;
}

// تابع به‌روزرسانی
function update() {
  context.clearRect(0, 0, canvasWidth, canvasHeight); // پاک کردن بوم
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.clip();
  context.fill();

  marginBottom += 0.5;
  marginLeft += 1;
  colorOffset -= 0.5;
  context.lineWidth = 0.6;

  var hillCount = 1;
  var shiftLeft = 1;
  var shiftBottom = 1;
  var point2D = [0, 0];

  for (var z = 100; z >= 10; z--) {
    context.beginPath();
    var edge = z * 2.25;
    var zPos = (z * 90) - shiftBottom;
    var isVisible = false;
    context.strokeStyle = "hsla(" + (colorOffset % 360) + ",100%,50%,1)";
    var isFirstPoint = true;

    for (var x = -edge; x <= hillCount + edge; x++) {
      var horizon = noise(x + marginLeft, marginBottom + z) * 0.5;
      var xPos = (x * 90) - shiftLeft;
      var yPos = (horizon - 15) * 90 + 50;
      point2D = convert2DTo3D(xPos, yPos, zPos);

      // Ensure the waves are uniformly spread around the circle
      point2D = applyCircleMask(point2D[0], point2D[1], centerX, centerY, radius);

      if (point2D[1] > canvasHeight) {
        point2D[1] = canvasHeight;
      } else if (point2D[1] < 0) {
        point2D[1] = 0;
      } else {
        isVisible = true;
      }

      if (isFirstPoint) {
        context.moveTo(point2D[0], point2D[1]);
        isFirstPoint = false;
      } else {
        context.lineTo(point2D[0], point2D[1]);
      }
    }

    if (isVisible) {
      context.stroke();
    }
  }

  context.restore();
}

function convert2DTo3D(x3D, y3D, z3D) {
  var distance = 460;
  var halfWidth = canvasWidth / 2;
  var halfHeight = canvasHeight / 2;
  var scale = distance / (distance + z3D);
  var aspectRatio = canvasWidth / canvasHeight;
  var x2D = ((x3D - halfWidth) * scale) + halfWidth;
  var y2D = ((y3D - halfHeight) * scale * aspectRatio) + halfHeight - (z3D * 0.01) + 350;
  return [x2D, y2D];
}

function applyCircleMask(x, y, centerX, centerY, radius) {
  var dx = x - centerX;
  var dy = y - centerY;
  var distance = Math.sqrt(dx * dx + dy * dy);
  if (distance > radius) {
    var angle = Math.atan2(dy, dx);
    x = centerX + radius * Math.cos(angle);
    y = centerY + radius * Math.sin(angle);
  }
  return [x, y];
}

window.requestAnimFrame(draw);

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
function random(min,max, options = {round: true, toFixed: false}) {
  let num = Math.random()*(max-min) + min
  if(options.round) num = Math.round(num)
  if(options.toFixed) num = +num.toFixed(options.toFixed)
  return +num
}
function pickRandom(values) {
  let index = random(0,values.length-1)
  return +values[index]
}
function rotateAroundPoint(pos, center, rot) {
  var sin = Math.sin(rot);
  var cos = Math.cos(rot);
  var newPos = {
    x: (cos * (pos.x - center.x)) + (sin * (pos.y - center.y)) + center.x,
    y: (cos * (pos.y - center.y)) - (sin * (pos.x - center.x)) + center.y
  }
  return newPos;
}
function vectorRotate(x, y, rot) {
  var sin = Math.sin(rot);
  var cos = Math.cos(rot);
  var newPos = {
    x: (cos * x) + (sin * y),
    y: (cos * y) - (sin * x)
  }
  return newPos;
}
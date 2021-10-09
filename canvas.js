
var canvasBg = document.getElementById('canvas-bg')
var canvasText = document.getElementById('canvas-text')
var canvasFg = document.getElementById('canvas-fg')

var canvases = []
canvases.push(canvasBg,canvasText,canvasFg)
canvases.forEach(canvas => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})
let debug = true;

const PI = Math.PI
let canvasBg = document.getElementById('canvas-bg')
let canvasText = document.getElementById('canvas-text')
let canvasFg = document.getElementById('canvas-fg')

const bctx = canvasBg.getContext('2d')
const tctx = canvasText.getContext('2d')
const fctx = canvasFg.getContext('2d')

let contexts = []
contexts.push(bctx,tctx,fctx)

let canvases = []
canvases.push(canvasBg,canvasText,canvasFg)
canvases.forEach(canvas => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

window.onresize = ()=> {
  canvases.forEach(canvas => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

//input related variables
let mousedown = null
let mouseStart = null



let globalTranslate = {
  x: 0,
  y: 0,
}

let bgTransMult = 0.5
let tTransMult = 1
let fgTransMult = 2

document.addEventListener('keydown', function (e) {
  if(e.code == 'Digit1') debug = !debug
},false)

canvasText.addEventListener('mousedown', function (e) {
  mousedown = true
  mouseStart = {
    x: e.clientX,
    y: e.clientY,
  }
  
},false)

document.addEventListener('mouseup', function (e) {
  mousedown = false

},false)

canvasText.addEventListener('mousemove', function (e) {
  if(!mousedown) return
  moveCanvas(e)
  mouseStart = {
    x: e.clientX,
    y: e.clientY,
  }
},false)

function moveCanvas(e) {
  let dx = e.clientX - mouseStart.x
  let dy = e.clientY - mouseStart.y

  bctx.translate(dx * bgTransMult,  dy * bgTransMult)
  tctx.translate(dx * tTransMult,   dy * tTransMult)
  fctx.translate(dx * fgTransMult,  dy * fgTransMult)

  globalTranslate.x += dx
  globalTranslate.y += dy

}


function draw() {
  clearCtx(bctx,bgTransMult)
  clearCtx(tctx,tTransMult)
  clearCtx(fctx,fgTransMult)

  checkGrid()

  drawBg(bctx,bgTransMult)
  drawStars(bctx,bgTransMult)

  if(debug) {
    drawBgSquare()
    drawSquare()
    drawFgSquare()
    
    // outlineViewport(bctx,bgTransMult)
    // outlineViewport(tctx,tTransMult)
    // outlineViewport(fctx,fgTransMult)
  }
  
  drawTextTest(tctx)
  

  requestAnimationFrame(draw)
  
}
//debug functions
function drawSquare() {
  tctx.fillStyle = 'hsl(224,85%,80%)'
  tctx.fillRect(300,300,200,200)
}
function drawBgSquare() {
  bctx.fillStyle = 'hsl(235,20%,30%)'
  bctx.fillRect(500,500,200,200)
}
function drawFgSquare() {
  fctx.fillStyle = 'hsl(5,30%,50%)'
  fctx.fillRect(700,700,200,200)
}



function drawTextTest(ctx) {
  ctx.fillStyle = 'hsl(0,0%,95%)'
  ctx.font = '16px Arial'
  ctx.fillText(`Deep in the shady sadness of a vale`,300,300)
  ctx.fillText(`Far sunken from the healthy breath of morn,`,300,320)
  ctx.fillText(`Far from the fiery noon, and eve's one star,`,300,340)
  ctx.fillText(`Sat gray-hair'd Saturn, quiet as a stone,`,300,360)

  ctx.fillText(`globalTranslate x:${globalTranslate.x} y:${globalTranslate.y}`,300,520)

}
function clearCtx(ctx,mult) {
  ctx.clearRect(-globalTranslate.x * mult,-globalTranslate.y * mult,window.innerWidth,window.innerHeight)
}

function outlineViewport(ctx,mult) {
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = 'orange'
  ctx.lineWidth = '3px'
  ctx.strokeRect(-globalTranslate.x * mult + 3, -globalTranslate.y * mult + 3,window.innerWidth - 6,window.innerHeight - 6)
  ctx.restore()
}

function drawBg(ctx,mult) {
  ctx.fillStyle = 'hsl(235,25%,7%)'
  ctx.fillRect(-globalTranslate.x * mult, -globalTranslate.y * mult,window.innerWidth,window.innerHeight)
}

let starProperties = {
  density: 20, // per grid cell
  colors: ['hsl(224,25%,40%)','yellow','orange','magenta'],
  radius: 1.8,
  radiusRange: 1,
}

let stargrid = {
  cellsize: 200,
  originX: 0,
  originY: 0,
}
let stars = [] //the actual array of Star objects which will be rendered
let gridcells = []
class Gridcell {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.populated = false
  }
}

class Star {
  constructor(x,y,radius,color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.gridpos = {
      x: Math.floor(this.x / stargrid.cellsize),
      y: Math.floor(this.y / stargrid.cellsize),
    }
  }
  draw(ctx) {
    ctx.moveTo(this.x,this.y)
    ctx.arc(this.x,this.y,this.radius,0,PI*2,false)
  }
}

function drawStars(ctx,mult) {
  if(stars == []) return
  //filter for visible stars
  let starsVisible = stars.filter(star => 
    star.x > -globalTranslate.x * mult - star.radius && 
    star.x < -globalTranslate.x * mult + star.radius + window.innerWidth &&
    star.y > -globalTranslate.y * mult - star.radius && 
    star.y < -globalTranslate.y * mult + star.radius + window.innerHeight
  )
  ctx.save()
  ctx.filter = 'blur(0.5px)'
  starProperties.colors.forEach(color => {
    let matchingStars = starsVisible.filter(star => star.color == color)
    if(!matchingStars) return

    //begin path
    ctx.beginPath()
    matchingStars.forEach(star => {
      star.draw(ctx)
    })
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
  })
  
  ctx.restore()
}
//split star drawing into passes based on the number of total possible colors

function checkGrid() {
  
}

function initGridcells() {
  for (let w = 0; w < window.innerWidth / stargrid.cellsize + 1 ; w++) {
    for (let h = 0; h < window.innerHeight / stargrid.cellsize + 1 ; h++) {
      gridcells.push(new Gridcell(w,h))
      
    }
  }
}

function populateCell(cell = {x: 0, y: 0}) {

 for (let i = 0; i < starProperties.density; i++) {
   generateStar(cell)
 }

}

function generateStar(cell) {
  let x = cell.x * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let y = cell.y * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let radius = starProperties.radius + (Math.random()*starProperties.radiusRange - starProperties.radiusRange/2)
  stars.push(new Star(
    x,
    y,
    radius,
    starProperties.colors[0],
  ))
}


function loadAsset(asset) {
  // distance check
  let distFromViewport = {
    x:  asset.x,
    y:  asset.y,
  }
}

initGridcells()

//issue nastiness and unclean garbage code
gridcells.forEach(cell => {
  populateCell(cell)
})
populateCell()
draw()

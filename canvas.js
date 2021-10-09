let debug = true;
const PI = Math.PI

let queryInput = document.querySelector('#query-input')
let labelX = document.querySelector('#real-x-value')
let labelY = document.querySelector('#real-y-value')
let sliderX = document.querySelector('#x-value-slider')
let sliderY = document.querySelector('#y-value-slider')
let bothAxisCheckbox = document.querySelector('#both-axis-checkbox')
let selectedObject;
let queryBox = document.querySelector('#query-box')
let objects = []; //all complexi-er objects will be there

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

window.onresize = () => {
  canvases.forEach(canvas => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
  cw = window.innerWidth
  ch = window.innerHeight
}

let cw = window.innerWidth
let ch = window.innerHeight

//input related variables
let mousedown = false
let mouseStart = null

let changingXforSelected = false
let changingYforSelected = false
let changeBothAxis = false
let globalTranslate = {
  x: 0,
  y: 0,
}

let bgTransMult = 0.5
let tTransMult = 1
let fgTransMult = 2

let textColor = 'white'
let lineHeight = 30
let font = '16px Arial'

let poem = {
  stanza1: [
    `Deep in the shady sadness of a vale`,
    `Far sunken from the healthy breath of morn,`,
    `Far from the fiery noon, and eve's one star,`,
    `Sat gray-hair'd Saturn, quiet as a stone,`,
  ],
}

bothAxisCheckbox.addEventListener('change', function() {
  changeBothAxis = !changeBothAxis
})

document.addEventListener('keydown', function (e) {
  if(e.code == 'Digit1') debug = !debug
  if(e.code == 'Backquote') showControls()
},false)

document.addEventListener('mousemove', function(e) {

  if(selectedObject) {
    if(changingXforSelected) {
      let dx = e.clientX - mouseStart.x
      selectedObject.x += dx
      labelX.innerHTML = selectedObject.x
      
      if(changeBothAxis) {
        let dy = e.clientY - mouseStart.y
        selectedObject.y += dy
        labelY.innerHTML = selectedObject.y  
      }
      mouseStart = {
        x: e.clientX,
        y: e.clientY,
      }
    }
    if(changingYforSelected) {
      let dy = e.clientY - mouseStart.y
      selectedObject.y += dy
      labelY.innerHTML = selectedObject.y  
      
      if(changeBothAxis) {
        let dx = e.clientX - mouseStart.x
        selectedObject.x += dx
        labelX.innerHTML = selectedObject.x
      }
      mouseStart = {
        x: e.clientX,
        y: e.clientY,
      }
    }
  }

})


queryInput.addEventListener('keydown', function (e) {
  if(e.code == 'Enter' || e.code == 'NumpadEnter') {
    let filter = objects.filter(obj => obj.id == queryInput.value)
    if(filter.length == 0) {
      alert('No object with that id was found.')
      return
    }
    selectedObject = filter[0]
    labelX.innerHTML = selectedObject.x
    labelY.innerHTML = selectedObject.y
    if(selectedObject.x == undefined || selectedObject.y == undefined) console.log('Selected object is missing either X or Y coordinate. pls fix.')
    console.log(selectedObject)
  }
})

sliderX.addEventListener('mousedown', function(e) {
  changingXforSelected = true
  mouseStart = {
    x: e.clientX,
    y: e.clientY,
  }
})

sliderY.addEventListener('mousedown', function(e) {
  changingYforSelected = true
  mouseStart = {
    x: e.clientX,
    y: e.clientY,
  }
})

canvasText.addEventListener('mousedown', function (e) {
  mousedown = true
  mouseStart = {
    x: e.clientX,
    y: e.clientY,
  }
  
},false)

document.addEventListener('mouseup', function (e) {
  mousedown = false
  changingXforSelected = false
  changingYforSelected = false
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

//main draw
function draw() {
  clearCtx(bctx,bgTransMult)
  clearCtx(tctx,tTransMult)
  clearCtx(fctx,fgTransMult)

  populateBorderCells()

  drawBg(bctx,bgTransMult)
  drawStars(bctx,bgTransMult)

  if(debug) {
    drawBgSquare()
    drawSquare()
    drawFgSquare()
    
    // outlineViewport(bctx,bgTransMult)
    // outlineViewport(tctx,tTransMult)
    // outlineViewport(fctx,fgTransMult)
    gridcells.forEach(cell => {
      bctx.save()
      bctx.beginPath()
      bctx.rect(
        cell.x * stargrid.cellsize + 1,
        cell.y * stargrid.cellsize + 1,
        stargrid.cellsize - 1,
        stargrid.cellsize - 1
      )
      if(cell.marked) bctx.strokeStyle = 'red'
      else bctx.strokeStyle = 'blue'
      bctx.lineWidth = 1.5
      bctx.globalAlpha = 0.3
      bctx.stroke()
      if(cell.farcell) {
        bctx.fillStyle = 'red'
        bctx.fill()
      }
      bctx.closePath()
      bctx.restore()
    })
    fctx.font = '12px arial'
    fctx.fillStyle = 'white'
    fctx.fillText(`Viewport offset in grid-cells x: ${vpOffset.x} y: ${vpOffset.y}`, 5 - globalTranslate.x * fgTransMult, 15 - globalTranslate.y * fgTransMult)
    fctx.fillText(`globalTranslate x:${globalTranslate.x} y:${globalTranslate.y}`, 5 - globalTranslate.x * fgTransMult, 30 - globalTranslate.y * fgTransMult)

  }
  
  textObjects.forEach(obj => {
    obj.draw()
  })
  

  requestAnimationFrame(draw)
  
}
//end of main draw


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



function drawPoemTest(ctx) {
  ctx.fillStyle = 'hsl(0,0%,95%)'
  ctx.font = '16px Arial'
  ctx.fillText(`Deep in the shady sadness of a vale`,300,300)
  ctx.fillText(`Far sunken from the healthy breath of morn,`,300,322)
  ctx.fillText(`Far from the fiery noon, and eve's one star,`,300,344)
  ctx.fillText(`Sat gray-hair'd Saturn, quiet as a stone,`,300,366)
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
  colors: ['hsl(224,25%,40%)','hsl(55,60%,45%)','hsl(30,80%,40%)','hsl(330,50%,50%)'],
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
    this.marked = false
    this.farcell = false
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
    this.kill = false
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
  fctx.fillText(`Stars rendered: ${starsVisible.length}`, 5 - globalTranslate.x * fgTransMult, 45 - globalTranslate.y * fgTransMult)
  fctx.fillText(`Stars total: ${stars.length}`, 5 - globalTranslate.x * fgTransMult, 60 - globalTranslate.y * fgTransMult)
}

function generateStar(cell) {
  let x = cell.x * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let y = cell.y * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let radius = starProperties.radius + (Math.random()*starProperties.radiusRange - starProperties.radiusRange/2)
  let color = starProperties.colors[Math.floor(Math.random()*starProperties.colors.length + 0.5)]
  stars.push(new Star(
    x,
    y,
    radius,
    color,
  ))
}



let vpOffset = {x:0,y:0}
let vpOffsetPrev = vpOffset

function populateBorderCells() {
  vpOffset = {
    x: Math.floor(-globalTranslate.x / stargrid.cellsize * bgTransMult),
    y: Math.floor(-globalTranslate.y / stargrid.cellsize * bgTransMult),
  }
  
  if(vpOffset.x == vpOffsetPrev.x && vpOffset.y == vpOffsetPrev.y) {
    return
  }
  
  vpOffsetPrev = vpOffset
  
  let num = 0
  for (let x = vpOffset.x - 2; x < cw/stargrid.cellsize + vpOffset.x + 4; x++) {
    for (let y = vpOffset.y - 2; y < ch/stargrid.cellsize + vpOffset.y + 4; y++) {
      let add = generateCell(x,y)
      num += add
    }
  }
  console.log(`Added ${num} new cells to the grid.`)
  

  let unpopulated = gridcells.filter(
    cell => 
    (
    ( 
      cell.x <= vpOffset.x + 1 && 
      cell.x >= vpOffset.x - 2
    )
    ||
    (
      cell.x >= vpOffset.x + cw/stargrid.cellsize - 1 &&
      cell.x <= vpOffset.x + cw/stargrid.cellsize + 2
    )
    ||
    ( 
      cell.y <= vpOffset.y + 1 && 
      cell.y >= vpOffset.y - 2
    )
    ||
    (
      cell.y >= vpOffset.y + ch/stargrid.cellsize - 1 &&
      cell.y <= vpOffset.y + ch/stargrid.cellsize + 2
    )
    )
    &&
    cell.populated == false
  )

  unpopulated.forEach(cell => {
    populateCell(cell)
  })
  if(debug) console.log(`Cells populated: ${unpopulated.length}`)
}




function generateCell(x,y) {
  let filtered = gridcells.filter(
    cell => 
    cell.x == x && 
    cell.y == y
  )

  if(filtered.length == 0) {
    gridcells.push(new Gridcell(x,y))
    return 1
  } else {
    return 0
  }

}


function initGrid() {
  for (let x = -2; x < window.innerWidth / stargrid.cellsize + 2 ; x++) {
    for (let y = -2; y < window.innerHeight / stargrid.cellsize + 2 ; y++) {
      gridcells.push(new Gridcell(x,y))
    }
  }
  let visible = gridcells.filter(cell => cell.x >= vpOffset.x && cell.x <= cw/stargrid.cellsize + 1)
  visible.forEach(cell=> {
    populateCell(cell)
  })
}

function populateCell(cell = null) {
  if(cell == null || cell.populated) return
  for (let i = 0; i < starProperties.density; i++) {
    generateStar(cell)
  }
  cell.populated = true

}


class TextObject {
  constructor(x,y,text, id = Math.floor(Math.random()*1_000_000_000)) {
    this.x = x
    this.y = y
    this.text = text
    // this.id = Math.floor(Math.random()*1_000_000_000)
    this.id = id
    objects.push(this)
  }
  draw() {
    tctx.fillStyle = textColor
    tctx.font = font
    for (let i = 0; i < this.text.length; i++) {
      tctx.fillText(this.text[i],this.x,this.y + lineHeight*i - lineHeight)
      
    }
  }
}

let textObjects = []
let poemState = 0
textObjects.push(new TextObject(100,200,poem['stanza1'],'tom'))
textObjects.push(new TextObject(100,200,poem['stanza1'],'jerry'))
poemState++


function loadAsset(asset) {
  // distance check
  let distFromViewport = {
    x:  asset.x,
    y:  asset.y,
  }
}

function showControls() {
  queryBox.classList.toggle('hidden')
}

initGrid()

draw()

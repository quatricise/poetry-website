let debug = false;
let graphics = 'medium'
const PI = Math.PI

let queryInput = document.querySelector('#query-input')
//labels
let labelX = document.querySelector('#real-x-value')
let labelY = document.querySelector('#real-y-value')
let labelRot = document.querySelector('#rotation-value')
//sliders
let sliderX = document.querySelector('#x-value-slider')
let sliderY = document.querySelector('#y-value-slider')
let sliderRot = document.querySelector('#rotation-value-slider')
//checkbox
let bothAxisCheckbox = document.querySelector('#both-axis-checkbox')
//variable used to hold the selected object
let selectedObject;
let queryBox = document.querySelector('#query-box')

let changelogContainer = document.querySelector('#changelog')
let viewChangesButton = document.querySelector('#view-changes-btn')
viewChangesButton.addEventListener('click', function() {
  viewChanges()
})
let objects = []; //all complexi-er objects will be there
let initialValues = [];

let canvasBg = document.getElementById('canvas-bg')
let canvasMg = document.getElementById('canvas-mg')
let canvasMg2 = document.getElementById('canvas-mg2')
let canvasText = document.getElementById('canvas-text')
let canvasFg = document.getElementById('canvas-fg')
let canvasFg2 = document.getElementById('canvas-fg2')

const bctx = canvasBg.getContext('2d')
const mctx = canvasMg.getContext('2d')
const m2ctx = canvasMg2.getContext('2d')
const tctx = canvasText.getContext('2d')
const fctx = canvasFg.getContext('2d')
const f2ctx = canvasFg2.getContext('2d')


let bgTransMult = 0.25
let mgTransMult = 0.88
let mg2TransMult = 0.95
let tTransMult = 1
let fgTransMult = 1.5
let fg2TransMult = 2.2


let contexts = []
contexts.push(bctx,mctx,m2ctx,tctx,fctx,f2ctx)

let canvases = []
canvases.push(canvasBg,canvasMg,canvasMg2,canvasText,canvasFg,canvasFg2)
canvases.forEach(canvas => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

let cw = window.innerWidth
let ch = window.innerHeight



window.onresize = () => {
  canvases.forEach(canvas => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
  cw = window.innerWidth
  ch = window.innerHeight
}

let poem = returnPoem();

let assets = {
  stanza1_gray_vale: {
    src: 'assets/stanza1_gray_vale.png'
  },
  stanza8_bg_grass: {
    src: 'assets/stanza8_bg_grass_linework_white.png'
  },
  stanza8_fg_grass: {
    src: 'assets/stanza8_fg_grass_linework_white.png'
  },
  stanza8_waterfall: {
    src: 'assets/stanza8_waterfall_linework_white.png'
  },
  small_ringed_planet: {
    src: 'assets/small_ringed_planet.png'
  },
  small_moon_1: {
    src: 'assets/small_moon_1.png'
  },
  small_asteroid_1: {
    src: 'assets/small_asteroid_1.png'
  },
  small_asteroid_2: {
    src: 'assets/small_asteroid_2.png'
  },
  small_asteroid_2_rot2: {
    src: 'assets/small_asteroid_2_rot2.png'
  },
  small_cloud: {
    src: 'assets/small_cloud.png'
  },
}

//input related variables

//mouse
let mousedown = false
let mouseNow = {
  x: 0,
  y: 0,
}
let mousePrev
let mouseStates = []
let mouseTravel = {
  x: 0,
  y: 0,
}
let mouseParticleEffectRadius = 128;

let changingXforSelected = false
let changingYforSelected = false
let changingRotforSelected = false
let changeBothAxis = false


let globalTranslate = {
  x: 0,
  y: 0,
}

let center = {
  x: -globalTranslate.x + cw/2,
  y: -globalTranslate.y + ch/2,
}

let dragMultiplier = 1

let textColor = 'hsl(0,0%,98%)'
let lineHeight = 35
let mainfont;



//load content 
async function loadFonts() {

  var font1 = new FontFace('andada', 'url(/fonts/andada_pro/AndadaPro-Italic-VariableFont_wght.ttf)');
  await font1.load()

  // Ready to use the font in a canvas context
  console.log('Fonts ready.');
  
  // Add font on the html page
  document.fonts.add(font1);
  
  mainfont = '22px andada';
}
loadFonts()



bothAxisCheckbox.addEventListener('change', function() {
  changeBothAxis = !changeBothAxis
})

document.addEventListener('keydown', function (e) {
  if(e.code == 'Digit1') debug = !debug
  if(e.code == 'Backquote') showControls()
},false)

// document.addEventListener('wheel', processWheelEvents, {passive: true})

// function processWheelEvents(e) { //scroll event listener
//   if(e.deltaY > 0) {
//     contexts.forEach(ctx=> {
//       ctx.scale(1.25,1.25)
//     })
//   }
//   if(e.deltaY < 0) {
//     contexts.forEach(ctx=> {
//       ctx.scale(0.8,0.8)
//     })
//   }
// }

document.addEventListener('mousemove', function(e) {

  if(selectedObject) {
    if(changingXforSelected) {
      let dx = e.clientX - mouseNow.x
      selectedObject.x += dx
      labelX.innerHTML = selectedObject.x
      
      if(changeBothAxis) {
        let dy = e.clientY - mouseNow.y
        selectedObject.y += dy
        labelY.innerHTML = selectedObject.y  
      }

    }
    if(changingYforSelected) {
      let dy = e.clientY - mouseNow.y
      selectedObject.y += dy
      labelY.innerHTML = selectedObject.y  
      
      if(changeBothAxis) {
        let dx = e.clientX - mouseNow.x
        selectedObject.x += dx
        labelX.innerHTML = selectedObject.x
      }
    }
    if(changingRotforSelected) {
        let dx = e.clientX - mouseNow.x
        selectedObject.rotation += dx *PI/180
        labelX.innerHTML = selectedObject.rotation

    }
  }
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
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
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})

sliderY.addEventListener('mousedown', function(e) {
  changingYforSelected = true
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})
sliderRot.addEventListener('mousedown', function(e) {
  changingRotforSelected = true
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})

canvasText.addEventListener('mousedown', function (e) {
  mousedown = true
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
  
},false)

document.addEventListener('mouseup', function (e) {
  mousedown = false
  changingXforSelected = false
  changingYforSelected = false
  changingRotforSelected = false
},false)

canvasText.addEventListener('mousemove', function (e) {
  if(!mousedown) return
  moveCanvas(e)
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
},false)

function moveCanvas(e) {
  let dx = e.clientX - mouseNow.x
  let dy = e.clientY - mouseNow.y
  dx *= dragMultiplier
  dy *= dragMultiplier
  bctx.translate(dx * bgTransMult,  dy * bgTransMult)
  mctx.translate(dx * mgTransMult,  dy * mgTransMult)
  m2ctx.translate(dx * mg2TransMult,  dy * mg2TransMult)
  tctx.translate(dx * tTransMult,   dy * tTransMult)
  fctx.translate(dx * fgTransMult,  dy * fgTransMult)
  f2ctx.translate(dx * fg2TransMult,  dy * fg2TransMult)

  globalTranslate.x += dx
  globalTranslate.y += dy

}




function calcMouseTravel(frame1,frame2) {
  mouseTravel.x = frame2.x - frame1.x
  mouseTravel.y = frame2.y - frame1.y
  if(debug) console.log(`Mouse travelled: x:${mouseTravel.x} y: ${mouseTravel.y}`)
}

//main draw
function draw() {
  clearCtx(bctx,bgTransMult)
  clearCtx(mctx,mgTransMult)
  clearCtx(m2ctx,mg2TransMult)
  clearCtx(tctx,tTransMult)
  clearCtx(fctx,fgTransMult)
  clearCtx(f2ctx,fg2TransMult)


  // update

  mouseStates.push(mouseNow)
  if(mouseStates.length > 1) {
    mousePrev = mouseStates[0]
    if(mouseStates[0] != mouseStates[1]) {
      // console.log('Mouse moved between this and previous frame')
      calcMouseTravel(mouseStates[0],mouseStates[1])
    }
    mouseStates.shift()
  }
  else {
    mouseTravel.x = mouseTravel.y = 0
  }

  center.x = -globalTranslate.x + cw/2
  center.y = -globalTranslate.y + ch/2
    
  populateBorderCells()

  particleGens.forEach(gen => {
    gen.update()
  })
  particles.forEach(particle=> {
    particle.update()
  })

  // draw

  drawBg(bctx,bgTransMult)
  drawStars(bctx,bgTransMult)

bctx.save()
bctx.arc(center.x * bgTransMult + (cw/2)*(1- bgTransMult),center.y * bgTransMult + (ch/2)*(1- bgTransMult), 20,0,PI*2,false)
bctx.fillStyle = 'red'
bctx.fill()
bctx.restore()

  if(debug) {
    // drawBgSquare()
    // drawSquare()
    // drawFgSquare()
    
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

  //render portion of draw
  textObjects.forEach(obj => {
    obj.draw()
  })
  images.forEach(img => {
    img.draw()
  })
  drawParticles(tctx,tTransMult)

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
  ctx.fillStyle = 'hsl(240,17%,7%)'
  ctx.fillRect(-globalTranslate.x * mult, -globalTranslate.y * mult,window.innerWidth,window.innerHeight)
}

let starProperties = {
  density: 20, // per grid cell
  colors: ['hsl(224,25%,20%)','hsl(272,13%,50%)','hsl(320,60%,25%)','hsl(240,23%,28%)'],
  radius: 1.5,
  radiusRange: 0.5,
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
    this.radiusInit = radius
    this.radius = this.radiusInit
    this.color = color
    this.gridpos = {
      x: Math.floor(this.x / stargrid.cellsize),
      y: Math.floor(this.y / stargrid.cellsize),
    }
    this.kill = false
    this.pulseCycleMaxMax = 240
    this.pulseCycleMaxMin = 40
    this.pulseCycleMax = Math.round(Math.random()*(this.pulseCycleMaxMax-this.pulseCycleMaxMin)) + this.pulseCycleMaxMin
    this.pulseCycle = Math.round(Math.random()*this.pulseCycleMax)
  }
  draw(ctx) {
    this.update()
    ctx.moveTo(this.x,this.y)
    ctx.arc(this.x,this.y,this.radius,0,PI*2,false)
  }
  update() { // update pulse cycle
    // this.x += 0.04
    // this.y += 0.04
    this.pulseCycle++
    if(this.pulseCycle > this.pulseCycleMax) {
      this.pulseCycle = -this.pulseCycleMax
    }
    this.radius = this.radiusInit + Math.abs((this.pulseCycle))/(this.pulseCycleMax)
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
  if(graphics == 'high') ctx.filter = 'blur(0.6px)'
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
  if(debug) {
    fctx.fillText(`Stars rendered: ${starsVisible.length}`, 5 - globalTranslate.x * fgTransMult, 45 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Stars total: ${stars.length}`, 5 - globalTranslate.x * fgTransMult, 60 - globalTranslate.y * fgTransMult)
  }
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
  constructor(text,ctx, id = Math.floor(Math.random()*1_000_000_000)) {
    this.x = text[0].x
    this.y = text[0].y
    this.text = text
    this.ctx = ctx
    this.id = id
    objects.push(this)
    initialValues.push({id: this.id, x: this.x, y: this.y})
  }
  draw() {
    this.ctx.save()
    let textdist = Math.hypot(this.x + 100 - center.x,this.y + 50 - center.y) //bodge , okay this is gonna be a classic bodge, the bodgiest of all, just hardcode an offset here, nice
    let segment = 100/Math.min(cw,ch)
    let alpha = 1 - segment*textdist/90 + segment/2
    if(alpha > 0) {
      this.ctx.globalAlpha = alpha
    }
    else {
      this.ctx.globalAlpha = 0
    }

    this.ctx.fillStyle = textColor
    this.ctx.font = mainfont
    for (let i = 1; i < this.text.length; i++) {
      this.ctx.fillText(this.text[i],this.x,this.y + lineHeight*i - lineHeight)
    }
    if(debug) {
      this.ctx.fillText(`Text dist from center: ${textdist}`,this.x,this.y - lineHeight*2)
      this.ctx.fillText(`Alpha value set to: ${1 - segment*textdist/90}`,this.x,this.y - lineHeight*3)
    }
    this.ctx.restore()
  }
}

class Img {
  constructor(x,y,dimX,dimY,rotation = 0,src,ctx, mult, id = Math.floor(Math.random()*1_000_000_000)) {
    this.dimX = dimX
    this.dimY = dimY
    this.x = x
    this.y = y
    this.rotation = rotation *PI/180 // provide this in deg, convert to radians here
    this.img = new Image()
    this.img.src = src
    this.ctx = ctx
    this.mult = mult
    this.id = id
    objects.push(this)
    initialValues.push({id: this.id, x: this.x, y: this.y})
  }
  draw() {
    this.ctx.save()

    let dist = Math.hypot(this.x + 100 - center.x,this.y + 50 - center.y) //bodge , okay this is gonna be a classic bodge, the bodgiest of all, just hardcode an offset here, nice
    let segment = 100/Math.min(cw,ch)
    let darken = 1 - segment*dist/100 + segment/2
    if(darken > 0) {
      this.ctx.filter = `brightness(${Math.min(0.5 + darken,1)})`
    }
    else {
      this.ctx.filter = 'brightness(0.5)'
    }
    // this.ctx.translate(-globalTranslate.x * this.mult + cw/2, -globalTranslate.y * this.mult + ch/2)
    // this.ctx.rotate(this.rotation)
    this.ctx.drawImage(this.img,this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)

    if(debug) {
      this.ctx.fillStyle = 'white'
      this.ctx.fillText(`Filter set to: ${Math.min(0.5 + darken,1)}`,this.x,this.y - lineHeight*2)
    }
    this.ctx.restore()

  }
}

let images = []

images.push(new Img(900, 1000,800,800,0,assets['stanza1_gray_vale'].src,m2ctx,mg2TransMult, 'vale'))
images.push(new Img(376, 561,150,150,0,assets['small_ringed_planet'].src,bctx,bgTransMult, 'saturn'))
images.push(new Img(1660, 1597,700,700,0,assets['small_cloud'].src,m2ctx,mg2TransMult, 'cloud'))
images.push(new Img(1698, 224,90,90,0,assets['small_asteroid_1'].src,fctx,fgTransMult, 'ast1'))
images.push(new Img(427, 1062,90,90,0,assets['small_asteroid_1'].src,f2ctx,fg2TransMult, 'ast1i2'))
images.push(new Img(2248, 780,120,120,0,assets['small_asteroid_2'].src,f2ctx,fg2TransMult, 'ast2'))
images.push(new Img(3395, 2021,120,120,0,assets['small_asteroid_2_rot2'].src,f2ctx,fg2TransMult, 'ast2i2'))
images.push(new Img(2995 ,3494 ,120,120,0,assets['small_asteroid_2'].src,f2ctx,fg2TransMult, 'ast2i3'))
images.push(new Img(1395, 361,90,90,0,assets['small_moon_1'].src,bctx,bgTransMult, 'moon1'))

images.push(new Img(929, 3696,520,235,0,assets['stanza8_bg_grass'].src,mctx,mgTransMult, 'bggrass'))
images.push(new Img(1172, 4144,800,230,0,assets['stanza8_fg_grass'].src,m2ctx,mg2TransMult, 'fggrass'))
images.push(new Img(1620, 3523,680,665,0,assets['stanza8_waterfall'].src,mctx,mgTransMult, 'waterfall'))




let textObjects = []
let poemState = 0

function advancePoem() {
  let keys = Object.keys(poem)
  textObjects.push(new TextObject(poem[keys[poemState]],tctx,`s${poemState + 1}`))
  poemState++
}

advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()
advancePoem()

let particles = [];

class Particle {
  constructor(
    x,
    y,
    velX = Math.random()*1 - 0.5,
    velY = Math.random()*1 - 0.5,
    radius = particleProperties.radius,
    color = particleProperties.colors[0]
  ) {
    this.velX = velX
    this.velY = velY
    this.velMax = 3
    this.velDefault = 1
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }
  draw(ctx) {
    ctx.moveTo(this.x,this.y)
    ctx.arc(this.x,this.y,this.radius,0,PI*2,false)
  }
  update() {
    let mouseDist = Math.round(Math.hypot(this.x - mouseNow.x, this.y - mouseNow.y))
    let modX;
    let modY;
    if(mouseDist < mouseParticleEffectRadius) {
      modX = mouseTravel.x 
      modY = mouseTravel.y 
    }

    this.x += this.velX
    this.y += this.velY
  }
}

let particleProperties = {
  colors: ['hsl(0,0%,100%)'],
  radius: 2,
  radiusRange: 0.5,
}

function drawParticles(ctx,mult) {

  particleProperties.colors.forEach(color=> {
    let matchingParticles = particles.filter(ptle => ptle.color == color) //jank this is jank but optimizations come later, need to do a viewport pass
    if(!matchingParticles) return

    //begin path
    ctx.save()
    ctx.beginPath()
    matchingParticles.forEach(ptle => {
      ptle.draw(ctx)
    })
    ctx.fillStyle = color
    ctx.filter = 'blur(0.5px)'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  })
}


class ParticleGenerator {
  constructor(parent,x,y,spawnRate = 90) {
    this.parent = parent //object reference
    this.x = this.parent.x
    this.y = this.parent.y
    this.spawnRate = spawnRate // how many frames it takes to spawn on average
    this.spawnTimer = this.spawnRate
    this.spawnReady = false // i want to incorporate some randomness and spawn skipping so this will randomly be switched on
    this.spawnRange = 600
  }
  update() {
    this.spawnTimer--
    if(this.spawnTimer <= 0) {
      particles.push(new Particle(this.x + Math.random()*this.spawnRange - this.spawnRange/2,this.y + Math.random()*this.spawnRange - this.spawnRange/2))
      this.spawnTimer = this.spawnRate
    }
  }
}

let particleGens = [];
let particleSource1 = objects.filter(obj => obj.id == 'vale')
particleSource1 = particleSource1[0]
particleGens.push(new ParticleGenerator(particleSource1))

let records = [];

function viewChanges() {
  records.forEach(rec=> {
    rec.remove()
  })
  objects.forEach(obj=> {
    let match = initialValues.filter(record => record.id == obj.id)
    let initial = match[0]
    if(obj.x != initial.x || obj.y != initial.y) {
      let record = document.createElement('div')
      let removeBtn = document.createElement('span')
      removeBtn.innerHTML = '&nbspX&nbsp'
      removeBtn.classList.add('remove-record-btn')
      removeBtn.setAttribute('onclick', 'this.parentElement.remove()')
      record.classList.add('record')
      record.innerHTML = `${obj.id} x: <b>${obj.x}</b> y: <b>${obj.y}</b>`
      record.append(removeBtn)
      records.push(record)
      changelogContainer.append(record)
    }
  })
}

function loadAsset(asset) {
  // distance check
  let distFromViewport = {
    x:  asset.x,
    y:  asset.y,
  }
}

function showControls() {
  queryBox.classList.toggle('hidden')
  changelogContainer.classList.toggle('hidden')
}





initGrid()

draw()

let debug = false;
let controlsVisible = false;
let graphics = 'medium';
let userInteracted = false;
let audioOn = false;
let lastTimestamp = 0;
let isTitleVisible = true;
let isTitleFading = false;
const PI = Math.PI

const userUnderstand = {
  movement: false,
  scroll: false,
  hintMovement: null,
  hintScroll: null,
}

let cameraShakeInterval = null;

let scrollVelocity = 0
let scrollFriction = 0.08
let mainTimer = [0,60]
let movedTimer = [0,60*8]
let timers = [
  mainTimer,
  movedTimer,
]
let queryInput = document.querySelector('#query-input')
let idDisplay = document.querySelector('#selected-object-id')
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
let selected = [];
let selectedCoordsBackup = [];
let matchedObject;
let queryBox = document.querySelector('#query-box')

let changelogContainer = document.querySelector('#changelog')
let changelogHandle = document.querySelector('#handle')

let movingChangelog = false;
let viewChangesBtn = document.querySelector('#view-changes-btn')
viewChangesBtn.addEventListener('click', function() {
  viewChanges()
})

let saveChangesBtn = document.querySelector('#save-changes-btn')
saveChangesBtn.addEventListener('click', function() {
  saveChanges()
})

let hideObjectBtn = document.querySelector('#hide-object-btn')
hideObjectBtn.addEventListener('click', function() {
  if(selected) selected.forEach(obj=> obj.hidden = !obj.hidden)
})

let deleteObjectBtn = document.querySelector('#delete-object-btn')
deleteObjectBtn.addEventListener('click', function() {
  if(selected) selected.forEach(obj=> 
    deleteObject(obj)
  )
})
let hintContainer = document.querySelector('#hint-overlay')


let objects = []; //all complexi-er objects will be there
let initialValues = [];

let canvasBg = document.getElementById('canvas-bg')
let canvasBg2 = document.getElementById('canvas-bg2')
let canvasMg = document.getElementById('canvas-mg')
let canvasMg2 = document.getElementById('canvas-mg2')
let canvasText = document.getElementById('canvas-text')
let canvasFg = document.getElementById('canvas-fg')
let canvasFg2 = document.getElementById('canvas-fg2')


const bctx = canvasBg.getContext('2d')
const b2ctx = canvasBg2.getContext('2d')
const mctx = canvasMg.getContext('2d')
const m2ctx = canvasMg2.getContext('2d')
const tctx = canvasText.getContext('2d')
const fctx = canvasFg.getContext('2d')
const f2ctx = canvasFg2.getContext('2d')


let bgTransMult = 0.25
let bg2TransMult = 0.80
let mgTransMult = 0.88
let mg2TransMult = 0.95
let tTransMult = 1
let fgTransMult = 1.5
let fg2TransMult = 2.2

// let titTransMult = 1

let contexts = []
contexts.push(bctx,b2ctx,mctx,m2ctx,tctx,fctx,f2ctx)
let mults = []
mults.push(bgTransMult,
  bg2TransMult,
  mgTransMult,
  mg2TransMult,
  tTransMult,
  fgTransMult,
  fg2TransMult,
)


let canvases = []
canvases.push(canvasBg,canvasBg2,canvasMg,canvasMg2,canvasText,canvasFg,canvasFg2)
canvases.forEach(canvas => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

let cw = window.innerWidth
let ch = window.innerHeight



window.onresize = () => {
  let globalTransPrev = globalTranslate
  globalTranslate = {x:0,y:0}
  let prevCw = cw
  let prevCh = ch
  cw = window.innerWidth
  ch = window.innerHeight
  canvases.forEach(canvas => {
    canvas.width = cw
    canvas.height = ch
  })
  moveCanvas(undefined,{
    x: globalTransPrev.x,
    y: globalTransPrev.y,
  })
}

//input related variables

// keyboard
let pressedCtrl = false
let pressedShift = false

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

  var font1 = new FontFace('andada', 'url(/fonts/andada_pro/andada_italic_variable.ttf)');
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
  if(e.code == 'ControlLeft') {
    pressedCtrl = true
    changingXforSelected = true
    changingYforSelected = true
    backupCoords()
  }
  if(e.code == 'ShiftLeft') {
    pressedShift = true
  }
  if(e.code == 'KeyT') {
    if(document.activeElement !== queryInput) {
      setTimeout(()=> {
        queryInput.focus();
        focusedElement = queryInput
      },25)
    }
  }
  if(e.code == 'KeyH' && selected) {
    selected.forEach((obj)=> obj.hidden = !obj.hidden)
  }
  if(e.code == 'KeyC' && (changingXforSelected || changingYforSelected || changingRotforSelected) && selected) {
    changingXforSelected = false
    changingYforSelected = false
    changingRotforSelected = false
    selected.forEach((obj,index)=> {
      obj.x = selectedCoordsBackup[index].x
      obj.y = selectedCoordsBackup[index].y
    })

  }
  if(e.code == 'KeyX') {
    selected.forEach(obj=> deleteObject(obj))
  }
  if(e.code == 'KeyZ' || e.code == 'KeyY' ) {
    undo()
  }
  if(e.code == 'KeyS') {
    exportToJsonFile(objects)
  }
  if(e.code == 'KeyD' && selected ) {
    selected.forEach((obj,index)=> duplicateObject(selected[index]))
  }
  if(e.code == 'Escape' && selected ) {
    selected.forEach(obj=> deselect())
  }
  if(e.code == 'Space') {
    particles.forEach(part=> {
      part.velX += Math.random()*4 - 2
      part.velY += Math.random()*4 - 2
    })
    shakeCamera(10,260)
  }

},false)

document.addEventListener('keyup', function (e) {
  if(e.code == 'ControlLeft') {
    pressedCtrl = false
    changingXforSelected = false
    changingYforSelected = false
    selectedCoordsBackup = []
    selected.forEach(obj=> {
      obj.x = Math.floor(obj.x)
      obj.y = Math.floor(obj.y)
    })
  }
  if(e.code == 'ShiftLeft') {
    pressedShift = false
  }
},false)

document.addEventListener('wheel', processWheelEvents, {passive: true})

function processWheelEvents(e) { //scroll event listener
  if(e.deltaY < 0 && !pressedCtrl && !pressedShift) {
    dismissHint('scroll')
    scrollVelocity += 3
    setTimeout(() => {
      scrollVelocity += 4
    }, 20);
    setTimeout(() => {
      scrollVelocity += 6
    }, 40);
  }
  if(e.deltaY > 0 && !pressedCtrl && !pressedShift) {
    dismissHint('scroll')
    scrollVelocity -= 3
    setTimeout(() => {
      scrollVelocity -= 4
    }, 20);
    setTimeout(() => {
      scrollVelocity -= 6
    }, 40);
  }
  if(pressedShift && !pressedCtrl && selected.length > 0) {
    selected.forEach(obj=> {
      if(obj.dimX && obj.dimY) {
        obj.dimX = obj.dimX * clamp(e.deltaY,0.95,1.05)
        obj.dimY = obj.dimY * clamp(e.deltaY,0.95,1.05)
      }
    })
  }
}

function moveObject(e) {
  if(selected.length > 0) {
    if(changingXforSelected) {
      let dx = e.clientX - mouseNow.x
      selected.forEach(obj=> {
        obj.x += dx * obj.mult
      })
      labelX.innerHTML = selected[selected.length - 1].x
      
      if(changeBothAxis) {
        let dy = e.clientY - mouseNow.y
        selected.forEach(obj=> {
          obj.y += dy * obj.mult
        })
        labelY.innerHTML = selected[selected.length - 1].y
      }

    }
    if(changingYforSelected) {
      let dy = e.clientY - mouseNow.y
      selected.forEach(obj=> {
        obj.y += dy * obj.mult
      })
      labelY.innerHTML = selected[selected.length - 1].y
      
      if(changeBothAxis) {
        let dx = e.clientX - mouseNow.x
        selected.forEach(obj=> {
          obj.x += dx * obj.mult
        })
        labelX.innerHTML = selected[selected.length - 1].x
      }
    }
    // if(changingRotforSelected) {
    //     let dx = e.clientX - mouseNow.x
    //     selected.forEach(obj=> {
    //       obj.rotation += dx *PI/180
    //     })
    //     labelX.innerHTML = selectedObject.rotation

    // }
  }

  if(movingChangelog) {
    changelogContainer.style.left = Math.max(Math.min(e.clientX - 12,cw - 300), 0) + 'px'
    changelogContainer.style.top = Math.max(Math.min(e.clientY - 12,ch - 35), 0) + 'px'
  }

  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
}
 
document.addEventListener('mousemove', function(e) {
  if(pressedCtrl && selected && !pressedShift && mousedown) {
    moveObject(e)
    return
  }
  if(movingChangelog) {
    moveObject(e)
    return
  }
  
  if(movingCanvas) {
    dismissHint('movement')
    moveCanvas(e)
  }
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
  
},false)

function dismissHint(forWhat) {
  if(forWhat == 'movement') {
    userUnderstand.movement = true
    clearInterval(userUnderstand.hintMovement)
    let filtered = hints.filter(hint=> hint.forWhat == 'movement')
    if(filtered.length > 0) filtered.forEach(hint=> hint.dismissed = true)
  }
  else
  if(forWhat == 'scroll') {
    userUnderstand.scroll = true
    clearInterval(userUnderstand.hintScroll)
    let filtered = hints.filter(hint=> hint.forWhat == 'scroll')
    if(filtered.length > 0) filtered.forEach(hint=> hint.dismissed = true)
  }
}
changelogHandle.addEventListener('mousedown', function(e) {
  mousedown = true
  movingChangelog = true
  console.log('mousedown on changelogHandle')
},false)



queryInput.addEventListener('keydown', function (e) {
  if(e.code == 'Enter' || e.code == 'NumpadEnter') {
    selectObject('from query')
  }
})



sliderX.addEventListener('mousedown', function(e) {
  changingXforSelected = true
  backupCoords()
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})

sliderY.addEventListener('mousedown', function(e) {
  changingYforSelected = true
  backupCoords()
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})
sliderRot.addEventListener('mousedown', function(e) {
  changingRotforSelected = true
  backupCoords()
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
})
let movingCanvas = false

canvasText.addEventListener('mousedown', function (e) {
  mousedown = true
  movingCanvas = true
  mouseNow = {
    x: e.clientX,
    y: e.clientY,
  }
  if(!userInteracted) {
    userInteracted = true
    initAudio()
  }
  if(pressedShift && !pressedCtrl) {
    selectObject('by mouse', matchedObject)
  }
  if(pressedShift && pressedCtrl) {
    selectObject('by mouse', matchedObject, {selectMultiple: true})
  }
},false)

document.addEventListener('mouseup', function (e) {
  mousedown = false
  changingXforSelected = false
  changingYforSelected = false
  changingRotforSelected = false
  selectedCoordsBackup = []
  movingCanvas = false
  movingChangelog = false
},false)


let decreaseMaxOpacityOverTimeTimer;
let chainlinksInvisibleTimer = 0
let decreasingChainlinkOpacity = false
function moveCanvas(e, offset) {
  // clearInterval(decreaseMaxOpacityOverTimeTimer)
  chainlinksInvisibleTimer++
  if(!decreasingChainlinkOpacity) {
    decreasingChainlinkOpacity = true;
    // console.log('Started decreaseopacityovertime interval')
    decreaseMaxOpacityOverTimeTimer = setInterval(() => {
      images.forEach(img => {
        if(img.chainlink) {
          img.maxOpacity = clamp(img.maxOpacity - 0.006,0,1)
          if(img.maxOpacity <= 0) {
            clearInterval(decreaseMaxOpacityOverTimeTimer)
            chainlinksInvisibleTimer = 60 * 6
            decreasingChainlinkOpacity = false
            // console.log('cleared chainlink interval that decreases opacity')
            return
          }
        }
      })
    }, 16);
  }
  
  let dx;
  let dy;
  if(e) {
    dx = e.clientX - mouseNow.x
    dy = e.clientY - mouseNow.y
  }
  else if(offset) {
    dx = offset.x
    dy = offset.y
  }
  dx *= dragMultiplier
  dy *= dragMultiplier
  bctx.translate(dx * bgTransMult,  dy * bgTransMult)
  b2ctx.translate(dx * bg2TransMult,  dy * bg2TransMult)
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
  // if(debug) console.log(`Mouse travelled: x:${mouseTravel.x} y: ${mouseTravel.y}`)
}

//main draw
function draw(currentTimestamp) {
  var dt = (currentTimestamp - lastTimestamp)/1000
  var fps = 1/dt
  lastTimestamp = currentTimestamp

  timers.forEach(timer=> {
    // if(timer == mainTimer) {
      timer[0]++
      if(timer[0] > timer[1]) timer[0] = 0
    // }
    // if(timer == movedTimer) {
      // timer[0]++
    // }
  })

  clearCtx(bctx,bgTransMult)
  clearCtx(b2ctx,bg2TransMult)
  clearCtx(mctx,mgTransMult)
  clearCtx(m2ctx,mg2TransMult)
  clearCtx(tctx,tTransMult)
  clearCtx(fctx,fgTransMult)
  clearCtx(f2ctx,fg2TransMult)

  //hints


  // update

  images.forEach(img=> {
    if(!img.chainlink) return
    img.opacity = (Math.sin((movedTimer[0]/movedTimer[1]*PI*5)) + 1)/2
    if(chainlinksInvisibleTimer <= 0) {
      img.maxOpacity = clamp(img.maxOpacity + 0.002,0,1)
    }
  })

  chainlinksInvisibleTimer = Math.max(chainlinksInvisibleTimer - 1,0)

  hints.forEach(hint=> {
    hint.update()
  })

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

  if(Math.abs(scrollVelocity) > 0.02) {
    moveCanvas(undefined,{x:0, y:Math.round(scrollVelocity)})
    scrollVelocity *= 1 - scrollFriction
  }
  else if(Math.abs(scrollVelocity) < 0.02 && Math.abs(scrollVelocity) > 0 ) {
    scrollVelocity = 0
  }
  else {
    scrollVelocity = 0
  }

  //update center of screen for tctx
  center.x = -globalTranslate.x + cw/2
  center.y = -globalTranslate.y + ch/2
    
  if(mainTimer[0] == mainTimer[1]) {
    populateBorderCells()
  }

  particleGens.forEach(gen => {
    gen.update()
  })
  particles.forEach(particle=> {
    particle.update()
  })
  mouseGlow.update()

  localStorage.setItem('globalTranslateX', globalTranslate.x)
  localStorage.setItem('globalTranslateY', globalTranslate.y)

  //cleanup
  if(mainTimer[0] == mainTimer[1]) {
    particles.forEach((particle,index)=> {
      if(particle.dead) particles.splice(index,1)
    })
    deleteFarCells()
  }

  // draw
  drawBg(bctx,bgTransMult, {opacity: 1})
  drawStars(bctx,bgTransMult)

  
  //nasty code that calculates the visual center for each canvas
  // (center.x * bgTransMult + (cw/2)*(1- bgTransMult))
  // (center.y * bgTransMult + (ch/2)*(1- bgTransMult))

  // draw debug info
  if(debug) {
    drawDebugInfo(fps)
  }


  textObjects.forEach(obj => {
    if(
      obj.x > -globalTranslate.x*obj.mult - 500 &&
      obj.x < -globalTranslate.x*obj.mult + cw + 500 &&
      obj.y > -globalTranslate.y*obj.mult - 500 &&
      obj.y < -globalTranslate.y*obj.mult + ch + 500
      ) {
        obj.draw()
        obj.visible = true
      }
      else {
        obj.visible = false
        obj.playing = false
      }
    obj.draw()
  })
  images.forEach(img => {
    if(
      img.x > -globalTranslate.x*img.mult - img.dimX &&
      img.x < -globalTranslate.x*img.mult + cw + img.dimX &&
      img.y > -globalTranslate.y*img.mult - img.dimY &&
      img.y < -globalTranslate.y*img.mult + ch + img.dimY
      ) {
        img.draw()
        img.visible = true
      }
      else {
        img.visible = false
      }
  })

  
  if(mouseGlow) mouseGlow.draw()
  

  drawParticles()

  if(debug) {
    tctx.save()
    tctx.fillStyle = 'red'
    tctx.fillRect(-3,-3,6,6)
    tctx.restore()
  }
  drawSelectionCursor()

  requestAnimationFrame(draw)
  
}
//end of main draw

function clearCtx(ctx,mult) {
  ctx.clearRect(-globalTranslate.x * mult,-globalTranslate.y * mult,cw,ch)
}

function outlineViewport(ctx,mult) {
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = 'orange'
  ctx.lineWidth = '3px'
  ctx.strokeRect(-globalTranslate.x * mult + 3, -globalTranslate.y * mult + 3,window.innerWidth - 6,window.innerHeight - 6)
  ctx.restore()
}

function drawBg(ctx,mult, options = {opacity: 1}) {
  ctx.save()
  ctx.fillStyle = 'hsl(240,17%,7%)'
  ctx.globalAlpha = options.opacity
  ctx.fillRect(-globalTranslate.x * mult, -globalTranslate.y * mult,window.innerWidth,window.innerHeight)
  ctx.restore()
}

let starProperties = {
  density: 15, // per grid cell
  colors: ['hsl(224,25%,20%)','hsl(272,13%,50%)','hsl(320,60%,25%)','hsl(240,23%,28%)'],
  radius: 1.2,
  radiusRange: 0.3,
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
    this.delete = false
  }
}

class Star {
  constructor(parent,x,y,radius,color) {
    this.parent = parent
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
    ctx.ellipse(this.x,this.y,this.radius + this.radius * mousedown*Math.hypot(mouseTravel.x,mouseTravel.y)/50,this.radius,Math.atan2(mouseTravel.y,mouseTravel.x),0,PI*2,false)
  }
  update() { // update pulse cycle
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
  if(debug) {
    fctx.fillText(`Stars rendered: ${starsVisible.length}`, 5 - globalTranslate.x * fgTransMult, 45 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Stars total: ${stars.length}`, 5 - globalTranslate.x * fgTransMult, 60 - globalTranslate.y * fgTransMult)
  }
  
  ctx.restore() 
}

function generateStar(cell) {
  let x = cell.x * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let y = cell.y * stargrid.cellsize + Math.floor(Math.random() * stargrid.cellsize)
  let radius = starProperties.radius + (Math.random()*starProperties.radiusRange - starProperties.radiusRange/2)
  let color = starProperties.colors[Math.floor(Math.random()*starProperties.colors.length + 0.5)]
  stars.push(new Star(
    cell,
    x,
    y,
    radius,
    color,
  ))
}



let vpOffset = {x:0,y:0}
let vpOffsetPrev = vpOffset

function calcVpOffset() {
  vpOffset = {
    x: Math.floor(-globalTranslate.x / stargrid.cellsize * bgTransMult),
    y: Math.floor(-globalTranslate.y / stargrid.cellsize * bgTransMult),
  }
}

function populateBorderCells() {
  calcVpOffset()
  
  if(vpOffset.x == vpOffsetPrev.x && vpOffset.y == vpOffsetPrev.y) {
    return
  }
  
  vpOffsetPrev = vpOffset
  
  let num = 0
  for (let x = vpOffset.x - 2; x < cw/stargrid.cellsize + vpOffset.x + 2; x++) {
    for (let y = vpOffset.y - 2; y < ch/stargrid.cellsize + vpOffset.y + 2; y++) {
      let add = generateCell(x,y)
      num += add
    }
  }
  
  let unpopulated = gridcells.filter(
    cell =>
    (
      cell.x > vpOffset.x - 3 
      ||
      cell.x < vpOffset.x + cw/stargrid.cellsize + 2 
      ||
      cell.y > vpOffset.y - 3 
      || 
      cell.y < vpOffset.y + ch/stargrid.cellsize + 2
    )
    &&
    cell.populated == false
  )
  console.log(unpopulated.length)
  unpopulated.forEach(cell => {
    populateCell(cell)
  })
  if(debug) console.log(`Cells populated: ${unpopulated.length}`)
}

function deleteFarCells() {
  let farcells = gridcells.filter(
    cell => 
    (
      cell.x <= vpOffset.x - 3 
      ||
      cell.x >= vpOffset.x + cw/stargrid.cellsize + 2 
      ||
      cell.y <= vpOffset.y - 3 
      || 
      cell.y >= vpOffset.y + ch/stargrid.cellsize + 2
    )
  )
  let starsDeleted = 0

  farcells.forEach(farcell => farcell.delete = true);

  gridcells.forEach((cell)=> {
    if(cell.delete) {
      stars = stars.filter(star => star.parent != cell)
    }
  })
  gridcells = gridcells.filter(cell=> !cell.delete)

  if(debug && farcells.length > 0) {
    // console.log(`Cells deleted: ${farcells.length}`)
    // console.log(`Stars deleted: ${starsDeleted}`)
    // console.log(`Gridcells total: ${gridcells.length}`)
  }
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


async function initGrid() {
  for (let x = vpOffset.x - 2; x < window.innerWidth / stargrid.cellsize + 2 ; x++) {
    for (let y = vpOffset.y - 2; y < window.innerHeight / stargrid.cellsize + 2 ; y++) {
      gridcells.push(new Gridcell(x,y))
    }
  }
  let visible = gridcells.filter(cell => 
    cell.x >= vpOffset.x && 
    cell.x <= cw/stargrid.cellsize + 1 &&
    cell.y >= vpOffset.y && 
    cell.y <= ch/stargrid.cellsize + 1

  )
  visible.forEach(cell=> {
    populateCell(cell)
  })
  return true
}

function populateCell(cell = null) {
  if(cell == null || cell.populated) return
  for (let i = 0; i < starProperties.density; i++) {
    generateStar(cell)
  }
  cell.populated = true
}

let hints = [];
class Hint {
  constructor(text,colorText,colorBg = null,forWhat) {
    this.text = text
    this.colorText = colorText
    this.colorBg = colorBg
    this.dismissed = false
    this.forWhat = forWhat
    this.life = 100

    this.element = document.createElement('div'); 
    let hintCont = this.element;
    let hint = document.createElement('div')
    hintCont.classList.add('hint-container','anim-pulse')
    hint.classList.add('hint')
    hint.innerHTML = this.text
    hint.style.color = this.colorText
    if(this.colorBg) hint.style.backgroundColor = this.colorBg
    hintCont.append(hint)
    hintContainer.append(hintCont)
  }
  update() {
    if(!this.dismissed) return
    this.life--
    this.element.childNodes[0].style.opacity = this.life/100
    if(this.life <= 0) {
      this.element.parentElement.removeChild(this.element)
      hints = hints.filter(hint => hint != this)
    }
  }
}

class TextObject {
  constructor(x,y,text,ctx,mult, id = Math.floor(Math.random()*1_000_000_000),font = undefined) {
    this.id = id
    // this.x = text[0][0]
    // this.y = text[0][1]
    this.x = x
    this.y = y
    this.hidden = false
    // if(localStorage.getItem(`${this.id} x`) || localStorage.getItem(`${this.id} y`)) {
    //   this.x = +localStorage.getItem(`${this.id} x`)
    //   this.y = +localStorage.getItem(`${this.id} y`)
    // }
    // if(localStorage.getItem(`${this.id} hidden`) == 'false') {
    //   this.hidden = false
    // }
    // else if(localStorage.getItem(`${this.id} hidden`) == 'true') {
    //   this.hidden = true
    // }
    
    this.text = text
    this.ctx = ctx
    this.mult = mult
    this.font = font
    this.visible = false;
    this.selected = false
    this.objectType = "textObject"
    objects.push(this)
    initialValues.push({
      id: this.id, 
      x: this.x, 
      y: this.y, 
      hidden: this.hidden,
    })
  }
  draw() {
    if(this.hidden) return
    this.ctx.save()
    let textdist = Math.hypot(this.x + 100 - center.x,this.y + 50 - center.y) //bodge , okay this is gonna be a classic bodge, the bodgiest of all, just hardcode an offset here, nice
    let segment = 80/Math.min(cw,ch)
    let alpha = 1 - segment*textdist/100 + segment/2
    if(alpha > 0) {
      this.ctx.globalAlpha = alpha
    }
    else {
      this.ctx.globalAlpha = 0
    }

    if((matchedObject == this && pressedShift) || (selected.filter(obj=> obj.id == this.id).length > 0 && pressedCtrl) ) {
      this.ctx.save()
      if(pressedCtrl) this.ctx.strokeStyle = 'white'
      else this.ctx.strokeStyle = 'blue'
      this.ctx.strokeRect(this.x,this.y,300,160)
      this.ctx.fillStyle = 'hsla(0,0%,100%,0.1)'
      this.ctx.beginPath()
      this.ctx.arc(
        this.x,
        this.y,
        50,
        0,PI*2,false
        )
        this.ctx.closePath()
        this.ctx.fill()
        if(pressedCtrl) this.ctx.filter = ''
        else this.ctx.filter = 'brightness(1.5)'
      }
      
    this.ctx.fillStyle = textColor
    this.ctx.font = this.font || mainfont
    for (let i = 1; i < this.text.length; i++) {
      this.ctx.fillText(this.text[i],this.x,this.y + lineHeight*i - lineHeight)
    }

    if(matchedObject == this && pressedShift || (selected.filter(obj=> obj.id == this.id).length > 0 && pressedCtrl) ) {
      this.ctx.restore()
    }

    if(debug || pressedShift) {
      this.ctx.save()
      if(selectedObject == this) this.ctx.fillStyle = 'red'
      else this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.x - 6,this.y - 6,12,12)
      this.ctx.restore()
    }

    if(debug) {
      this.ctx.fillStyle = 'hsl(0,0%,80%)'
      this.ctx.font = '14px Arial'
      this.ctx.fillText(`Id: ${this.id}`,this.x,this.y - lineHeight * 0.8)
      // this.ctx.fillText(`Text dist from center: ${textdist}`,this.x,this.y - lineHeight*2 * 0.8)
      // this.ctx.fillText(`Alpha value set to: ${1 - segment*textdist/100}`,this.x,this.y - lineHeight*3 * 0.8)
    }
    this.ctx.restore()
  }
}

class Img {
  constructor(
    x,y,
    dimX,dimY,
    rotation = 0,
    src, 
    ctx, mult, 
    id = Math.floor(Math.random()*1_000_000_000), 
    maxOpacity = 1, 
    instanceOf = undefined, 
    glowUnderCursor = false, 
    shadowSrc = false, 
    animated = false, 
    animation = {
      frames: [],
      frameDuration: 60,
      frameProgress: 0,
      playing: false,
      currentFrameNum: 0,
      framesTotal: 0,
    },
    filter = null,
    chainlink = false
    ) {
    this.id = id
    this.dimX = dimX
    this.dimY = dimY
    this.x = x
    this.y = y
    this.hidden = false
    // if(localStorage.getItem(`${this.id} dimX`) || localStorage.getItem(`${this.id} dimY`)) {
    //   this.dimX = +localStorage.getItem(`${this.id} dimX`)
    //   this.dimY = +localStorage.getItem(`${this.id} dimY`)
    // }
    // if(localStorage.getItem(`${this.id} x`) || localStorage.getItem(`${this.id} y`)) {
    //   this.x = +localStorage.getItem(`${this.id} x`)
    //   this.y = +localStorage.getItem(`${this.id} y`)
    // }
    // if(localStorage.getItem(`${this.id} hidden`) == 'false') {
    //   this.hidden = false
    // }
    // else if(localStorage.getItem(`${this.id} hidden`) == 'true') {
    //   this.hidden = true
    // }
    this.rotation = rotation * PI/180 // provide this in deg, convert to radians here
    this.src = src
    this.img = new Image()
    this.img.src = src
    if(shadowSrc) {
      this.shadow = new Image()
      this.shadow.src = shadowSrc
    }
    else {
      this.shadow = null
    }
    this.ctx = ctx
    this.mult = mult
    this.maxOpacity = maxOpacity
    this.opacity = maxOpacity
    this.instanceOf = instanceOf
    this.glowUnderCursor = glowUnderCursor
    this.visible = false
    this.selected = false
    
    this.animation = {
      frames: animation.frames,
      frameProgress: animation.frameProgress,
      frameDuration: animation.frameDuration,
      playing: false,
      currentFrameNum: 0,
      framesTotal: animation.frames.length,
    }
    this.animation.frames.forEach((frame,index)=> {
      frame.img = new Image()
      frame.img.src = animation.frames[index].src
    })
    this.animated = animated
    this.filter = filter
    this.chainlink = chainlink
    this.objectType = "img"
    objects.push(this)
    initialValues.push({
      id: this.id, 
      x: this.x, 
      y: this.y, 
      hidden: this.hidden,
      dimX: this.dimX, 
      dimY: this.dimY,
    })
  }
  draw() {
    if(this.hidden) return
    if(this.animated) {
      var animData = this.animate() 
      var anim = this.animation;
      var curFrameNum = anim.currentFrameNum
      var frameProgress = anim.frameProgress
      var frameDuration = anim.frameDuration
      var curFrame = animData.curFrame
      var nextFrame = animData.nextFrame
    }
    this.ctx.save()

    let dist = Math.hypot(
      this.x - (center.x * this.mult + (cw/2)*(1- this.mult)),
      this.y - (center.y * this.mult + (ch/2)*(1- this.mult))
    )
    let vignetteStrenght = 6
    let segment = (100/vignetteStrenght)/Math.min(cw,ch) //bodge but whatever
    let darken = 1 - segment*dist/(100/vignetteStrenght) + segment/2

    if(this.glowUnderCursor) {
      this.ctx.save()
      var mouse = {
        x: mouseNow.x - globalTranslate.x*this.mult,
        y: mouseNow.y - globalTranslate.y*this.mult,
      }
      let dist = Math.hypot(this.x - mouseNow.x + globalTranslate.x*this.mult,this.y - mouseNow.y + globalTranslate.y*this.mult)
      if(dist < Math.max(this.dimX,this.dimY)) {
        this.ctx.globalCompositeOperation = 'destination-over'
        var gradient = this.ctx.createRadialGradient(mouse.x,mouse.y,1,mouse.x,mouse.y,mouseGlowProperties.radius/2)
        gradient.addColorStop(
          0.3,
          `hsla(240,17%,7%,${
            Math.max(
              Math.min(1-dist/((this.dimX+this.dimY)/2),
              1
              ),
              0
            )
          })`
        )
        gradient.addColorStop(1,'hsla(240,17%,7%,0)')
        this.ctx.fillStyle = gradient
        this.ctx.fillRect(
          mouse.x - mouseGlowProperties.radius/2,
          mouse.y - mouseGlowProperties.radius/2,
          mouseGlowProperties.radius,
          mouseGlowProperties.radius
        )
      }
      this.ctx.globalCompositeOperation = 'source-atop'
    }
    if(darken > 0) {
      this.ctx.filter = `brightness(${Math.min(0.5 + darken,1)})`
    }
    else {
      this.ctx.filter = 'brightness(0.5)'
    }
    
    if((matchedObject == this && pressedShift) /* || (pressedCtrl) */ || (selected.filter(obj=> obj.id == this.id).length > 0 && pressedCtrl) ) {
      this.ctx.save()
      if(pressedCtrl) this.ctx.strokeStyle = 'hsla(0,0%,100%,0.3)'
      else this.ctx.strokeStyle = 'blue'
      this.ctx.strokeRect(this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)
      this.ctx.fillStyle = 'hsla(0,0%,100%,0.1)'
      this.ctx.beginPath()
      this.ctx.arc(
        this.x,
        this.y,
        ((this.dimX+this.dimY)/2)/2,
        0,PI*2,false
      )
      this.ctx.closePath()
      this.ctx.fill()
      if(pressedCtrl) this.ctx.filter = ''
      else this.ctx.filter = 'brightness(1.5)'
    }
    if(this.filter) this.ctx.filter = this.filter

    //draw the actual image
    this.ctx.save()
    if(!this.animated) {
      this.ctx.globalAlpha = this.opacity*this.maxOpacity
      this.ctx.drawImage(this.img,this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)
    }
    if(this.animated) {
      this.ctx.globalAlpha = curFrame.opacity*this.maxOpacity
      this.ctx.drawImage(curFrame.img,this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)
      this.ctx.globalAlpha = nextFrame.opacity * this.maxOpacity
      this.ctx.drawImage(nextFrame.img,this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)

      // console.log(this.animation.frames[this.animation.currentFrameNum].opacity)
    }
    this.ctx.restore()
    
    if(this.shadow) {
      this.ctx.save()
      this.ctx.filter = 'brightness(1)'
      this.ctx.globalAlpha = 1
      this.ctx.drawImage(this.shadow,this.x - this.dimX/2,this.y - this.dimY/2,this.dimX,this.dimY)
      this.ctx.restore()
    }

    if(this.glowUnderCursor) {
      this.ctx.restore()
    }
    if((matchedObject == this && pressedShift) || (selected.filter(obj=> obj.id == this.id).length > 0 && pressedCtrl) ) {
      this.ctx.restore()
    }
    if(debug || pressedShift) {
      this.ctx.save()
      if(selectedObject == this) this.ctx.fillStyle = 'orange'
      else this.ctx.fillStyle = 'white'
      this.ctx.fillRect(this.x - 6,this.y - 6,12,12)
      this.ctx.restore()
    }
    if(debug) {
      this.ctx.fillStyle = 'white'
      this.ctx.font = '14px Arial'
      this.ctx.fillText(`Filter set to: ${Math.min(0.5 + darken,1)}`,this.x,this.y - lineHeight*2 * 0.8)
      this.ctx.fillText(`Currentframe: ${this.animation.currentFrameNum}`,this.x,this.y - lineHeight*6 * 0.8)
      // this.ctx.fillText(`Visible: ${this.visible}`,this.x,this.y - lineHeight*4 * 0.8)
      //delete this ↓ nastiness once i fix the rendering to feature separate canvas
      this.ctx.fillText(`Id: ${this.id}`,this.x,this.y - lineHeight*3 * 0.8)
      let dist = Math.hypot(this.x - mouseNow.x + globalTranslate.x*this.mult,this.y - mouseNow.y + globalTranslate.y*this.mult)
      if(this.glowUnderCursor) this.ctx.fillText(`${Math.max(Math.min(1-dist/((this.dimX+this.dimY)/2),
        1
        ),0)}`, this.x, this.y - lineHeight*4 * 0.8)
    }
    this.ctx.restore()
  }
  animate() {
    //make a nice clean and simple animation function, where duration is based on framerate, fuck off
    let anim = this.animation;
    let framesTotal = anim.framesTotal
    let frames = anim.frames
    let currentFrameNum = anim.currentFrameNum
    let duration = anim.frameDuration
    let curFrame;
    let nextFrame;

    anim.frameProgress++
    if(anim.frameProgress >= duration) {
      currentFrameNum++
      anim.frameProgress = 0
    }
    if(currentFrameNum > framesTotal - 1) {
      currentFrameNum = 0
    }
    
    if(currentFrameNum < framesTotal - 1) {
      nextFrame = frames[currentFrameNum + 1]
      curFrame = frames[currentFrameNum]
    } 
    else {
      nextFrame = frames[0]
      curFrame = frames[framesTotal - 1]
    }

    anim.currentFrameNum = currentFrameNum
    curFrame.opacity =  1 - anim.frameProgress/duration
    nextFrame.opacity = anim.frameProgress/duration
    if(debug && curFrame.opacity + nextFrame.opacity == 0) console.log(`Total opacity 0!!!!!!!!!!!!!!!!!!!!!!`)
    
    // if(debug) console.log(`Frame progress: ${anim.frameProgress}`)
    // if(debug) console.log(`Current frame == next frame ${curFrame == nextFrame}`)
    // if(debug) console.log(`Current frame opacity: ${curFrame.opacity}`)
    // if(debug) console.log(`Next frame opacity: ${nextFrame.opacity}`)
    return {curFrame: curFrame, nextFrame: nextFrame}
  }
}

class MouseGlow {
  constructor(x,y,radius,ctx,mult) {
    this.x = x
    this.y = y
    this.radiusInit = radius
    this.radius = this.radiusInit
    this.radiusRange = this.radius*0.20
    this.ctx = ctx
    this.mult = mult
    this.img = new Image()
    this.img.src = 'assets/mouse_glow.png'
    this.pulseCycleMax = 180 // this oscillates between this number and -this number
    this.pulseCycle = this.pulseCycleMax
  }
  draw() {
    // let thing = this.x - this.radius/2 - center.x * this.mult + (cw/2)*(1- this.mult);
    this.ctx.save()
    this.ctx.drawImage(
      this.img,
      this.x - this.radius + (center.x * this.mult) - cw/2,
      this.y - this.radius + (center.y * this.mult) - ch/2,
      this.radius*2,
      this.radius*2
    )
    this.ctx.restore()
  }
  update() {
    this.x = mouseNow.x
    this.y = mouseNow.y

    if(Math.abs(this.pulseCycle) <= this.pulseCycleMax) {
      this.pulseCycle++ 
    }
    else if(Math.abs(this.pulseCycle) > this.pulseCycleMax) {
      this.pulseCycle = -this.pulseCycleMax
    }

    this.radius = this.radiusInit - this.radiusRange + this.radiusRange*( Math.abs(this.pulseCycle) / this.pulseCycleMax )
  }
}
let mouseGlowProperties = {
  radius: 350,
}
let mouseGlow = new MouseGlow(0, 0,mouseGlowProperties.radius,tctx, tTransMult)
let images = []

let textObjects = []
let poemState = 0

// function createTitle() {
//   textObjects.push(new TextObject(
//     [
//       [-50,-100],
//       `John Keats`
//     ],
//     tctx,
//     tTransMult,
//     'text_author',
//     '40px andada'
//   ))
//   textObjects.push(new TextObject(
//     [
//       [-50,-50],
//       `Hyperion, Book I`
//     ],
//     tctx,
//     tTransMult,
//     'poem_title',
//     '80px andada'
//   ))
// }

// createTitle()

// function advancePoem() {
//   let keys = Object.keys(poem)
//   textObjects.push(new TextObject(poem[keys[poemState]],tctx,tTransMult,`s${poemState + 1}`))
//   poemState++
// }

class Chain {
  constructor(origin,linkCount,linkAngle) {
    this.origin.x = origin.x
    this.origin.y = origin.y
    this.linkCount = linkCount
    this.linkAngle = linkAngle
  }
  update() {

  }
}


let particles = [];

class Particle {
  constructor(
    x,
    y,
    velX = Math.random()*1 - 0.5,
    velY = Math.random()*1 - 0.5,
    radius = particleProperties.radius + (Math.random()*particleProperties.radiusRange - particleProperties.radiusRange/2),
    color,
    lifeMax = 1200,
    parent,
    ctx,
    mult,
  ) {
    this.velX = velX
    this.velY = velY
    this.velMax = 3.5
    this.velDefault = 1
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.lifeMax = lifeMax
    this.life = this.lifeMax
    this.parent = parent
    this.dead = false
    this.ctx = ctx
    this.mult = mult
  }
  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    if(this.life >= this.lifeMax - 100) {
      this.ctx.globalAlpha = (this.lifeMax - this.life)/100
    }
    else {
     this.ctx.globalAlpha = Math.max(Math.min(100,this.life)/100,0)
    }
    this.ctx.moveTo(this.x,this.y)
    this.ctx.arc(this.x,this.y,this.radius,0,PI*2,false)
    this.ctx.fillStyle = this.color
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
  }
  update() {
    let mouseDist = Math.round(Math.hypot(this.x - mouseNow.x + globalTranslate.x*this.mult, this.y - mouseNow.y + globalTranslate.y*this.mult))
    let modX = 0;
    let modY = 0;
    if(mouseDist < mouseParticleEffectRadius) {
      modX = mouseTravel.x 
      modY = mouseTravel.y 
    }
    this.velX += modX/200
    this.velY += modY/200
    let velTotal = Math.hypot(this.velX, this.velY)
    if(velTotal > this.velMax) {
      this.velX *= this.velMax/velTotal
      this.velY *= this.velMax/velTotal
    }
    this.x += this.velX
    this.y += this.velY
    this.life--
    if(this.life < 1) {
      this.dead = true
    }
  }
}

let particleProperties = {
  colors: ['hsl(0,0%,100%)'],
  radius: 2.4,
  radiusRange: 0.8,
  lifeMinDefault: 60*4,
  lifeMaxDefault: 60*8,
}

function drawParticles() {
  particles.forEach(ptle=> {
    ptle.draw()
  })
}


class ParticleGenerator {
  constructor(
    parent,
    offset = [0,0],
    spawnRate = 45,
    spawnChance = 0.5, 
    spawnRange = 600, 
    color = particleProperties.colors[0],
    lifeMin = particleProperties.lifeMinDefault,
    lifeMax = particleProperties.lifeMaxDefault,
    force = {
      x: 0,
      y: 0
    },
    velRange = {
      xMax: 0.5,
      xMin: -0.5,
      yMax: 0.5,
      yMin: -0.5
    },
    ctx,
    mult
  ) {
    this.parent = parent //object reference
    this.x = this.parent.x + offset[0]
    this.y = this.parent.y + offset[1]
    this.spawnRate = spawnRate // how many frames it takes to spawn on average
    this.spawnTimer = this.spawnRate
    this.spawnReady = false // i want to incorporate some randomness and spawn skipping so this will randomly be switched on
    this.spawnRange = spawnRange
    this.spawnChance = spawnChance // ranges from 0.00...1 to 1
    this.color = color
    this.lifeMin = lifeMin
    this.lifeMax = lifeMax
    this.force = force
    this.velRange = velRange
    this.ctx = ctx
    this.mult = mult
  }
  update() {
    if(debug) {
      this.ctx.save()
      this.ctx.fillStyle = 'orange'
      this.ctx.fillRect(this.x,this.y,10,10)
      this.ctx.restore()
    }
    this.spawnTimer--
    if(this.spawnTimer <= 0) {
      if(Math.random() > this.spawnChance) return;
      particles.push(new Particle(
        this.x + Math.random()*this.spawnRange - this.spawnRange/2,
        this.y + Math.random()*this.spawnRange - this.spawnRange/2,
        Math.random()*(this.velRange.xMax - this.velRange.xMin) + this.velRange.xMin,
        Math.random()*(this.velRange.yMax - this.velRange.yMin) + this.velRange.yMin,
        undefined,
        this.color,
        Math.random()*(this.lifeMax - this.lifeMin) + this.lifeMin,
        this,
        this.ctx,
        this.mult
      ))
      this.spawnTimer = this.spawnRate
    }
    particles.forEach(particle=> {
      if(particle.parent == this) {
        particle.velX += this.force.x
        particle.velY += this.force.y
      }
    })
  }
}

let particleGens = [];
let records = [];

function viewChanges() {
  records.forEach(rec=> {
    rec.remove()
  })
  objects.forEach(obj=> {
    let match = initialValues.filter(record => record.id == obj.id)
    let initial = match[0]
    if(obj.x != initial.x || obj.y != initial.y || obj.hidden != initial.hidden || obj.dimX != initial.dimX || obj.dimY != initial.dimY) {
      let record = document.createElement('div')
      let removeBtn = document.createElement('span')
      removeBtn.innerHTML = '&nbspX&nbsp'
      removeBtn.classList.add('remove-record-btn')
      removeBtn.setAttribute('onclick', 'this.parentElement.remove(); restoreToInitial(this.parentElement)')
      record.classList.add('record')
      record.innerHTML = 
      `<span 
      class='record-title' title="Copy X and Y coordinates."
      onclick="navigator.clipboard.writeText(this.parentElement.querySelector('.data').innerText)">
      ${obj.id}
      </span> 
      <span 
      class="data" data-id="${obj.id}" data-hidden="${obj.hidden}" data-x="${obj.x}" data-y="${obj.y}" data-dimx="${Math.round(obj.dimX)}" data-dimy="${Math.round(obj.dimY)}"> 
      <b>${obj.x}</b>, <b>${obj.y}</b> hidden: <b>${obj.hidden}</b> dimX: <b>${Math.round(obj.dimX)}</b> dimY: <b>${Math.round(obj.dimY)}</b>
      </span>`
      record.append(removeBtn)
      records.push(record)
      changelogContainer.append(record)
    }
  })
}

function saveChanges() {
  records.forEach(rec=> {
    let dataset = rec.querySelector('.data').dataset
    localStorage.setItem(dataset.id + ' x', dataset.x)
    localStorage.setItem(dataset.id + ' y', dataset.y)
    if(dataset.hidden != undefined) localStorage.setItem(dataset.id + ' hidden', dataset.hidden)
    if(dataset.dimx != undefined) localStorage.setItem(dataset.id + ' dimX', dataset.dimx)
    if(dataset.dimy != undefined) localStorage.setItem(dataset.id + ' dimY', dataset.dimy)

    rec.style.backgroundColor = 'hsl(85,30%,65%)'
  })
}

function restoreToInitial(src) {
  let target = objects.filter(obj=> obj.id == src.querySelector('.data').dataset.id).shift()
  let initial = initialValues.filter(obj=> obj.id == target.id).shift()
  target.x = initial.x
  target.y = initial.y
  target.hidden = initial.hidden
  if(target.dimX) target.dimX = initial.dimX
  if(target.dimY) target.dimY = initial.dimY
}

function backupCoords() {
  if(selected && (selectedCoordsBackup.length < 1)) {

    selected.forEach(obj=> {
      selectedCoordsBackup.push({x: obj.x,y: obj.y})
    })
    
    console.log(selectedCoordsBackup)
  }
}

function loadAsset(asset) {
  // distance check
  let distFromViewport = {
    x:  asset.x,
    y:  asset.y,
  }
}

function showControls() {
  controlsVisible = !controlsVisible
  queryBox.classList.toggle('hidden')
  changelogContainer.classList.toggle('hidden')
}

function calcCenterForContext(ctx,mult) {
  let cntr = {
    x: center.x * mult + (cw/2)*(1- mult),
    y: center.y * mult + (ch/2)*(1- mult)
  }

  return cntr
}

function drawSelectionCursor() {
  if(!pressedShift) return
  tctx.save()
  let center =  {
    x: mouseNow.x - globalTranslate.x,
    y: mouseNow.y - globalTranslate.y,
  }
  tctx.lineWidth = 2
  tctx.strokeStyle = 'hsla(0,0%,100%,0.5)'
  tctx.beginPath()
  tctx.moveTo(center.x + 5,center.y)
  tctx.lineTo(center.x + 20,center.y)
  tctx.stroke()
  tctx.closePath()
  tctx.beginPath()
  tctx.moveTo(center.x,center.y + 5)
  tctx.lineTo(center.x,center.y + 20)
  tctx.stroke()
  tctx.closePath()
  tctx.beginPath()
  tctx.moveTo(center.x - 5,center.y)
  tctx.lineTo(center.x - 20,center.y)
  tctx.stroke()
  tctx.closePath()
  tctx.beginPath()
  tctx.moveTo(center.x,center.y - 5)
  tctx.lineTo(center.x,center.y - 20)
  tctx.stroke()
  tctx.closePath()
  tctx.restore()
  if(matchedObject || selectedObject) {
    if(matchedObject) {
      tctx.fillStyle = 'black'
      tctx.fillRect(center.x + 15, center.y + 5, matchedObject.id.length * 12 + 6, 20)
      tctx.fillStyle = 'white'
      tctx.font = '18px Arial'
      tctx.fillText(matchedObject.id,center.x + 20, center.y + 20)
    }
    else
    if(selectedObject) {
      tctx.fillStyle = 'black'
      tctx.fillRect(center.x + 15, center.y + 5, selectedObject.id.length * 12 + 6, 20)
      tctx.fillStyle = 'white'
      tctx.font = '18px Arial'
      tctx.fillText(selectedObject.id,center.x + 20, center.y + 20)
    }
  }

  selectNearestToCursor()
}

function selectNearestToCursor() {
    let distances = []
    objects.forEach(obj=> {
      let dist = Math.hypot(obj.x - mouseNow.x + globalTranslate.x*obj.mult,obj.y - mouseNow.y + globalTranslate.y*obj.mult)
      distances.push(dist)
    })
    let closest = Math.min(...distances)
    let match = objects.filter(obj => Math.hypot(obj.x - mouseNow.x + globalTranslate.x*obj.mult,obj.y - mouseNow.y + globalTranslate.y*obj.mult) == closest)
    matchedObject = match[0]
}

function selectObject(targetMethod,match, options = {selectMultiple: false}) {
  if(!match) {
    var match = null
  }
  if(targetMethod == 'by mouse' && match) {
    if(selected.filter(obj=> obj.id == match.id).length > 0 && selected.length != 1) {
      selected.forEach((obj,index)=> {
        if(obj.id == match.id) {
          selected.splice(index,1)
          selectedCoordsBackup.splice(index,1)
        }
      })
    }
    else {
      if(!options.selectMultiple) {
        selected = []
        selectedCoordsBackup = []
      }
      selected.push(match)
      match.selected = true
      selectedCoordsBackup.push({x: match.x,y: match.y})
    }
  }

  if(targetMethod == 'from query') {
    let query = queryInput.value;
    if(query.search("allfrom:","") != -1) {
      let indexStart = query.search("y")
      let condition = query.substring(indexStart+1,query.length)
      console.log(condition)
      if(condition == -1 || indexStart == -1) return
      let results = objects.filter(obj => obj.y > condition * obj.mult)
      selected = []
      for (let i = 0; i < results.length; i++) {
        match = results[i]
        selected.push(match) 
      }
    }
    else {
      query = query.split(",")
      console.log(query)
      let results = [];
      query.forEach(query => {
        let filter = objects.filter(obj => obj.id == query).shift()
        if(filter) {
          console.log(filter)
          results.push(filter)
        }
      })
      console.log('results: ' + results)
      if(results.length == 0) {
        alert('No object with that id was found.')
        return
      }
      selected = []
      for (let i = 0; i < results.length; i++) {
        match = results[i]
        selected.push(match) 
      }
    }
  }
  if(match) {
    labelX.innerHTML = match.x
    labelY.innerHTML = match.y
    idDisplay.innerHTML = match.id
  }
  // console.log(match)
}

function deselect() {
  selected = []
}

let objectHistory = []

function duplicateObject(obj) {
  if(obj instanceof Img) {
    var img = new Img(
      obj.x,
      obj.y,
      obj.dimX,
      obj.dimY,
      obj.rotation,
      obj.img.src,
      obj.ctx,
      obj.mult,
      obj.id + Math.floor(Math.random()*1_000_000_000),
      obj.maxOpacity,
      obj.id,
      obj.glowUnderCursor,
      obj.shadowSrc,
      obj.animated,
      obj.animation,
      obj.filter,
      obj.chainlink)

    if(obj.instanceOf) {
      img.id = obj.instanceOf + Math.floor(Math.random()*1_000_000_000)
      img.instanceOf = obj.instanceOf
    }
    images.push(img)
    objectHistory.push(img)
    selectObject('by mouse', img)
  }
}

function undo() {
  if(objectHistory.length < 1) return
  let lastObject = objects.filter(obj=> obj.id == objectHistory[objectHistory.length - 1].id).shift()
  objects.forEach((obj,index)=> {
    if(obj.id == lastObject.id) {
      objects.splice(index,1)
    }
  })
  if(lastObject instanceof Img) {
    images.forEach((img,index)=> {
      if(img.id == lastObject.id) {
        images.splice(index,1)
      }
    })
  }
}

function deleteObject(deleted) {
  if(deleted.objectType == 'img') images = images.filter(img=> img != deleted)
  if(deleted.objectType == 'textObject') textObjects = textObjects.filter(textobj=> textobj != deleted)
  objects = objects.filter(obj=> obj != deleted)
}


function shakeCamera(amount,duration) {
  clearInterval(cameraShakeInterval)
  cameraShakeInterval = setInterval(() => {
    moveCanvas(undefined,{
      x: Math.round(Math.random()*amount - amount/2),
      y: Math.round(Math.random()*amount - amount/2)
    });
  }, 25);
  setTimeout(() => {
    clearInterval(cameraShakeInterval)
  }, duration);
}

function init() {
  if(controlsVisible) {
    showControls()
  }
  moveCanvas(undefined,{
    x: localStorage.getItem('globalTranslateX'),
    y: localStorage.getItem('globalTranslateY'),  
  })
  calcVpOffset()
  initGrid().then(setTimeout(()=>{hideTitleScreen()},1000), console.log('failed to init grid'))
  
  //hints
  userUnderstand.hintMovement = setInterval(()=> {
    if(hints.length == 0) hints.push(new Hint('Use your mouse to drag around..','white', undefined, 'movement'))
  },1000 * 8)
  
  userUnderstand.hintScroll = setInterval(()=> {
   if(hints.length == 0) hints.push(new Hint('You can also scroll with your mouse...','white', undefined, 'scroll'))
  },1000 * 9)

  readObjectData()
}

function drawDebugInfo(fps,) {
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
      bctx.fillStyle = 'white'
      bctx.fillText(`X: ${cell.x} Y: ${cell.y}`,cell.x * stargrid.cellsize + 1 + 20, cell.y * stargrid.cellsize + 1 + 20)
      bctx.restore()
    })
    fctx.font = '12px arial'
    fctx.fillStyle = 'white'
    fctx.fillText(`Viewport offset in grid-cells x: ${vpOffset.x} y: ${vpOffset.y}`, 5 - globalTranslate.x * fgTransMult, 15 - globalTranslate.y * fgTransMult)
    fctx.fillText(`globalTranslate x:${globalTranslate.x} y:${globalTranslate.y}`, 5 - globalTranslate.x * fgTransMult, 30 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Fps: ${fps.toFixed(2)}`, 5 - globalTranslate.x * fgTransMult, 75 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Images rendered: ${images.filter(img=> img.visible).length}`, 5 - globalTranslate.x * fgTransMult, 90 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Text objects rendered: ${textObjects.filter(obj=> obj.visible).length}`, 5 - globalTranslate.x * fgTransMult, 105 - globalTranslate.y * fgTransMult)
    fctx.fillText(`Mouse position on tctx: x: ${mouseNow.x - globalTranslate.x} y: ${mouseNow.y - globalTranslate.y}`, 5 - globalTranslate.x * fgTransMult, 120 - globalTranslate.y * fgTransMult)

}



//music system

let musicState = 1

let mainLoop = new Audio()
mainLoop.src = audio[`section${musicState}`].loop1
mainLoop.load()
mainLoop.loop = true
mainLoop.oncanplaythrough = function() {
  console.log('Main loop loaded.')
}
function initAudio() {
  if(audioOn) {
    mainLoop.play()
  }
}

function loadAudio(target,src,section) {
  target.src = audio[`section${section}`][`${src}`]
  target.oncanplaythrough = function() {
    // event that does something
  }
}

init()
draw()


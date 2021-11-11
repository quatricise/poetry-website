function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}


function readObjectData() {
  readTextFile("object_data.json", function(text){
  let objs = JSON.parse(text);

  objs.forEach((obj,index)=> {
    let ctx;
    if(obj.mult == bgTransMult) ctx = bctx
    if(obj.mult == bg2TransMult) ctx = b2ctx
    if(obj.mult == bg3TransMult) ctx = b3ctx
    if(obj.mult == mgTransMult) ctx = mctx
    if(obj.mult == mg2TransMult) ctx = m2ctx
    if(obj.mult == tTransMult) ctx = tctx
    if(obj.mult == fgTransMult) ctx = fctx
    if(obj.mult == fg2TransMult) ctx = f2ctx
    if(obj.mult == fg3TransMult) ctx = f3ctx

    if(obj.objectType == 'img') images.push(new Img(
      obj.x,
      obj.y,
      obj.spawnX,
      obj.spawnY,
      obj.dimX,
      obj.dimY,
      obj.rotation,
      obj.src,
      ctx,
      obj.mult,
      obj.id,
      obj.maxOpacity,
      obj.instanceOf,
      obj.glowUnderCursor,
      obj.shadowSrc,
      obj.animated,
      obj.animation,
      obj.filter,
      obj.chainlink,
      obj.isStatic,
      obj.velocity,
      obj.comet,
      obj.rotationSpeed,
      obj.hasTrail,
      obj.trail
    ))
    if(obj.objectType == 'textObject') textObjects.push(new TextObject(
      obj.x,
      obj.y,
      obj.text,
      ctx,
      obj.mult,
      obj.id,
      obj.font
    ))
  })

  particleGenerators.forEach(gen=> {
    let parent = objects.filter(obj => obj.id == gen.parent).shift()
    if(!parent) return
    if(parent.hidden) return
    particleGens.push(new ParticleGenerator(
      parent,
      gen.offset,
      gen.spawnRate,
      gen.spawnChance,
      gen.spawnRange,
      gen.color,
      gen.lifeMin,
      gen.lifeMax,
      gen.force,
      gen.velRange,
      parent.ctx,
      parent.mult,
    ))
  })

});
}

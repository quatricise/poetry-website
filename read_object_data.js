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
    if(index > 1) return
    let ctx;
    if(obj.mult == bgTransMult) ctx = bctx
    if(obj.mult == bg2TransMult) ctx = b2ctx
    if(obj.mult == mgTransMult) ctx = mctx
    if(obj.mult == mg2TransMult) ctx = m2ctx
    if(obj.mult == tTransMult) ctx = tctx
    if(obj.mult == fgTransMult) ctx = fctx
    if(obj.mult == fg2TransMult) ctx = f2ctx

    if(obj.objectType == 'img') images.push(new Img(
      obj.x,
      obj.y,
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
      obj.animation, //fix the urls here
      obj.filter,
    ))
  })
});
}

function spawnAsteroid() {
  let rot = random(0, PI * 2, { round: false });
  let rotSpeed = random(0, 1, { round: true }) * random(0, 0.08, { round: false });
  let randCtx = random(0, contexts.length - 1);
  let ctx = contexts[randCtx];
  let mult = mults[randCtx];
  let size = random(50, 80) + 10 * randCtx;
  let x;
  let y;

  if (random(0, 1)) {
    x = pickRandom([0, 1]) * (cw + size * 2);
    if (x == 0) x = -size;
    y = Math.round(Math.random() * ch);
  } else {
    x = Math.round(Math.random() * cw);
    y = pickRandom([0, 1]) * (ch + size * 2);
    if (y == 0) y = -size;
  }
  x -= globalTranslate.x * mult;
  y -= globalTranslate.y * mult;

  // console.log('x: ' + x)
  // console.log('y: ' + y)

  let vel = {
    x: random(-3, 3, { round: false, toFixed: 3 }),
    y: random(-3, 3, { round: false, toFixed: 3 }),
  };
  if (Math.abs(vel.x) < 0.4) vel.x *= 4;
  if (Math.abs(vel.y) < 0.4) vel.y *= 4;
  let sources = [
    imgSources["small_asteroid_1"].src,
    imgSources["small_asteroid_2"].src,
    imgSources["small_asteroid_3"].src,
    imgSources["small_asteroid_4"].src,
    imgSources["small_asteroid_5"].src,
  ];
  let src = sources[random(0, sources.length - 1)];

  images.push(
    new Img(
      x,
      y,
      size,
      size,
      rot,
      src,
      ctx,
      mult,
      `asteroid${random(0, 1_000_000_000)}`,
      1,
      undefined,
      false,
      false,
      false,
      undefined,
      `brightness(${random(0.5, 0.8 - randCtx / 30, {
        round: false,
        toFixed: 2,
      })})`,
      false,
      false,
      vel,
      true,
      rotSpeed
    )
  );
}

function spawnComet() {
  let rot = random(0, PI * 2, { round: false });
  let rotSpeed = random(0.02, 0.08, { round: false }) * pickRandom([-1,1])
  let size = random(30, 45);
  let x;
  let y;

  if (random(0, 1)) {
    x = pickRandom([0, 1]) * (cw + size * 2);
    if (x == 0) x = -size;
    y = Math.round(Math.random() * ch);
  } else {
    x = Math.round(Math.random() * cw);
    y = pickRandom([0, 1]) * (ch + size * 2);
    if (y == 0) y = -size;
  }
  x -= globalTranslate.x * bgTransMult;
  y -= globalTranslate.y * bgTransMult;

  // console.log('x: ' + x)
  // console.log('y: ' + y)

  let vel = {
    x: random(0.4, 2, { round: false, toFixed: 3 }),
    y: random(0.4, 2, { round: false, toFixed: 3 }),
  };
  if(random(0,1)) vel.x *= -1
  if(random(0,1)) vel.y *= -1


  let src = imgSources["comet_body"].src;

  images.push(
    new Img(
      x,
      y,
      size,
      size,
      rot,
      src,
      bctx,
      bgTransMult,
      `comet${random(0, 1_000_000_000)}`,
      1,
      undefined,
      false,
      false,
      false,
      undefined,
      // `hue-rotate(${ random( 30, 50, { round: true } ) }deg) brightness(${ random( 0.5, 0.8, { toFixed: 2 } ) })`,
      undefined,
      false,
      false, //isStatic
      vel,
      // {x:0,y:0},
      true,
      rotSpeed,
      true,
      {
        children: [],
        sources: [
          imgSources["comet_trail10"].src,
          imgSources["comet_trail9"].src,
          imgSources["comet_trail8"].src,
          imgSources["comet_trail7"].src,
          imgSources["comet_trail6"].src,
          imgSources["comet_trail5"].src,
          imgSources["comet_trail4"].src,
          imgSources["comet_trail3"].src,
          imgSources["comet_trail2"].src,
          imgSources["comet_trail1"].src,
        ],
      }
    )
  );
}

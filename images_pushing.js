//images pushing
images.push(new Img(900, 1000, 800, 800, 0, imgSources['s1_gray_vale'].src,m2ctx,mg2TransMult, 'vale',1,undefined,undefined,false,true,
{
  frameDuration: 120, //in frames because fuck you
  frameProgress: 0,
  frames: [
    {
      src: imgSources['s1_gray_vale'].src,
      opacity: 1
    },
    {
      src: imgSources['s1_gray_vale'].src,
      opacity: 0
    },
  ]
}))
images.push(new Img(900, 1000, 800, 800, 0, imgSources['s1_debris1'].src,mctx,mgTransMult, 'valedebris'))
images.push(new Img(861, 944, 800, 800, 0, imgSources['s1_debris2'].src,mctx,mgTransMult, 'valedebris2'))
images.push(new Img(376, 561, 150, 150, 0, imgSources['small_planet_saturn'].src,bctx,bgTransMult, 'saturn'))

images.push(new Img(1660, 1597, 700, 700,0, imgSources['cloud_large_1'].src,m2ctx,mg2TransMult, 'cloudl',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(1667 , 1474, 700, 700,0, imgSources['cloud_small_1'].src,mctx,mgTransMult, 'clouds1',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(1639, 1494, 700, 700,0, imgSources['cloud_small_2'].src,mctx,mgTransMult, 'clouds2',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))



// images.push(new Img(949, 1546, 1000, 1000,0, imgSources['s3_no_stir'].src,mctx,mgTransMult, 's3nostir'))

images.push(new Img(1401, 2013, 1024, 1024,0, imgSources['s4_grass_bg'].src,mctx,mgTransMult, 's4grassbg'))
images.push(new Img(1427, 2162, 1024, 1024,0, imgSources['s4_grass_fg'].src,m2ctx,mg2TransMult, 's4grassfg'))
images.push(new Img(1462, 2248, 1024, 1024,0, imgSources['s4_grass_fg2'].src,tctx,tTransMult, 's4grassfg2'))
// images.push(new Img(1409, 2038, 1200, 1200,0, imgSources['s4_grass_bg'].src,m2ctx,mg2TransMult, 's4grassfg2')) // just placeholder for more grass

images.push(new Img(1698, 224, 90, 90, 0, imgSources['small_asteroid_1'].src,fctx,fgTransMult, 'ast1'))
images.push(new Img(427, 1062, 90, 90, 0, imgSources['small_asteroid_1'].src,f2ctx,fg2TransMult, 'ast1i2'))
images.push(new Img(2248, 780, 120, 120, 0, imgSources['small_asteroid_2'].src,f2ctx,fg2TransMult, 'ast2'))
images.push(new Img(3395, 2021, 120, 120, 0, imgSources['small_asteroid_2_rot2'].src,f2ctx,fg2TransMult, 'ast2i2'))
images.push(new Img(2995 ,3494 ,120, 120, 0, imgSources['small_asteroid_2'].src,f2ctx,fg2TransMult, 'ast2i3'))
// images.push(new Img(1395, 361, 90, 90, 0, imgSources['small_moon_1'].src,bctx,bgTransMult, 'moon1'))

//stanza 5
images.push(new Img(1820, 1199, 1000, 1000, 0, imgSources['s5_reeds_bg'].src,b2ctx,bg2TransMult, 's5reedsbg'))
images.push(new Img(1820, 1199, 1000, 1000, 0, imgSources['s5_reeds_mg'].src,m2ctx,mg2TransMult, 's5reedsmg'))
images.push(new Img(1820, 1199, 1000, 1000, 0, imgSources['s5_naiad_watery'].src,b2ctx,bg2TransMult, 's5naiad'))
images.push(new Img(1820, 1199, 1000, 1000, 0, imgSources['s5_water_shadow'].src,mctx,mgTransMult, 's5watershadow'))
images.push(new Img(1820, 1199, 1000, 1000, 0, imgSources['s5_reeds_fg'].src,tctx,tTransMult, 's5reedsfg'))
//stanza 6
images.push(new Img(1820, 1199, 1300, 1300, 0, imgSources['s6_margin_sand_fill_frame1'].src,mctx,mgTransMult, 's6sand_fill',1,undefined,undefined,false,true,
{
  frameDuration: 120, //in frames because fuck you
  frameProgress: 0,
  frames: [
    {
      src: imgSources['s6_margin_sand_fill_frame1'].src,
      opacity: 1
    },
    {
      src: imgSources['s6_margin_sand_fill_frame2'].src,
      opacity: 0
    },
    {
      src: imgSources['s6_margin_sand_fill_frame3'].src,
      opacity: 0
    },
  ]
}
))
// images.push(new Img(1820, 1199, 1300, 1300, 0, imgSources['s6_margin_sand'].src,mctx,mgTransMult, 's6sand'))
images.push(new Img(1820, 1199, 1300, 1300, 0, imgSources['s6_margin_sand_frame1'].src,mctx,mgTransMult, 's6sand',undefined,undefined,false,false,true,
{
  frameDuration: 120, //in frames because fuck you
  frameProgress: 0,
  frames: [
    {
      src: imgSources['s6_margin_sand_frame1'].src,
      opacity: 1
    },
    {
      src: imgSources['s6_margin_sand_frame2'].src,
      opacity: 0
    },
  ]
}
))

images.push(new Img(1395, 2500, 70, 70, 0, imgSources['s6_moon'].src,mctx,mgTransMult, 's6moon',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))

//stanza 7
images.push(new Img(1820, 4000, 700, 700, 0, imgSources['s7_unsceptered'].src,m2ctx,mg2TransMult, 's7unsceptered',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
//stanza 8
images.push(new Img(1820, 2000, 750, 750, 0, imgSources['s8_no_force'].src,m2ctx,mg2TransMult, 's8noforce',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
//stanza 9
images.push(new Img(1820, 4000, 800, 800, 0, imgSources['s9_wheel'].src,m2ctx,mg2TransMult, 's9wheel',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(1820, 4000, 372, 282, 0, imgSources['s9_cloud_small_1'].src,mctx,mgTransMult, 's9clouds1',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(1820, 4000, 223, 158, 0, imgSources['s9_cloud_small_2'].src,mctx,mgTransMult, 's9clouds2',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
//stanza 10
images.push(new Img(1820, 7000, 800, 800, 0, imgSources['s10_sphinx'].src,mctx,mgTransMult, 's10sphinx',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
//stanza 11
images.push(new Img(1820, 4000, 800, 800, 0, imgSources['s11_sorrow'].src,mctx,mgTransMult, 's11sorrow',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(1820, 7000, 800, 800, 0, imgSources['s11_sorrow_clouds'].src,m2ctx,mg2TransMult, 's11sorrowclouds',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(448, 7269, 122, 131, 0, imgSources['cloud_small_3'].src,b2ctx,bg2TransMult, 'clouds3',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
images.push(new Img(448, 7269, 238, 161, 0, imgSources['cloud_small_4'].src,mctx,mgTransMult, 'clouds4',1,undefined,undefined,false,false,undefined,'brightness(0.7)'))
//stanza 12
images.push(new Img(1820, 4000, 256, 256, 0, imgSources['s12_thunder_small1'].src,mctx,mgTransMult, 's12tsmall1'))
images.push(new Img(1820, 4000, 512, 512, 0, imgSources['s12_thunder_small2'].src,mctx,mgTransMult, 's12tsmall2'))
images.push(new Img(1820, 4000, 1024, 1024, 0, imgSources['s12_thunder_large1'].src,m2ctx,mg2TransMult, 's12tlarge1',0.5))
//stanza 13
images.push(new Img(1820, 8000, 1024, 1024, 0, imgSources['s13_pressed_her_hand'].src,m2ctx,mg2TransMult, 's13pressedhand'))


// images.push(new Img(1820, 1199, 90, 90, 0, imgSources['small_planet_nacron'].src,bctx,bgTransMult, 'nacron'))
// images.push(new Img(259, 1762, 120, 120, 0, imgSources['small_planet_reia'].src,bctx,bgTransMult, 'reia'))

// images.push(new Img(929, 3696, 520, 235, 0, imgSources['s8_bg_grass'].src,mctx,mgTransMult, 'bggrass'))
// images.push(new Img(1172, 4144, 800, 230, 0, imgSources['s8_fg_grass'].src,m2ctx,mg2TransMult, 'fggrass'))
// images.push(new Img(1620, 3523, 680, 665, 0, imgSources['s8_waterfall'].src,mctx,mgTransMult, 'waterfall'))

let link = new Image()
link.src = 'assets/chainlink_circle_large.png'
let link2 = new Image()
link2.src = 'assets/chainlink_circle_small.png'
images.push(new Img(923, 618, 64, 64, 0, link.src, m2ctx, mg2TransMult, 'chaintest', 0.8))
images.push(new Img(952, 695, 64, 64, 0, link2.src, m2ctx, mg2TransMult, 'chaintest2', 0.8))

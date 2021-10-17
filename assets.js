let imgSources = {
  stanza1_gray_vale: {
    src: 'assets/stanza1_gray_vale.png'
  },
  stanza1_debris1: {
    src: 'assets/stanza1_debris1.png'
  },
  stanza1_debris2: {
    src: 'assets/stanza1_debris2.png'
  },
  s3_no_stir: {
    src: 'assets/s3_no_stir.png'
  },
  s4_grass_bg: {
    src: 'assets/s4_grass_bg.png'
  },
  s4_grass_fg: {
    src: 'assets/s4_grass_fg.png'
  },
  s4_grass_fg2: {
    src: 'assets/s4_grass_fg2.png'
  },
  s5_reeds_bg: {
    src: 'assets/s5_reeds_bg.png'
  },
  s5_reeds_mg: {
    src: 'assets/s5_reeds_mg.png'
  },
  s5_reeds_fg: {
    src: 'assets/s5_reeds_fg.png'
  },
  s5_naiad_watery: {
    src: 'assets/s5_naiad_watery.png'
  },
  s5_water_shadow: {
    src: 'assets/s5_water_shadow.png'
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
  small_planet_saturn: {
    src: 'assets/small_planet_saturn.png'
  },
  small_planet_nacron: {
    src: 'assets/small_planet_nacron.png'
  },
  small_planet_reia: {
    src: 'assets/small_planet_reia.png'
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
  cloud_large_1: {
    src: 'assets/cloud_large_1.png'
  },
  cloud_small_1: {
    src: 'assets/cloud_small_1.png'
  },
  cloud_small_2: {
    src: 'assets/cloud_small_2.png'
  },
}

let particleGenerators = [
  {
    parent: 'vale', // by object id from objects inside objects []
    offset: [ 0, -150 ], // offset the center of the generator by x and y
    spawnRate: 50,
    spawnChance: 0.5,
    spawnRange: 400,
    color: 'hsl(250,10%,75%)',
    lifeMin: 60*6,
    lifeMax: 60*8,
  },
  {
    parent: 'waterfall', // by object id from objects inside objects []
    offset: [20, 610], // offset the center of the generator by x and y
    spawnRate: 35,
    spawnChance: 0.2,
    spawnRange: 200,
    color: 'hsl(0,0%,100%)',
    lifeMin: 60*4,
    lifeMax: 60*6,
  }
]
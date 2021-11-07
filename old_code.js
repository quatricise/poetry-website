function createTitle() {
  textObjects.push(new TextObject(
    [
      [-50,-100],
      `John Keats`
    ],
    tctx,
    tTransMult,
    'text_author',
    '40px andada'
  ))
  textObjects.push(new TextObject(
    [
      [-50,-50],
      `Hyperion, Book I`
    ],
    tctx,
    tTransMult,
    'poem_title',
    '80px andada'
  ))
}

function advancePoem() {
  let keys = Object.keys(poem)
  textObjects.push(new TextObject(poem[keys[poemState]],tctx,tTransMult,`s${poemState + 1}`))
  poemState++
}
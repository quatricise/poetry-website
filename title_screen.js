let canvasTitle = document.querySelector('#canvas-title')
const titctx = canvasTitle.getContext('2d')

let titleScreen = document.querySelector('.title-screen')
function hideTitleScreen() {
  if(isTitleFading) return
  let timing = 750
  isTitleVisible = false
  isTitleFading = true
  titleScreen.animate(
    [
  {
    filter: "opacity(1)",
    display: 'flex',
  },
  {
    filter: "opacity(0)",
    display: 'none',
  }
],{
    duration: timing,
    easing: "ease-in-out",
  }
)
  setTimeout(() => {
    titleScreen.classList.add('hidden')
    isTitleFading = false
  }, timing - 1);
}


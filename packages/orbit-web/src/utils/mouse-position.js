export default function getMousePosition (e) {
  e = e || window.event

  let pageX = e.pageX
  let pageY = e.pageY

  // IE 8
  if (pageX === undefined) {
    pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
  }

  return { x: pageX, y: pageY }
}

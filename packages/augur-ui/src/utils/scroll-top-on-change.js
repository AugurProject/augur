export default (url) => {
  if (url && url !== `${window.location.pathname}${window.location.search}`) {
    window.scroll(0, 0)
  }
}

export default function (dispatch) {
  // This method sets up the side bar's state + calls the method to attach the touch event handler for when a user is mobile
  // CSS breakpoint sets the value when a user is mobile
  const isMobile = window.getComputedStyle(document.body).getPropertyValue('--is-mobile').indexOf('true') !== -1

  dispatch(updateIsMobile(isMobile))
}

/**
 * Fit Text to Containing Element's Width
 * @param container - The containing element with constraining width
 * @param target - The target element to fit to width constraint
 * @param shouldScaleUp - Allow for the text to scale up even if the container width isn't exceeded
 */
export default function fitText(container, target, shouldScaleUp) {
  if (container && target) {
    const containerWidth = container.clientWidth
    const targetWidth = target.clientWidth

    target.style.transform = null // Reset

    if (shouldScaleUp || targetWidth > containerWidth) {
      const newWidth = (containerWidth * targetWidth) / targetWidth
      const newScale = newWidth / targetWidth
      console.log('fitText: cw, tw, nw, ns', containerWidth, targetWidth, newWidth, newScale)
      target.style.transform = `scale(${newScale}, ${newScale})`
    }
  }
}

/**
 * Fit Text to Containing Element's Width
 * @param container - The containing element with constraining width
 * @param target - The target element to fit to width constraint
 * @param shouldScaleUp - Allow for the text to scale up even if the container width isn't exceeded
 * @param maxScale - A number for the maximum allowed scale size
 */
export default function fitText(container, target, shouldScaleUp, maxScale) {
  if (container && target) {
    const containerWidth = container.clientWidth
    const targetWidth = target.clientWidth

    target.style.transform = null // Reset

    if (shouldScaleUp || targetWidth > containerWidth) {
      const newWidth = (containerWidth * targetWidth) / targetWidth
      let newScale = newWidth / targetWidth

      if (maxScale) {
        newScale = newScale > maxScale ? maxScale : newScale
      }

      target.style.transform = `scale(${newScale}, ${newScale})`
    }
  }
}

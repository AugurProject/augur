/**
 * Fit Text to Containing Element's Width
 * @param container - The containing element with constraining width
 * @param target - The target element to fit to width constraint
 */
export default function fitText(container, target) {
  console.log('fitText -- ', container, target);

  if (container && target) {
    const containerWidth = container.clientWidth;
    const targetWidth = target.clientWidth;

    target.style.transform = null; // Reset

    const newWidth = (containerWidth * targetWidth) / targetWidth;
    const newScale = newWidth / targetWidth;

    target.style.transform = `scale(${newScale}, ${newScale})`;
  }
}

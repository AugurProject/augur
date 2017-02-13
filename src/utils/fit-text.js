/**
 * Fit Text to Containing Element's Width
 * @param container - The containing element with constraining width
 * @param target - The target element to fit to width constraint
 */
export default function fitText(container, target) {
  const containerWidth = container.clientWidth;
  const targetWidth = target.clientWidth;

  console.log('fitText -- ', container, target, containerWidth, targetWidth);

  if (targetWidth > containerWidth) {
    const newWidth = (containerWidth * targetWidth) / targetWidth;
    const newScale = newWidth / targetWidth;
    const leftPull = (newWidth - targetWidth) / 2;

    target.style.transform = `translateX(${leftPull}px) scale(${newScale}, ${newScale})`;
  }
}

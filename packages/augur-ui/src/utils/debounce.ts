export default function debounce(func: () => void, wait: number = 250): () => void {
  let timeout;
  return (...args: any) => {
    const context = this;

    const later = () => {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

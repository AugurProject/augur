export default function debounce(func: (...args: any) => void, wait: number = 250): () => void {
  let timeout;
  return (...args: any) => {
    const later = () => {
      timeout = null;
      func.apply(null, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

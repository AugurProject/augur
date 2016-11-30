export default function debounce(func, wait) {
	let timeout;
	const realWait = wait || 250;

	return (...args) => {
		const context = this;

		const later = () => {
			timeout = null;
			func.apply(context, args);
		};

		const callNow = !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, realWait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

export default function (categoricalOutcomes) {
	let errors = null;

	if (!categoricalOutcomes || !categoricalOutcomes.length) {
		return [];
	}

	errors = Array(categoricalOutcomes.length);
	errors.fill('');

	categoricalOutcomes.forEach((outcome, currentIndex) => {
		if (!outcome.length) {
			errors[currentIndex] = 'Answer cannot be blank';
		} else {
			categoricalOutcomes.forEach((cV, i) => {
				if (cV === outcome && i !== currentIndex) {
					errors[currentIndex] = 'Category must be unique';
				}
			});
		}
	});

	return errors;
}

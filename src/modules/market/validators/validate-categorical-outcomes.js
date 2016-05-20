export default function (categoricalOutcomes) {
	let errors = null;

	if (!categoricalOutcomes || !categoricalOutcomes.length) {
		return [];
	}

	errors = Array(categoricalOutcomes.length);
	errors.fill('');

	categoricalOutcomes.forEach((outcome, i) => {
		if (!outcome.length) {
			errors[i] = 'Answer cannot be blank';
		}
	});

	return errors;
}

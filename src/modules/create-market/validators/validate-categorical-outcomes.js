export default function (categoricalOutcomes) {
	let categoricalErrors = null;

	if (!categoricalOutcomes || !categoricalOutcomes.length) {
		return categoricalErrors;
	}

	categoricalErrors = Array(categoricalOutcomes.length);
	categoricalErrors.fill('');

	categoricalOutcomes.map((outcome, i) => {
		if (!outcome.length) {
			categoricalErrors[i] = 'Answer cannot be blank';
		}
	});

	return categoricalErrors;
}
export default function (categoricalOutcomes) {
	console.log('categoricalOutcomes -- ', categoricalOutcomes);

	let errors = [];

	if (!!categoricalOutcomes.length) {
		return [];
	}

	categoricalOutcomes.map((outcome, i) => {
		if (!outcome.length) {
			errors[i] = 'Answer cannot be blank';
		}
	});

	return errors;
}

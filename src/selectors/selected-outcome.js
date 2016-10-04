export default {
	selectedOutcomeID: null,
	updateSelectedOutcome: selectedOutcomeID => {
		const selectors = require('../selectors');

		selectors.update({
			selectedOutcome: {
				...selectors.selectedOutcome,
				selectedOutcomeID
			}
		});
	}
};
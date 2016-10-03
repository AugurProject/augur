export default {
	selectedOutcomeID: null,
	updateSelectedOutcome: (selectedOutcomeID) => {
		module.exports.update({
			selectedOutcome: {
				...selectors.selectedOutcome,
				selectedOutcomeID
			}
		});
	}
};
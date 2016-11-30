export default {
	value: '',
	onChangeKeywords: (keywords) => {
		const selectors = require('../selectors');

		selectors.update({
			keywords: {
				...selectors.keywords,
				value: keywords
			}
		});
	}
};

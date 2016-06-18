export default {
	value: '',
	onChangeKeywords: (keywords) => {
		var selectors = require('../selectors');
		selectors.update({
			keywords: {
				...selectors.keywords,
				value: keywords
			}
		});
	}
};
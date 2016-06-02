import selectors from '../src/selectors';
import keywordsAssertion from './assertions/keywords';

describe(`selectors.keywords tests:`, () => {
	// keywords: {
	// 		value: String,
	// 		onChangeKeywords: [Function: onChangeKeywords]
	// },
	it(`should contain a keywords object with the correct shape`, () => {
		let actual = selectors.keywords;
		keywordsAssertion(actual);
		// console.log(actual);
	});
});

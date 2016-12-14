import { describe, it } from 'mocha';
import { assert } from 'chai';
import reducer from 'modules/markets/reducers/keywords';
import {
	UPDATE_KEYWORDS
} from 'modules/markets/actions/update-keywords';

describe(`modules/markets/reducers/keywords.js`, () => {
	it(`should return a string of keywords`, () => {
		const keywords = 'unit, test, JavaScript';
		const currKeywords = 'html, css3, assert';
		const action = {
			type: UPDATE_KEYWORDS,
			keywords
		};
		const expectedOutput = keywords;

		assert.equal(reducer(undefined, action), expectedOutput, `didn't return keywords when they aren't passed to the reducer`);
		assert.equal(reducer(currKeywords, action), expectedOutput, `didn't return keywords when keywords already is defined and passed to reducer`);
	});
});

import { describe, it } from 'mocha';
import activeViewAssertions from 'assertions/active-view';
import selector from 'modules/app/selectors/active-view';

describe(`modules/app/selectors/active-page.js`, () => {
	it(`should get active page from store`, () => {
		const actual = selector();
		activeViewAssertions(actual);
	});
});

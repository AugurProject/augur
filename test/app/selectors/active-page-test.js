import { describe, it } from 'mocha';
import { assert } from 'chai';
import selector from '../../../src/modules/app/selectors/active-view';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/app/selectors/active-page.js`, () => {
	it(`should get active page from store`, () => {
		const actual = selector();

		assert.isDefined(actual);  // TODO -- remove
		// assertions.activeView(actual);
	});
});

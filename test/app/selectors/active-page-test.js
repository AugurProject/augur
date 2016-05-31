import {
	assert
} from 'chai';
import selector from '../../../src/modules/app/selectors/active-page';
import activePageAssertion from '../../../node_modules/augur-ui-react-components/test/assertions/activePage';

describe(`modules/app/selectors/active-page.js`, () => {
	// let out = 'markets';
	it(`should get activepage from store`, () => {
		let actual = selector();
		activePageAssertion(actual);
	});
});
let activePage = selector;
export default activePage;

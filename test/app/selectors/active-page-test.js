import assertions from 'augur-ui-react-components/lib/assertions';
import selector from '../../../src/modules/app/selectors/active-view';

describe(`modules/app/selectors/active-page.js`, () => {
	it(`should get active page from store`, () => {
		let actual = selector();
		assertions.activeView(actual);
	});
});

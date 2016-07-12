import { assertions } from 'augur-ui-react-components';
import selector from '../../../src/modules/app/selectors/active-page';

describe(`modules/app/selectors/active-page.js`, () => {
	it(`should get active page from store`, () => {
		let actual = selector();
		assertions.activePage(actual);
	});
});

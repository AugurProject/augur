import selectors from '../src/selectors';
import tradePanelAssertion from './assertions/trade-panel';

describe('trade panel', () => {
	it('should pass all assertions', () => {
		let actual = selectors.markets[0];
		tradePanelAssertion(actual);
	});
});
import selectors from '../src/selectors';
import createMarketFormAssertion from './assertions/createMarketForm';

describe(`selectors.createMarketForm tests:`, () => {
  // createMarketForm: {}
	it(`should contain a createMarketForm Object`, () => {
		let actual = selectors.createMarketForm();
		createMarketFormAssertion(actual);
	});
});

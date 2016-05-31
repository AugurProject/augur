import selectors from '../src/selectors';
import createMarketFormAssertion from './assertions/createMarketForm';

describe(`Selector shape tests. Selector...`, () => {
  // createMarketForm: {}
	it(`should contain a createMarketForm Object`, () => {
		let actual = selectors.createMarketForm;
		createMarketFormAssertion(actual);
	});
});

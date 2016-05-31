import selectors from '../src/selectors';
import onChangeSortAssertion from './assertions/onChangeSort';

describe(`selectors.onChangeSort`, () => {
  // onChangeSort: [Function],
	it(`should contain a onChangeSort function`, () => {
		let actual = selectors.onChangeSort;
		onChangeSortAssertion(actual);
	});
});

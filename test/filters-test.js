import selectors from '../src/selectors';
import filtersAssertion from './assertions/filters';

describe(`selector.filters tests:`, () => {
	// filters:
	// [ { title: 'Status', options: [ Object, ... ] },
	// 	{ title: 'Type', options: [ Object, ... ] },
	// 	{ title: 'Tags', options: [ Object, ... ] } ],
	it(`should contain a filters array with the correct shape`, () => {
		let actual = selectors.filters;
		filtersAssertion(actual);
	});
});

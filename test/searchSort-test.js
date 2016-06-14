import selectors from '../src/selectors';
import searchSortAssertion from './assertions/searchSort';

describe(`selectors.searchSort tests:`, () => {
	// searchSort: {
	// 	selectedSort: { prop: String, isDesc: Boolean },
  //   sortOptions: [ { label: String, value: String }, Object, Object ]
	// },
	it(`should contain a searchSort and is the expected shape`, () => {
		let actual = selectors.searchSort;
		searchSortAssertion(actual);
	});

	// it(`searchSort should contain a selectedSort object with correct shape`, () => {
	// 	let actual = selectors.searchSort.selectedSort;
	// 	assertions.selectedSortAssertion(actual);
	// });
	//
	// it(`searchSort should contain a sortOptions array of objects with correct shape`, () => {
	// 	let actual = selectors.searchSort.sortOptions;
	// 	assertions.sortOptionsAssertion(actual);
	// });
});

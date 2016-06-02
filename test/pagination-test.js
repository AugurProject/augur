import selectors from '../src/selectors';
import paginationAssertion from './assertions/pagination';

describe(`selectors.pagination tests:`, () => {
  // pagination:
  //  { numPerPage: 10,
  //    numPages: 10,
  //    selectedPageNum: 1,
  //    nextPageNum: 2,
  //    startItemNum: 1,
  //    endItemNum: 10,
  //    numUnpaginated: 89,
  //    nextItemNum: 11,
  //    onUpdateSelectedPageNum: [Function: onUpdateSelectedPageNum] },
	it(`should contain a pagination object with the expected shape`, () => {
		let actual = selectors.pagination;
		paginationAssertion(actual);
	});
});

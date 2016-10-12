import { MARKETS } from '../modules/site/constants/views';

export default {
	numPerPage: 10,
	numPages: 10,
	selectedPageNum: 1,
	nextPageNum: 2,
	startItemNum: 1,
	endItemNum: 10,
	numUnpaginated: 89,
	nextItemNum: 11,
	onUpdateSelectedPageNum: (selectedPageNum) => {
		const selectors = require('../selectors');

		selectors.update({
			pagination: {
				...selectors.pagination,
				selectedPageNum,
				nextPageNum: selectedPageNum + 1,
				previousPageNum: selectedPageNum - 1,
				startItemNum: ((selectedPageNum - 1) * 10) + 1,
				endItemNum: selectedPageNum * 10,
				nextItemNum: (selectedPageNum * 10) + 1,
				previousItemNum: ((selectedPageNum - 2) * 10) + 1
			}
		});
	},
	prevPageLink: { href: '/?page=1', onClick: url => require('../selectors').update({ activeView: MARKETS, url }) },
	nextPageLink: { href: '/?page=2', onClick: url => require('../selectors').update({ activeView: MARKETS, url }) },
};

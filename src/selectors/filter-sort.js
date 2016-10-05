export default {
	selectedFilterSort: { // Initial Defaults
		type: 'open',
		sort: 'volume',
		isDesc: true
	},
	types: [
		{
			label: 'Open',
			value: 'open',
			default: true
		},
		{
			label: 'Closed',
			value: 'closed'
		},
		{
			label: 'Reporting',
			value: 'reporting'
		}
	],
	sorts: [
		{
			label: 'Volume',
			value: 'volume',
			default: true
		},
		{
			label: 'Newest',
			value: 'newest'
		},
		{
			label: 'Expiry',
			value: 'expiry'
		},
		{
			label: 'Taker Fee',
			value: 'takerFee'
		},
		{
			label: 'Maker Fee',
			value: 'makerFee'
		}
	],
	order: {
		isDesc: true // This is the default
	},
	onChange: (type, sort, order) => {
		const selectors = require('../selectors');

		const isDesc = order == null ? selectors.filterSort.selectedFilterSort.isDesc : order;

		selectors.update({
			filterSort: {
				...selectors.filterSort,
				filterSort: {
					type: type || selectors.filterSort.selectedFilterSort.type,
					sort: sort || selectors.filterSort.selectedFilterSort.sort,
					isDesc
				}
			}
		});
	}
};

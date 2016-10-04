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
	onChange: function(type, sort, order) {
		const selectors = require('../selectors');
		const isDesc = order == null ? selectors.marketsFilterSort.selectedFilterSort.isDesc : order;

		selectors.update({
			marketsFilterSort: {
				...selectors.marketsFilterSort,
				selectedFilterSort: {
					type: type || selectors.marketsFilterSort.selectedFilterSort.type,
					sort: sort || selectors.marketsFilterSort.selectedFilterSort.sort,
					isDesc
				}
			}
		});
	}
};
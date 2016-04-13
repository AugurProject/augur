import store from '../../../store';

export default function() {
	var { activePage, loginAccount } = store.getState(),
		{ positionsSummary, transactionsTotals, isTransactionsWorking, links } = require('../../../selectors');

	return {
		activePage,
		loginAccount,

		positionsSummary,
		transactionsTotals,
		isTransactionsWorking,
		...links
	};
}
import memoizerific from 'memoizerific';
import store from '../../../store';
import { formatNumber } from '../../../utils/format-number';

export default function (outcomes) {
	const { loginAccount } = store.getState();

	return selectUserOpenOrdersSummary(outcomes, loginAccount);
}

const selectUserOpenOrdersSummary = memoizerific(10)((outcomes, loginAccount) => {
	if (loginAccount.address == null) {
		return null;
	}

	const openOrdersCount = (outcomes || []).reduce((openOrdersCount, outcome) => (
		openOrdersCount + (outcome.userOpenOrders ? outcome.userOpenOrders.length : 0)
	), 0);

	return {
		openOrdersCount: formatNumber(openOrdersCount, { denomination: 'Open Orders' })
	};
});

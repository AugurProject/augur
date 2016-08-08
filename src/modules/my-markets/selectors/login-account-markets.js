import selectMyMarkets from '../../../modules/my-markets/selectors/my-markets';
import selectMyMarketsSummary from '../../../modules/my-markets/selectors/my-markets-summary';

export default function () {
	const markets = selectMyMarkets();
	const summary = selectMyMarketsSummary();

	return {
		markets,
		summary
	};
}

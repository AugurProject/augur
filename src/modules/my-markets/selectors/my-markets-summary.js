import selectMyMarkets from '../../../modules/my-markets/selectors/my-markets';

export default function () {
	const markets = selectMyMarkets();

	const numMarkets = markets.length;
	const totalValue = markets.reduce((prevTotal, currentMarket) => prevTotal + currentMarket.fees.value, 0);

	return {
		numMarkets,
		totalValue
	};
}

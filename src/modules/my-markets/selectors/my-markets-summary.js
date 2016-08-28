import selectMyMarkets from '../../../modules/my-markets/selectors/my-markets';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';

export default function () {
	const markets = selectMyMarkets();

	const numMarkets = markets.length;
	const totalValue = markets.reduce((prevTotal, currentMarket) => prevTotal.plus(abi.bignum(currentMarket.fees.value)), ZERO).toNumber();

	return {
		numMarkets,
		totalValue
	};
}

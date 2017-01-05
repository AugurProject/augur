import { augur } from '../../../services/augurjs';
import { selectScalarMinimum } from '../../market/selectors/market';

export const parametrizeOrder = (market, outcomeID, numShares, limitPrice) => ({
	amount: numShares,
	price: limitPrice,
	market: market.id,
	outcome: outcomeID,
	scalarMinMax: selectScalarMinimum(market)
});

export const placeBid = (market, outcomeID, numShares, limitPrice) => augur.buy({
	...parametrizeOrder(market, outcomeID, numShares, limitPrice),
	onSent: res => console.log('bid sent:', res),
	onSuccess: res => console.log('bid success:', res),
	onFailed: err => console.error('bid failed:', err)
});

export const placeAsk = (market, outcomeID, numShares, limitPrice) => augur.sell({
	...parametrizeOrder(market, outcomeID, numShares, limitPrice),
	onSent: res => console.log('ask sent:', res),
	onSuccess: res => console.log('ask success:', res),
	onFailed: err => console.error('ask failed:', err)
});

export const placeShortAsk = (market, outcomeID, numShares, limitPrice) => augur.shortAsk({
	...parametrizeOrder(market, outcomeID, numShares, limitPrice),
	onSent: res => console.log('shortAsk sent:', res),
	onSuccess: res => console.log('shortAsk success:', res),
	onFailed: err => console.error('shortAsk failed:', err)
});

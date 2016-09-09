import memoizerific from 'memoizerific';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { formatEther, formatPercent, formatShares, formatNumber } from '../../../utils/format-number';
import selectMyPositions from '../../../modules/my-positions/selectors/my-positions';

export default function () {
	const myPositions = selectMyPositions();

	return generateMarketsPositionsSummary(myPositions);
}

export const generateOutcomePositionSummary = memoizerific(50)((outcomeAccountTrades, lastPrice, sharesPurchased) => {
	if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
		return null;
	}
	const bnLastPrice = abi.bignum(lastPrice);
	let numShares = ZERO;
	let qtyShares = ZERO;
	let totalValue = ZERO;
	let totalCost = ZERO;
	let totalSellShares = ZERO;
	outcomeAccountTrades.forEach(outcomeAccountTrade => {
		if (!outcomeAccountTrade) {
			return;
		}

		// buy or sell
		if (!outcomeAccountTrade.maker) {
			if (outcomeAccountTrade.type === 1) {
				numShares = abi.bignum(outcomeAccountTrade.shares);
				qtyShares = qtyShares.plus(numShares);
				totalValue = totalValue.plus(bnLastPrice.times(numShares));
				totalCost = totalCost.plus(abi.bignum(outcomeAccountTrade.price).times(numShares));
			} else {
				totalSellShares = totalSellShares.plus(abi.bignum(outcomeAccountTrade.shares));
			}
		} else {
			if (outcomeAccountTrade.type === 2) {
				numShares = abi.bignum(outcomeAccountTrade.shares);
				qtyShares = qtyShares.plus(numShares);
				totalValue = totalValue.plus(bnLastPrice.times(numShares));
				totalCost = totalCost.plus(abi.bignum(outcomeAccountTrade.price).times(numShares));
			} else {
				totalSellShares = totalSellShares.plus(abi.bignum(outcomeAccountTrade.shares));
			}
		}
	});

	// remove sells
	const avgPerShareValue = calculateAvgPrice(qtyShares, totalValue);
	const avgPerShareCost = calculateAvgPrice(qtyShares, totalCost);

	totalValue = totalValue.minus(totalSellShares.times(avgPerShareValue));
	totalCost = totalCost.minus(totalSellShares.times(avgPerShareCost));

	return generatePositionsSummary(1, abi.bignum(qtyShares).minus(totalSellShares).toFixed(), totalValue.toFixed(), totalCost.toFixed());
});

export const generateMarketsPositionsSummary = memoizerific(50)(markets => {
	if (!markets || !markets.length) {
		return null;
	}

	let qtyShares = ZERO;
	let totalValue = ZERO;
	let totalCost = ZERO;
	const positionOutcomes = [];

	markets.forEach(market => {
		market.outcomes.forEach(outcome => {
			if (!outcome || !outcome.position || !outcome.position.numPositions || !outcome.position.numPositions.value) {
				return;
			}
			qtyShares = qtyShares.plus(abi.bignum(outcome.position.qtyShares.value));
			totalValue = totalValue.plus(abi.bignum(outcome.position.totalValue.value));
			totalCost = totalCost.plus(abi.bignum(outcome.position.totalCost.value));
			positionOutcomes.push(outcome);
		});
	});

	const positionsSummary = generatePositionsSummary(positionOutcomes.length, qtyShares.toFixed(), totalValue.toFixed(), totalCost.toFixed());

	return {
		...positionsSummary,
		positionOutcomes
	};
});

export const generatePositionsSummary = memoizerific(20)((numPositions, qtyShares, totalValue, totalCost) => {
	const bnQtyShares = abi.bignum(qtyShares);
	const bnTotalCost = abi.bignum(totalCost);
	const bnTotalValue = abi.bignum(totalValue);
	const purchasePrice = calculateAvgPrice(bnQtyShares, bnTotalCost);
	const valuePrice = calculateAvgPrice(bnQtyShares, bnTotalValue);
	const shareChange = valuePrice.minus(purchasePrice);
	let gainPercent = 0;
	if (!bnTotalCost.eq(ZERO)) {
		gainPercent = bnTotalValue.minus(bnTotalCost).dividedBy(bnTotalCost).times(100);
	}
	const netChange = bnTotalValue.minus(bnTotalCost);

	return {
		numPositions: formatNumber(numPositions, { decimals: 0, decimalsRounded: 0, denomination: 'positions', positiveSign: false, zeroStyled: false }),
		qtyShares: formatShares(bnQtyShares),
		purchasePrice: formatEther(purchasePrice),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		shareChange: formatEther(shareChange),
		gainPercent: formatPercent(gainPercent),
		netChange: formatEther(netChange)
	};
});

function calculateAvgPrice(qtyShares, totalCost) {
	if (!qtyShares || !totalCost || !abi.number(qtyShares) || !abi.number(totalCost)) {
		return ZERO;
	}
	return totalCost.dividedBy(qtyShares);
}

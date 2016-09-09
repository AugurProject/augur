import memoizerific from 'memoizerific';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { formatEther, formatShares, formatNumber } from '../../../utils/format-number';
import selectMyPositions from '../../../modules/my-positions/selectors/my-positions';

export default function () {
	const myPositions = selectMyPositions();

	return generateMarketsPositionsSummary(myPositions);
}

export const generateOutcomePositionSummary = memoizerific(50)((outcomeAccountTrades, lastPrice) => {
	if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
		return null;
	}
	const bnLastPrice = abi.bignum(lastPrice);
	let qtyShares = ZERO;
	let totalValue = ZERO;
	let totalCost = ZERO;
	let totalSellShares = ZERO;

	outcomeAccountTrades.forEach(outcomeAccountTrade => {
		if (!outcomeAccountTrade) {
			return;
		}

		const numShares = abi.bignum(outcomeAccountTrade.shares);

		// Logic to count open vs. closed positions
		if (!outcomeAccountTrade.maker) {
			if (outcomeAccountTrade.type === 1) { // Open Positions
				qtyShares = qtyShares.plus(numShares);
				totalValue = totalValue.plus(bnLastPrice.times(numShares));
				totalCost = totalCost.plus(abi.bignum(outcomeAccountTrade.price).times(numShares));
			} else { // Closed Positions
				totalSellShares = totalSellShares.plus(numShares);
			}
		} else {
			if (outcomeAccountTrade.type === 2) { // Open Positions
				qtyShares = qtyShares.plus(numShares);
				totalValue = totalValue.plus(bnLastPrice.times(numShares));
				totalCost = totalCost.plus(abi.bignum(outcomeAccountTrade.price).times(numShares));
			} else { // Closed Positions
				totalSellShares = totalSellShares.plus(numShares);
			}
		}
	});

	// remove sells
	const avgPerShareValue = calculateAvgPrice(qtyShares, totalValue);
	const avgPerShareCost = calculateAvgPrice(qtyShares, totalCost);

	const realizedNet = avgPerShareCost.times(totalSellShares);
	const unrealizedNet = avgPerShareCost.times(qtyShares).minus(realizedNet);

	totalValue = totalValue.minus(totalSellShares.times(avgPerShareValue));
	totalCost = totalCost.minus(totalSellShares.times(avgPerShareCost));

	return generatePositionsSummary(1, abi.bignum(qtyShares).minus(totalSellShares), totalValue, totalCost, realizedNet, unrealizedNet);
});

export const generateMarketsPositionsSummary = memoizerific(50)(markets => {
	if (!markets || !markets.length) {
		return null;
	}

	let qtyShares = ZERO;
	let totalValue = ZERO;
	let totalCost = ZERO;
	let totalRealizedNet = ZERO;
	let totalUnrealizedNet = ZERO;
	const positionOutcomes = [];

	markets.forEach(market => {
		market.outcomes.forEach(outcome => {
			if (!outcome || !outcome.position || !outcome.position.numPositions || !outcome.position.numPositions.value) {
				return;
			}
			qtyShares = qtyShares.plus(abi.bignum(outcome.position.qtyShares.value));
			totalValue = totalValue.plus(abi.bignum(outcome.position.totalValue.value));
			totalCost = totalCost.plus(abi.bignum(outcome.position.totalCost.value));
			totalRealizedNet = totalRealizedNet.plus(abi.bignum(outcome.position.realizedNet.value));
			totalUnrealizedNet = totalUnrealizedNet.plus(abi.bignum(outcome.position.unrealizedNet.value));
			positionOutcomes.push(outcome);
		});
	});

	const positionsSummary = generatePositionsSummary(positionOutcomes.length, qtyShares, totalValue, totalCost, totalRealizedNet, totalUnrealizedNet);

	return {
		...positionsSummary,
		positionOutcomes
	};
});

export const generatePositionsSummary = memoizerific(20)((numPositions, qtyShares, totalValue, totalCost, realizedNet, unrealizedNet) => {
	const purchasePrice = calculateAvgPrice(qtyShares, totalCost);
	const valuePrice = calculateAvgPrice(qtyShares, totalValue);
	const shareChange = valuePrice.minus(purchasePrice);
	const totalNet = realizedNet.plus(unrealizedNet);

	return {
		numPositions: formatNumber(numPositions, { decimals: 0, decimalsRounded: 0, denomination: 'positions', positiveSign: false, zeroStyled: false }),
		qtyShares: formatShares(qtyShares),
		purchasePrice: formatEther(purchasePrice),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		shareChange: formatEther(shareChange),
		realizedNet: formatEther(realizedNet),
		unrealizedNet: formatEther(unrealizedNet),
		totalNet: formatEther(totalNet)
	};
});

function calculateAvgPrice(qtyShares, totalCost) {
	if (!qtyShares || !totalCost || !abi.number(qtyShares) || !abi.number(totalCost)) {
		return ZERO;
	}
	return totalCost.dividedBy(qtyShares);
}

import memoizerific from 'memoizerific';
import { augur, abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { formatEther, formatShares, formatNumber } from '../../../utils/format-number';
import selectMyPositions from '../../../modules/my-positions/selectors/my-positions';

export default function () {
	const myPositions = selectMyPositions();
	return generateMarketsPositionsSummary(myPositions);
}

export const generateOutcomePositionSummary = memoizerific(50)((adjustedPosition, outcomeAccountTrades, lastPrice) => {
	if ((!outcomeAccountTrades || !outcomeAccountTrades.length) && !adjustedPosition) {
		return null;
	}
	const trades = outcomeAccountTrades ? outcomeAccountTrades.slice() : [];
	const { position, realized, unrealized, meanOpenPrice } = augur.calculateProfitLoss(trades, lastPrice, adjustedPosition);
	return generatePositionsSummary(1, position, meanOpenPrice, realized, unrealized);
});

export const generateMarketsPositionsSummary = memoizerific(50)((markets) => {
	if (!markets || !markets.length) {
		return null;
	}
	let qtyShares = ZERO;
	let totalRealizedNet = ZERO;
	let totalUnrealizedNet = ZERO;
	const positionOutcomes = [];
	markets.forEach((market) => {
		market.outcomes.forEach((outcome) => {
			if (!outcome || !outcome.position || !outcome.position.numPositions || !outcome.position.numPositions.value || ((!outcome.position.qtyShares || !outcome.position.qtyShares.value) && (!outcome.position.realizedNet || !outcome.position.realizedNet.value))) {
				return;
			}
			qtyShares = qtyShares.plus(abi.bignum(outcome.position.qtyShares.value));
			totalRealizedNet = totalRealizedNet.plus(abi.bignum(outcome.position.realizedNet.value));
			totalUnrealizedNet = totalUnrealizedNet.plus(abi.bignum(outcome.position.unrealizedNet.value));
			positionOutcomes.push(outcome);
		});
	});
	const positionsSummary = generatePositionsSummary(positionOutcomes.length, qtyShares, 0, totalRealizedNet, totalUnrealizedNet);
	return {
		...positionsSummary,
		positionOutcomes
	};
});

export const generatePositionsSummary = memoizerific(20)((numPositions, qtyShares, meanTradePrice, realizedNet, unrealizedNet) => {
	const totalNet = abi.bignum(realizedNet).plus(abi.bignum(unrealizedNet));
	return {
		numPositions: formatNumber(numPositions, {
			decimals: 0,
			decimalsRounded: 0,
			denomination: 'positions',
			positiveSign: false,
			zeroStyled: false
		}),
		qtyShares: formatShares(qtyShares),
		purchasePrice: formatEther(meanTradePrice),
		realizedNet: formatEther(realizedNet),
		unrealizedNet: formatEther(unrealizedNet),
		totalNet: formatEther(totalNet)
	};
});

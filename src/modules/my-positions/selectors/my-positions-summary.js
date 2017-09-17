import memoize from 'memoizee';
import BigNumber from 'bignumber.js';

import store from 'src/store';

import selectMyPositions from 'modules/my-positions/selectors/my-positions';
import { closePosition } from 'modules/my-positions/actions/close-position';

import { ZERO } from 'modules/trade/constants/numbers';

import { augur } from 'services/augurjs';
import { formatEtherTokens, formatShares, formatNumber } from 'utils/format-number';

export default function () {
  const myPositions = selectMyPositions();
  return generateMarketsPositionsSummary(myPositions);
}

export const generateOutcomePositionSummary = memoize((adjustedPosition, outcomeAccountTrades, lastPrice, orderBook) => {
  if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
    return null;
  }

  const trades = outcomeAccountTrades ? outcomeAccountTrades.slice() : [];
  const { realized, unrealized, meanOpenPrice } = augur.trading.calculateProfitLoss({ trades, lastPrice });
  const position = adjustedPosition || '0';
  const isClosable = !!new BigNumber(position || '0').toNumber(); // Based on position, can we attempt to close this position

  return {
    ...generatePositionsSummary(1, position, meanOpenPrice, realized, unrealized),
    isClosable,
    closePosition: (marketID, outcomeID) => {
      store.dispatch(closePosition(marketID, outcomeID));
    }
  };
}, { max: 50 });

export const generateMarketsPositionsSummary = memoize((markets) => {
  if (!markets || !markets.length) {
    return null;
  }
  let qtyShares = ZERO;
  let totalRealizedNet = ZERO;
  let totalUnrealizedNet = ZERO;
  const positionOutcomes = [];
  markets.forEach((market) => {
    market.outcomes.forEach((outcome) => {
      if (!outcome || !outcome.position || !outcome.position.numPositions || !outcome.position.numPositions.value) {
        return;
      }
      qtyShares = qtyShares.plus(new BigNumber(outcome.position.qtyShares.value, 10));
      totalRealizedNet = totalRealizedNet.plus(new BigNumber(outcome.position.realizedNet.value, 10));
      totalUnrealizedNet = totalUnrealizedNet.plus(new BigNumber(outcome.position.unrealizedNet.value, 10));
      positionOutcomes.push(outcome);
    });
  });
  const positionsSummary = generatePositionsSummary(positionOutcomes.length, qtyShares, 0, totalRealizedNet, totalUnrealizedNet);
  return {
    ...positionsSummary,
    positionOutcomes
  };
}, { max: 50 });

export const generatePositionsSummary = memoize((numPositions, qtyShares, meanTradePrice, realizedNet, unrealizedNet) => {
  const totalNet = new BigNumber(realizedNet, 10).plus(new BigNumber(unrealizedNet, 10));
  return {
    numPositions: formatNumber(numPositions, {
      decimals: 0,
      decimalsRounded: 0,
      denomination: 'Positions',
      positiveSign: false,
      zeroStyled: false
    }),
    qtyShares: formatShares(qtyShares),
    purchasePrice: formatEtherTokens(meanTradePrice),
    realizedNet: formatEtherTokens(realizedNet),
    unrealizedNet: formatEtherTokens(unrealizedNet),
    totalNet: formatEtherTokens(totalNet)
  };
}, { max: 20 });

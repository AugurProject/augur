import { SCALAR, MALFORMED_OUTCOME } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';

export default function calculatePayoutNumeratorsValue(
  market: MarketInfo,
  payout: Array<string>
): string | null {
  const { maxPrice, minPrice, numTicks, marketType } = market;
  const isScalar = marketType === SCALAR;

  if (!payout) return null;
  if (payout.length === 0) return null;

  if (isScalar) {
    const longPayout = createBigNumber(payout[1], 10);
    const priceRange = createBigNumber(maxPrice, 10).minus(
      createBigNumber(minPrice, 10)
    );
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    return longPayout
      .times(priceRange)
      .dividedBy(createBigNumber(numTicks, 10))
      .plus(createBigNumber(minPrice, 10))
      .toString();
  }
  // test if stake payout is malformed
  if (
    payout.reduce((p, ticks) => (parseInt(ticks, 10) > 0 ? p + 1 : p), 0) > 1
  ) {
    return MALFORMED_OUTCOME;
  }

  return payout.findIndex((item: string) => parseInt(item, 10) > 0).toString();
}

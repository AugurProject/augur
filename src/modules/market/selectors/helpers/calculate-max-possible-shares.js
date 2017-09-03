import memoize from 'memoizee';
import BigNumber from 'bignumber.js';
import { ZERO } from 'modules/trade/constants/numbers';
import { augur, constants } from 'services/augurjs';
import speedomatic from 'speedomatic';

/**
 * Orders should be sorted from best to worst (usually by price)
 *
 * @param loginAccount {Object}
 * @param orders {Array}
 * @param makerFee {String}
 * @param takerFee {String}
 * @param range {String}
 * @param outcomeTradeInProgress {Object} used to bust memoizerific cache
 */
export const calculateMaxPossibleShares = memoize((loginAccount, orders, makerFee, takerFee, range, outcomeTradeInProgress, scalarMinValue) => {
  if (loginAccount.address == null) {
    return null;
  }
  const userEther = loginAccount.ether != null ? new BigNumber(loginAccount.ether, 10) : ZERO;
  if (userEther.eq(ZERO)) {
    return '0';
  }
  const ordersLength = orders.length;
  const { tradingFee, makerProportionOfFee } = augur.trading.fees.calculateFxpTradingFees(new BigNumber(makerFee, 10), new BigNumber(takerFee, 10));
  let runningCost = ZERO;
  let updatedRunningCost;
  let maxPossibleShares = ZERO;
  let orderCost;
  let orderAmount;
  let fullPrecisionPrice;
  let order;
  for (let i = 0; i < ordersLength; i++) {
    order = orders[i];
    orderAmount = new BigNumber(order.amount, 10);
    fullPrecisionPrice = scalarMinValue !== null ?
      augur.trading.shrinkScalarPrice(scalarMinValue, order.fullPrecisionPrice) :
      order.fullPrecisionPrice;
    orderCost = augur.trading.fees.calculateFxpTradingCost(
      orderAmount,
      new BigNumber(fullPrecisionPrice, 10),
      tradingFee,
      makerProportionOfFee,
      range
    );
    updatedRunningCost = order.type === 'buy' ?
      runningCost.plus(orderCost.fee.abs()) :
      runningCost.plus(orderCost.cost);
    if (updatedRunningCost.lte(userEther)) {
      maxPossibleShares = maxPossibleShares.plus(orderAmount);
      runningCost = updatedRunningCost;
    } else {
      const remainingEther = speedomatic.fix(userEther.minus(runningCost));
      let remainingShares;
      const feePerShare = speedomatic.fix(orderCost.fee.abs())
        .dividedBy(speedomatic.fix(orderAmount))
        .times(constants.ONE)
        .floor();
      if (order.type === 'buy') {
        remainingShares = speedomatic.unfix(
          remainingEther.dividedBy(feePerShare)
            .times(constants.ONE)
            .floor());
      } else {
        remainingShares = speedomatic.unfix(
          remainingEther.dividedBy(feePerShare.plus(speedomatic.fix(fullPrecisionPrice)))
            .times(constants.ONE)
            .floor());
      }
      maxPossibleShares = maxPossibleShares.plus(remainingShares);
      break;
    }
  }
  return maxPossibleShares.toString();
}, { max: 100 });

import async from 'async';
import { ROUND_DOWN } from 'bignumber.js';
import uuid from 'uuid';
import uuidParse from 'uuid-parse';
import { BUY, SELL } from '../../trade/constants/types';
import { augur, abi, constants } from '../../../services/augurjs';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { splitAskAndShortAsk } from '../../trade/actions/split-order';
import { placeAsk, placeBid, placeShortAsk } from '../../trade/actions/make-order';
import { placeBuy, placeSell, placeShortSell } from '../../trade/actions/take-order';

export function placeTrade(marketID, outcomeID, isTakeOnly, cb) {
  return (dispatch, getState) => {
    if (!marketID) return null;
    const { loginAccount, marketsData, orderBooks, tradesInProgress } = getState();
    const market = marketsData[marketID];
    if (!tradesInProgress[marketID] || !market || outcomeID == null) {
      console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
      return dispatch(clearTradeInProgress(marketID));
    }
    async.eachSeries(tradesInProgress[marketID], (tradeInProgress, nextTradeInProgress) => {
      if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
        return nextTradeInProgress();
      }
      console.debug('tradeInProgress:', tradeInProgress);

      const tradeGroupID = abi.format_int256(new Buffer(uuidParse.parse(uuid.v4())).toString('hex'));

      console.log('TRADE GROUP ID -- ', tradeGroupID);
      cb && cb(tradeGroupID); // For anything that needs to observe a set of transactions tied to a trade

      const totalCost = abi.bignum(tradeInProgress.totalCost).abs().toFixed();
      const limitPrice = tradeInProgress.limitPrice;
      const numShares = tradeInProgress.numShares;
      const tradingFees = tradeInProgress.tradingFeesEth;

      if (tradeInProgress.side === BUY) {
        const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
        if (tradeIDs && tradeIDs.length) {
          dispatch(placeBuy(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID, isTakeOnly));
        } else if (!isTakeOnly) {
          placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID);
        }
        nextTradeInProgress();
      } else if (tradeInProgress.side === SELL) {

        // check if user has position
        //  - if so, sell/ask
        //  - if not, short sell/short ask
        augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
          if (!sharesPurchased || sharesPurchased.error) return nextTradeInProgress(sharesPurchased);
          const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, ROUND_DOWN);
          const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
          if (position && position.gt(constants.PRECISION.zero)) {
            if (tradeIDs && tradeIDs.length) {
              dispatch(placeSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID, isTakeOnly));
            } else if (!isTakeOnly) {
              const { askShares, shortAskShares } = splitAskAndShortAsk(abi.bignum(numShares), position);
              if (abi.bignum(askShares).gt(constants.PRECISION.zero)) {
                placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
              }
              if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
                placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
              }
            }
          } else if (tradeIDs && tradeIDs.length) {
            dispatch(placeShortSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID, isTakeOnly, cb));
          } else if (!isTakeOnly) {
            placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID);
          }
          nextTradeInProgress();
        });
      }
    }, (err) => {
      if (err) {
        console.error('place trade:', err);
      }

      dispatch(clearTradeInProgress(marketID));
    });
  };
}

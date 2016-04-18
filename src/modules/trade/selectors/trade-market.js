import memoizerific from 'memoizerific';
import { formatEther } from '../../../utils/format-number';

import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';

import store from '../../../store';

import * as TradePanelActions from '../actions/trade-actions';
import * as BidsAsksActions from '../../bids-asks/actions/bids-asks-actions';
import * as MarketsActions from '../../markets/actions/markets-actions';

import { selectTradeOrders } from '../../trade/selectors/trade-orders';

export default function() {
	var { market, tradeInProgress, tradeOrders } = require('../../../selectors');
	return selectTradeMarket(
				market.id,
				market,
				tradeInProgress,
				tradeOrders,
				//bidsAsks[selectedMarketID],
				null,
				store.dispatch);
}

export const selectTradeMarket = memoizerific(10)(function(marketID, market = {}, tradeInProgress = {}, tradeOrders = [], marketBidsAsks = {}, dispatch) {
    var outcomeTradeOrders,
        tradeOutcome,
        askKeys,
        bidKeys,
        o;

    if (!marketID || !market || !market.outcomes) {
    	return {};
    }

    o = {
        ...market,
        tradeOutcomes: []
    };

    o.tradeOutcomes = market.outcomes.map(outcome => {
        //askKeys = Object.keys(marketBidsAsks[outcome.id] && marketBidsAsks[outcome.id][ASK] || {}).sort();
        //bidKeys = Object.keys(marketBidsAsks[outcome.id] && marketBidsAsks[outcome.id][BID] || {}).sort((a, b) => b - a);
        outcomeTradeOrders = tradeOrders.filter(tradeOrder => tradeOrder.data.reportedOutcomeID === outcome.id);

        tradeOutcome = {
            outcomeID: outcome.id,
            outcomeName: outcome.name,
            lastPrice: formatEther(outcome.price),
            //topAsk: formatEther(askKeys[0]),
            //topBid: formatEther(bidKeys[0]),
            feeToPay: formatEther(outcomeTradeOrders.reduce((p, tradeOrder) => p + tradeOrder.data.feeToPay.value, 0)),
            totalCost: formatEther(outcomeTradeOrders.reduce((p, tradeOrder) => p + tradeOrder.ether.value, 0)),
            numShares: tradeInProgress[outcome.id] && tradeInProgress[outcome.id].numShares || 0,
            limitPrice: tradeInProgress[outcome.id] && tradeInProgress[outcome.id].limitPrice || 0,
            onChangeTradesInProgress: function(numShares, limitPrice) { dispatch(TradePanelActions.updateTradesInProgress(marketID, outcome.id, numShares, limitPrice)) }
        };

        return tradeOutcome;
    });

    return o;
});
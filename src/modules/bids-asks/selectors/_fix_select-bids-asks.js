import memoizerific from 'memoizerific';
import { formatShares, formatEther } from '../../../utils/format-number';

import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';

import { selectOutcomes } from '../../markets/selectors/select-outcomes';

export const selectOutcomeBids = function(marketID, outcomeID, bidsAsks) {
    return selectOutcomeBidsAsks(bidsAsks && bidsAsks[marketID] && bidsAsks[marketID][outcomeID] && bidsAsks[marketID][outcomeID][BID], true);
};

export const selectOutcomeAsks = function(marketID, outcomeID, bidsAsks) {
    return selectOutcomeBidsAsks(bidsAsks && bidsAsks[marketID] && bidsAsks[marketID][outcomeID] && bidsAsks[marketID][outcomeID][ASK]);
};

export const selectBidsAsksByPrice = function(marketID, s, dispatch) {
    var { bidsAsks } = s,
        marketBidsAsks = bidsAsks && bidsAsks[marketID],
        outcomes,
        bidKeys,
        askKeys,
        o,
        a = [];

    if (!marketBidsAsks) {
        return a;
    }

    outcomes = selectOutcomes(marketID, s, dispatch);

    if (!outcomes || !outcomes.length) {
        return a;
    }

    outcomes.forEach(outcome => {
        o = {
            ...outcome,
            outcomeID: outcome.id,
            bids: [],
            asks: []
        };

        bidKeys = Object.keys(marketBidsAsks[outcome.id] && marketBidsAsks[outcome.id][BID] || {}).sort((a, b) => b - a);
        askKeys = Object.keys(marketBidsAsks[outcome.id] && marketBidsAsks[outcome.id][ASK] || {}).sort();

        bidKeys.forEach(price => {
            o.bids.push({
                price: formatEther(price),
                shares: formatShares(aggregateShares(marketBidsAsks[outcome.id][BID][price]))
            });
        });

        askKeys.forEach(price => {
            o.asks.push({
                price: formatEther(price),
                shares: formatShares(aggregateShares(marketBidsAsks[outcome.id][ASK][price]))
            });
        });

        a.push(o);
    });

    function aggregateShares(priceCollection) {
        return Object.keys(priceCollection).reduce((numShares, accountID) => numShares + parseFloat(priceCollection[accountID]), 0);
    }

    return a;
};

export const selectOutcomeBidsAsks = memoizerific(100)(function(outcomeBidsOrAsks, isSortDesc) {
    var prices,
        o = [];

    if (!outcomeBidsOrAsks) {
        return o;
    }

    prices = Object.keys(outcomeBidsOrAsks);

    if (isSortDesc) {
        prices.sort((a, b) => b - a);
    }
    else {
        prices.sort();
    }

    prices.forEach(price => Object.keys(outcomeBidsOrAsks[price]).forEach(accountID => {
        o.push({
            accountID,
            price: parseFloat(price) || 0,
            numShares: outcomeBidsOrAsks[price][accountID]
        });
    }));

    return o;
});
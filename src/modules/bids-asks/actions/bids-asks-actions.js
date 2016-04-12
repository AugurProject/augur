import * as AugurJS from '../../../services/augurjs';

import { BID, ASK } from '../../bids-asks/constants/bids-asks-types';

export const UPDATE_BIDSASKS_DATA = 'UPDATE_BIDSASKS_DATA';

export function loadBidsAsks(marketID) {
    return (dispatch, getState) => {
        var s = getState(),
            outcomeKeys = Object.keys(s.outcomes[marketID]);

        if (!s.bidsAsks[marketID]) {
            makeTimedBunch(15, 1000);
            makeTimedBunch(5, 5000);
            makeTimedBunch(5, 10000);
            makeTimedBunch(5, 15000);
            makeTimedBunch(5, 20000);
        }

        function makeTimedBunch(num, millis) {
            num = num || randomInt(1, 10);
            millis = millis || randomInt(500, 10000);

            setTimeout(() => {
                dispatch(updateBidsAsks(makeBunch(num)));
                //makeTimedBunch();
            }, millis);
        }

        function makeBunch(num) {
            var o = {};
            for (var i = 0; i < num; i++) {
                o[Math.random()] = makeBidAsk();
            }
            return o;
        }

        function makeBidAsk() {
            return {
                id: Math.random(),
                marketID: marketID,
                outcomeID: outcomeKeys[randomInt(0, outcomeKeys.length - 1)],
                accountID: Math.random(),
                action: Math.random() >= 0.7 && 'placed' || 'canceled',
                bidOrAsk: Math.random() >= 0.7 && BID || ASK,
                numShares: Math.round(Math.random() * 10000) / 100,
                limitPrice: Math.round(Math.random() * 100) / 100,
            };
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
}

export function updateBidsAsks(bidsAsksData) {
    return { type: UPDATE_BIDSASKS_DATA, bidsAsksData };
}
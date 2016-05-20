import { UPDATE_BIDSASKS_DATA } from '../actions/update-bids-asks';

export default function (bidsAsks = {}, action) {
	let newBidAsk;
	let curr;
	switch (action.type) {
	case UPDATE_BIDSASKS_DATA:
		newBidAsk = {
			...bidsAsks
		};
		Object.keys(action.bidsAsksData || {}).forEach(transactionID => {
			curr = action.bidsAsksData[transactionID];
			if (!curr.id || !curr.marketID || !curr.outcomeID
					|| !curr.action || !curr.accountID || !curr.bidOrAsk
					|| !curr.numShares || !curr.limitPrice) {
				return;
			}

			newBidAsk[curr.marketID] = { ...newBidAsk[curr.marketID] };
			newBidAsk[curr.marketID][curr.outcomeID] = { ...newBidAsk[curr.marketID][curr.outcomeID] };
			newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk] = {
				...newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk]
			};

			// remove from order book
			if (['canceled', 'executed'].indexOf(curr.action)) {
				if (
				!newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice] ||
				!newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]) {
					return;
				}
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID] -=
				curr.numShares;
				if (
				newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]
				< 0
				) {
					delete
					newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID];
				}
				return;
			}

			// add to order book
			newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice]
			= {
				...newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice]
			};
			newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]
			=
			newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]
			|| 0;
			newBidAsk[curr.marketID][curr.outcomeID][curr.bidOrAsk][curr.limitPrice][curr.accountID]
			+= curr.numShares;
		});

		return newBidAsk;
	default:
		return bidsAsks;
	}
}

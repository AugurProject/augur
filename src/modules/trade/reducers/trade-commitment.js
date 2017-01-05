import { UPDATE_TRADE_COMMITMENT } from '../../trade/actions/update-trade-commitment';

export default function (tradeCommitment = [], action) {
	switch (action.type) {
		case UPDATE_TRADE_COMMITMENT:
			return action.tradeIDs.slice();
		default:
			return tradeCommitment;
	}
}

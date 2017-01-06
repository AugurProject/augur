import { UPDATE_TRADE_COMMITMENT } from '../../trade/actions/update-trade-commitment';

export default function (tradeCommitment = {}, action) {
	switch (action.type) {
		case UPDATE_TRADE_COMMITMENT: {
			if (action.tradeCommitment.tradeHash) {
				return action.tradeCommitment;
			}
			return {
				...tradeCommitment,
				...action.tradeCommitment
			};
		}
		default:
			return tradeCommitment;
	}
}

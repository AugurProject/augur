import { UPDATE_BLOCKCHAIN } from '../../app/actions/update-blockchain';

export default function (blockchain = {}, action) {
	switch (action.type) {
		case UPDATE_BLOCKCHAIN:
			return {
				...blockchain,
				...action.data
			};

		default:
			return blockchain;
	}
}

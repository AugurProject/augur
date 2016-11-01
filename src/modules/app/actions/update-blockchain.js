import { rpc } from '../../../services/augurjs';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

export function updateBlockchain(data) {
	return { type: UPDATE_BLOCKCHAIN, data };
}

export function syncBlockchain() {
	return (dispatch, getState) => {
		if (rpc.block && rpc.block.number) {
			dispatch(updateBlockchain({
				currentBlockNumber: rpc.block.number,
				currentBlockMillisSinceEpoch: Date.now()
			}));
		} else {
			rpc.blockNumber((blockNumber) => {
				if (blockNumber && !blockNumber.error) {
					dispatch(updateBlockchain({
						currentBlockNumber: parseInt(blockNumber, 16),
						currentBlockMillisSinceEpoch: Date.now()
					}));
				}
			});
		}
	};
}

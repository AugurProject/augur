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
				currentBlockTimestamp: parseInt(rpc.block.timestamp, 16),
				currentBlockMillisSinceEpoch: Date.now()
			}));
		} else {
			rpc.blockNumber((blockNumber) => {
				if (blockNumber && !blockNumber.error) {
					rpc.getBlock(blockNumber, (block) => {
						if (block && !block.error) {
							dispatch(updateBlockchain({
								currentBlockNumber: parseInt(blockNumber, 16),
								currentBlockTimestamp: parseInt(block.timestamp, 16),
								currentBlockMillisSinceEpoch: Date.now()
							}));
						}
					});
				}
			});
		}
	};
}

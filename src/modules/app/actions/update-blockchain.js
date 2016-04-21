export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

export function updateBlockchain(blockNum) {
	return function(dispatch, getState) {
		var { branch } = getState();

		dispatch({
			type: UPDATE_BLOCKCHAIN,
			data: {
				currentBlockNumber: blockNum,
				currentBlockMillisSinceEpoch: Date.now(),
				currentPeriod: Math.floor(blockNum / branch.periodLength),
				reportPeriod: Math.floor(blockNum / branch.periodLength) - 1,
				isReportConfirmationPhase: (blockNum % branch.periodLength) > (branch.periodLength / 2)
			}
		});
	};
}
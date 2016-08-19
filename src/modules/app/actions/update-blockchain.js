import { augur } from '../../../services/augurjs';
import { checkPeriod } from '../../reports/actions/check-period';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

let isAlreadyUpdatingBlockchain = false;

export function updateBlockchain(runCheckPeriod, cb) {
	return (dispatch, getState) => {
		if (isAlreadyUpdatingBlockchain) return cb && cb();
		isAlreadyUpdatingBlockchain = true;

		// load latest block number
		augur.rpc.blockNumber((blockNumber) => {
			const currentBlockNumber = parseInt(blockNumber, 16);
			if (!currentBlockNumber || currentBlockNumber !== parseInt(currentBlockNumber, 10)) {
				isAlreadyUpdatingBlockchain = false;
				return cb && cb();
			}
			const { branch, blockchain, loginAccount } = getState();
			const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
			const currentPeriodProgress = augur.getCurrentPeriodProgress(branch.periodLength);
			const isReportConfirmationPhase = currentPeriodProgress > 50;
			const isChangedReportPhase = isReportConfirmationPhase !== blockchain.isReportConfirmationPhase;

			augur.getVotePeriod(branch.id, (period) => {
				if (period && period.error) {
					console.error('ERROR getVotePeriod', branch.id, period);
					return cb && cb();
				}
				const reportPeriod = parseInt(period, 10);

				// update blockchain state
				dispatch({
					type: UPDATE_BLOCKCHAIN,
					data: {
						currentBlockNumber,
						currentBlockMillisSinceEpoch: Date.now(),
						currentPeriod,
						isReportConfirmationPhase
					}
				});
				isAlreadyUpdatingBlockchain = false;
				const expectedReportPeriod = blockchain.currentPeriod - 1;
				const isCaughtUpReportPeriod = reportPeriod === expectedReportPeriod;

				// if not logged in, can't increment period
				// if report period is caught up and we're not in a new
				// report phase, callback and exit
				if (loginAccount.id) dispatch(claimProceeds());
				if (!loginAccount.id || (isCaughtUpReportPeriod && !isChangedReportPhase && !runCheckPeriod)) {
					return cb && cb();
				}

				// check if period needs to be incremented / penalizeWrong
				// needs to be called
				dispatch(checkPeriod((err, period) => {
					if (err) console.error('checkPeriod:', err);
					return cb && cb();
				}));
			});
		});
	};
}

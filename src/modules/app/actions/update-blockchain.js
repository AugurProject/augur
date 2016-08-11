import { augur } from '../../../services/augurjs';
import { loadReports } from '../../reports/actions/load-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
import { collectFees } from '../../reports/actions/collect-fees';
import { checkPeriod } from '../../reports/actions/check-period';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

let isAlreadyUpdatingBlockchain = false;
let collectedFees = false;
let revealedReports = false;

export function updateBlockchain(cb) {
	return (dispatch, getState) => {
		if (isAlreadyUpdatingBlockchain) {
			return; // don't trigger cb on this failure
		}
		isAlreadyUpdatingBlockchain = true;

		// load latest block number
		augur.rpc.blockNumber((blockNumber) => {
			const currentBlockNumber = parseInt(blockNumber, 16);
			if (!currentBlockNumber || currentBlockNumber !== parseInt(currentBlockNumber, 10)) {
				isAlreadyUpdatingBlockchain = false;
				return; // don't trigger cb on this failure
			}
			const { branch, blockchain, loginAccount } = getState();
			const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
			const currentPeriodProgress = augur.getCurrentPeriodProgress(branch.periodLength);
			const isChangedCurrentPeriod = currentPeriod !== blockchain.currentPeriod;
			const isReportConfirmationPhase = currentPeriodProgress > 50;
			const isChangedReportPhase = isReportConfirmationPhase !== blockchain.isReportConfirmationPhase;

			if (isChangedCurrentPeriod) {
				collectedFees = false;
				revealedReports = false;
			}

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

			augur.getVotePeriod(branch.id, (period) => {
				if (period && period.error) {
					console.error('ERROR getVotePeriod', branch.id, period);
					isAlreadyUpdatingBlockchain = false;
					return cb && cb();
				}
				const reportPeriod = parseInt(period, 10);
				const expectedReportPeriod = blockchain.currentPeriod - 1;
				const isCaughtUpReportPeriod = reportPeriod === expectedReportPeriod;

				// if not logged in, can't increment period
				// if report period is caught up and we're not in a new
				// report phase, then update report period to match chain's
				if (!loginAccount.id || (isCaughtUpReportPeriod && !isChangedReportPhase)) {
					dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod } });
					isAlreadyUpdatingBlockchain = false;
					return cb && cb();
				}

				// check if period needs to be incremented / penalizeWrong
				// needs to be called
				dispatch(checkPeriod((err, period) => {
					if (err) console.error('checkPeriod:', err);
					dispatch(loadReports((err) => {
						if (err) console.error('loadReports:', err);
						if (isReportConfirmationPhase) {
							if (!collectedFees) {
								dispatch(collectFees());
								collectedFees = true;
							}
							if (!revealedReports) {
								dispatch(revealReports());
								revealedReports = true;
							}
						}
						isAlreadyUpdatingBlockchain = false;
						return cb && cb();
					}));
				}));
			});
		});
	};
}

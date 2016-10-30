import { augur } from '../../../services/augurjs';
import { checkPeriod } from '../../reports/actions/check-period';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const UPDATE_BRANCH = 'UPDATE_BRANCH';

let syncBranchLock = false;

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}

// Synchronize front-end branch state with blockchain branch state.
export function syncBranch(callback) {
	return (dispatch, getState) => {
		console.debug('syncBranchLock:', syncBranchLock);
		if (!syncBranchLock) {
			syncBranchLock = true;
			const { branch } = getState();
			augur.getVotePeriod(branch.id, (period) => {
				if (period && period.error) {
					syncBranchLock = false;
					if (callback) return callback(period || 'could not look up period');
				} else {
					const reportPeriod = parseInt(period, 10);
					const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
					const currentPeriodProgress = augur.getCurrentPeriodProgress(branch.periodLength);
					const isReportConfirmationPhase = currentPeriodProgress > 50;
					dispatch(updateBranch({
						...branch,
						reportPeriod,
						currentPeriod,
						currentPeriodProgress,
						isReportConfirmationPhase
					}));
					const expectedReportPeriod = currentPeriod - 1;
					const isChangedReportPhase = isReportConfirmationPhase !== branch.isReportConfirmationPhase;
					const isCaughtUpReportPeriod = reportPeriod === expectedReportPeriod;
					const { loginAccount } = getState();
					if (loginAccount.id) dispatch(claimProceeds());

					// if not logged in, can't increment period
					// if report period is caught up and we're not in a new
					// report phase, callback and exit
					if (!loginAccount.id || (isCaughtUpReportPeriod && !isChangedReportPhase)) {
						if (callback) return callback(true, reportPeriod);

					// check if period needs to be incremented / penalizeWrong
					// needs to be called
					} else {
						dispatch(checkPeriod((err, period) => {
							if (err) {
								syncBranchLock = false;
								if (callback) return callback(err);
							} else {
								syncBranchLock = false;
								if (callback) return callback(true, period);
							}
						}));
					}
				}
			});
		}
	};
}

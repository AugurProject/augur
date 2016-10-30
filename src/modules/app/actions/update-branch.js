import { augur } from '../../../services/augurjs';
import { checkPeriod } from '../../reports/actions/check-period';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const UPDATE_BRANCH = 'UPDATE_BRANCH';

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}

// Synchronize front-end branch state with blockchain branch state.
export function syncBranch(callback) {
	return (dispatch, getState) => {
		const { branch } = getState();
		augur.getVotePeriod(branch.id, (period) => {
			if (period && period.error) {
				if (callback) return callback(period || 'could not look up period');
			} else {
				const reportPeriod = parseInt(period, 10);
				const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
				const currentPeriodProgress = augur.getCurrentPeriodProgress(branch.periodLength);
				const isReportConfirmationPhase = currentPeriodProgress > 50;
				dispatch(updateBranch({
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
					if (callback) return callback(null, reportPeriod);

				// check if period needs to be incremented / penalizeWrong
				// needs to be called
				} else {
					dispatch(checkPeriod((err, period) => {
						if (err) {
							if (callback) return callback(err);
						} else {
							if (callback) return callback(null, period);
						}
					}));
				}
			}
		});
	};
}

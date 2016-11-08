import moment from 'moment';
import { ONE } from '../../trade/constants/numbers';
import { augur, abi } from '../../../services/augurjs';
import { checkPeriod } from '../../reports/actions/check-period';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const UPDATE_BRANCH = 'UPDATE_BRANCH';

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}

export function reportingCycle(periodLength) {
	const currentPeriod = augur.getCurrentPeriod(periodLength);
	const currentPeriodProgress = augur.getCurrentPeriodProgress(periodLength);
	const isReportRevealPhase = currentPeriodProgress > 50;
	const bnPeriodLength = abi.bignum(periodLength);
	const secondsRemaining = ONE.minus(abi.bignum(currentPeriodProgress).dividedBy(100)).times(bnPeriodLength);
	let phaseLabel;
	let phaseTimeRemaining;
	if (isReportRevealPhase) {
		phaseLabel = 'Reveal';
		phaseTimeRemaining = moment.duration(secondsRemaining.toNumber(), 'seconds').humanize(true);
	} else {
		phaseLabel = 'Commit';
		phaseTimeRemaining = moment.duration(secondsRemaining.minus(bnPeriodLength.dividedBy(2)).toNumber(), 'seconds').humanize(true);
	}
	return {
		currentPeriod,
		currentPeriodProgress,
		isReportRevealPhase,
		phaseLabel,
		phaseTimeRemaining
	};
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
				const reportingCycleInfo = reportingCycle(branch.periodLength);
				dispatch(updateBranch({ reportPeriod, ...reportingCycleInfo }));
				const expectedReportPeriod = reportingCycleInfo.currentPeriod - 1;
				const isChangedReportPhase = reportingCycleInfo.isReportRevealPhase !== branch.isReportRevealPhase;
				const isCaughtUpReportPeriod = reportPeriod === expectedReportPeriod;
				const { loginAccount } = getState();
				if (loginAccount.address) dispatch(claimProceeds());

				// if not logged in, can't increment period
				// if report period is caught up and we're not in a new
				// report phase, callback and exit
				if (!loginAccount.address || (isCaughtUpReportPeriod && !isChangedReportPhase)) {
					if (callback) return callback(null, reportPeriod);

				// check if period needs to be incremented / penalizeWrong
				// needs to be called
				} else {
					dispatch(checkPeriod(isChangedReportPhase, (err, period) => {
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

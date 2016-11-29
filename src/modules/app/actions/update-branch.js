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
export function syncBranch(cb) {
	return (dispatch, getState) => {
		const callback = cb || ((e) => e && console.log('syncBranch:', e));
		const { branch, loginAccount } = getState();
		if (!branch.periodLength) return callback(null);
		const reportingCycleInfo = reportingCycle(branch.periodLength);
		const isChangedReportPhase = reportingCycleInfo.isReportRevealPhase !== branch.isReportRevealPhase;
		dispatch(updateBranch({ ...reportingCycleInfo }));
		if (branch.reportPeriod && (!loginAccount.address || !isChangedReportPhase)) {
			return callback(null);
		}
		console.log('syncBranch: report phase changed');
		augur.getVotePeriod(branch.id, (period) => {
			if (!period || period.error) {
				return callback(period || 'could not look up report period');
			}
			const reportPeriod = parseInt(period, 10);
			dispatch(updateBranch({ reportPeriod }));
			const expectedReportPeriod = reportingCycleInfo.currentPeriod - 1;
			const isCaughtUpReportPeriod = reportPeriod === expectedReportPeriod;
			if (loginAccount.address) dispatch(claimProceeds());

			// check if period needs to be incremented / penalizeWrong
			// needs to be called
			dispatch(checkPeriod(true, (err) => {
				if (err) return callback(err);
				callback(null);
			}));
		});
	};
}

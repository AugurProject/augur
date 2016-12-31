import moment from 'moment';
import { ONE } from '../../trade/constants/numbers';
import { augur, abi } from '../../../services/augurjs';
import { checkPeriod } from '../../reports/actions/check-period';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const UPDATE_BRANCH = 'UPDATE_BRANCH';

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}

export function reportingCycle(periodLength, timestamp) {
	const currentPeriod = augur.getCurrentPeriod(periodLength, timestamp);
	const currentPeriodProgress = augur.getCurrentPeriodProgress(periodLength, timestamp);
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
		const callback = cb || (e => e && console.log('syncBranch:', e));
		const { blockchain, branch, loginAccount } = getState();
		if (!branch.periodLength) return callback(null);
		const reportingCycleInfo = reportingCycle(branch.periodLength, blockchain.currentBlockTimestamp);
		const isChangedReportPhase = reportingCycleInfo.isReportRevealPhase !== branch.isReportRevealPhase;
		dispatch(updateBranch({ ...reportingCycleInfo }));
		if (branch.reportPeriod && (!loginAccount.address || !isChangedReportPhase)) {
			return callback(null);
		}
		augur.getVotePeriod(branch.id, (period) => {
			if (!period || period.error) {
				return callback(period || 'could not look up report period');
			}
			const reportPeriod = parseInt(period, 10);
			dispatch(updateBranch({ reportPeriod }));
			augur.getPenalizedUpTo(branch.id, loginAccount.address, (penalizedUpTo) => {
				if (!penalizedUpTo || penalizedUpTo.error) {
					return callback(penalizedUpTo || 'could not look up last period penalized');
				}
				dispatch(updateBranch({ lastPeriodPenalized: parseInt(penalizedUpTo, 10) }));
				augur.getFeesCollected(branch.id, loginAccount.address, reportPeriod - 2, (feesCollected) => {
					if (!feesCollected || feesCollected.error) {
	                    return callback(feesCollected || 'could not look up fees collected');
	                }
	                dispatch(updateBranch({ feesCollected: feesCollected === '1'}));
					augur.getPast24(period, (past24) => {
						if (!past24 || past24.error) {
							return callback(past24 || 'could not look up past 24');
						}
						dispatch(updateBranch({ numEventsCreatedInPast24Hours: parseInt(past24, 10) }));
						augur.getNumberEvents(branch.id, period, (numberEvents) => {
							if (!numberEvents || numberEvents.error) {
								return callback(numberEvents || 'could not look up number of events');
							}
							dispatch(updateBranch({ numEventsInReportPeriod: parseInt(numberEvents, 10) }));
							if (loginAccount.address) dispatch(claimProceeds());

							// check if period needs to be incremented / penalizeWrong
							// needs to be called
							dispatch(checkPeriod(true, (err) => {
								console.log('checkPeriod done', err);
								if (err) return callback(err);
								callback(null);
							}));
						});
					});
				});
			});
		});
	};
}

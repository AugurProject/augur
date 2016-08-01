import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

// import { revealReports } from '../../reports/actions/reveal-reports';
import { collectFees } from '../../reports/actions/collect-fees';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

let isAlreadyUpdatingBlockchain = false;

export function incrementReportPeriod(cb) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount } = getState();
		const expectedReportPeriod = blockchain.currentPeriod - 1;

		// if not logged in / unlocked or if the report period is as expected, exit
		if (!loginAccount.id || blockchain.reportPeriod === expectedReportPeriod) {
			return cb && cb();
		}

		// load report period from chain to see if that one is as expected
		AugurJS.getReportPeriod(BRANCH_ID, (error, chainReportPeriod) => {
			if (error) {
				console.log('ERROR getReportPeriod1', BRANCH_ID, error);
				return cb && cb();
			}

			const parsedChainReportPeriod = parseInt(chainReportPeriod, 10);

			// if the report period on chain is up-to-date, update ours to match and exit
			if (parsedChainReportPeriod === expectedReportPeriod) {
				dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod: expectedReportPeriod } });
				return cb && cb();
			}

			// if we are the first to encounter the new period, we get the
			// honor of incrementing it on chain for everyone
			AugurJS.incrementPeriodAfterReporting(BRANCH_ID, (err, res) => {
				if (err) {
					console.error('ERROR incrementPeriodAfterReporting()', err);
					return cb && cb();
				}

				// check if it worked out
				AugurJS.getReportPeriod(BRANCH_ID, (er, verifyReportPeriod) => {
					if (er) {
						console.log('ERROR getReportPeriod2', er);
						return cb && cb();
					}
					if (parseInt(verifyReportPeriod, 10) !== expectedReportPeriod) {
						console.warn('Report period not as expected after being incremented, actual:',
						verifyReportPeriod, 'expected:',
						expectedReportPeriod);
						return cb && cb();
					}
					dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod: expectedReportPeriod } });
					return cb && cb();
				});
			});
		});
	};
}

export function updateBlockchain(cb) {
	return (dispatch, getState) => {
		if (isAlreadyUpdatingBlockchain) {
			return; // don't trigger cb on this failure
		}

		isAlreadyUpdatingBlockchain = true;

		// load latest block number
		AugurJS.loadCurrentBlock(currentBlockNumber => {
			const { branch, blockchain, loginAccount } = getState();
			const currentPeriod = AugurJS.getCurrentPeriod(branch.periodLength);
			const currentPeriodProgress = AugurJS.getCurrentPeriodProgress(branch.periodLength);
			const isChangedCurrentPeriod = currentPeriod !== blockchain.currentPeriod;
			const isReportConfirmationPhase = currentPeriodProgress > 50;
			const isChangedReportPhase = isReportConfirmationPhase !== blockchain.isReportConfirmationPhase;

			if (!currentBlockNumber || currentBlockNumber !== parseInt(currentBlockNumber, 10)) {
				return; // don't trigger cb on this failure
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

			// if the report *period* changed this block, do some extra stuff (also triggers the first time blockchain is being set)
			if (isChangedCurrentPeriod && loginAccount.id) {
				console.log('loginAccount:', loginAccount);
				dispatch(incrementReportPeriod(() => {
					// if the report *phase* changed this block, do some extra stuff
					if (isChangedReportPhase) {
						// dispatch(revealReports());
						dispatch(collectFees());
					}

					isAlreadyUpdatingBlockchain = false;
					return cb && cb();
				}));
			} else {
				isAlreadyUpdatingBlockchain = false;
				return cb && cb();
			}
		});
	};
}

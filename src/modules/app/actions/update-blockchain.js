import { augur } from '../../../services/augurjs';
import { revealReports } from '../../reports/actions/reveal-reports';
import { collectFees } from '../../reports/actions/collect-fees';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

let isAlreadyUpdatingBlockchain = false;

export function incrementReportPeriod(cb) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		const expectedReportPeriod = blockchain.currentPeriod - 1;

		// if not logged in / unlocked or if the report period is as expected, exit
		if (!loginAccount.id || blockchain.reportPeriod === expectedReportPeriod) {
			return cb && cb();
		}

		// load report period from chain to see if that one is as expected
		augur.getVotePeriod(branch.id, (chainReportPeriod) => {
			if (chainReportPeriod && chainReportPeriod.error) {
				console.log('ERROR getVotePeriod1', branch.id, chainReportPeriod);
				return cb && cb();
			}
			const parsedChainReportPeriod = parseInt(chainReportPeriod, 10);

			// if the report period on chain is up-to-date, update ours to match and exit
			if (parsedChainReportPeriod === expectedReportPeriod) {
				dispatch({
					type: UPDATE_BLOCKCHAIN,
					data: { reportPeriod: expectedReportPeriod }
				});
				return cb && cb();
			}

			// if we are the first to encounter the new period, we get the
			// honor of incrementing it on chain for everyone
			augur.incrementPeriodAfterReporting({
				branch: branch.id,
				onSent: (res) => {},
				onFailed: (err) => {
					console.error('ERROR incrementPeriodAfterReporting()', err);
					return cb && cb();
				},
				onSuccess: (res) => {
					console.log('incrementPeriod success:', res.callReturn);

					// check if it worked out
					augur.getVotePeriod(branch.id, (reportPeriod) => {
						if (reportPeriod && reportPeriod.error) {
							console.log('ERROR getVotePeriod2', reportPeriod);
							return cb && cb();
						}
						if (parseInt(reportPeriod, 10) !== expectedReportPeriod) {
							console.warn('Report period not as expected after being incremented, actual:',
							reportPeriod, 'expected:',
							expectedReportPeriod);
							return cb && cb();
						}
						dispatch({
							type: UPDATE_BLOCKCHAIN,
							data: { reportPeriod: expectedReportPeriod }
						});
						return cb && cb();
					});
				}
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
		augur.rpc.blockNumber(blockNumber => {
			const currentBlockNumber = parseInt(blockNumber, 16);
			if (!currentBlockNumber || currentBlockNumber !== parseInt(currentBlockNumber, 10)) {
				return; // don't trigger cb on this failure
			}
			const { branch, blockchain, loginAccount } = getState();
			const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
			const currentPeriodProgress = augur.getCurrentPeriodProgress(branch.periodLength);
			const isChangedCurrentPeriod = currentPeriod !== blockchain.currentPeriod;
			const isReportConfirmationPhase = currentPeriodProgress > 50;
			const isChangedReportPhase = isReportConfirmationPhase !== blockchain.isReportConfirmationPhase;

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
				dispatch(incrementReportPeriod(() => {
					isAlreadyUpdatingBlockchain = false;
					return cb && cb();
				}));

			// if just the report *phase* changed this block, do some extra stuff
			} else if (isChangedReportPhase && loginAccount.id) {
				dispatch(revealReports());
				dispatch(collectFees());
				isAlreadyUpdatingBlockchain = false;
				return cb && cb();

			} else {
				isAlreadyUpdatingBlockchain = false;
				return cb && cb();
			}
		});
	};
}

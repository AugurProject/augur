import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { autoReportSequence } from '../../reports/actions/auto-report-sequence';

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN';

export function updateBlockchain(blockNum) {
	return function (dispatch, getState) {

		function incrementPeriod(currentPeriod, periodLength) {
			AugurJS.getReportPeriod(BRANCH_ID, function (reportPeriod) {
				reportPeriod = parseInt(reportPeriod);
				var isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
				if (!isCurrent) {
					var periodsBehind = currentPeriod - reportPeriod - 1;
					console.warn("Branch", BRANCH_ID, "behind", periodsBehind, "periods, incrementing period...");
					AugurJS.incrementPeriodAfterReporting({
						branch: BRANCH_ID,
						onSent: function (result) {
							console.log("incrementPeriod sent:", result);
						},
						onSuccess: function (result) {
							AugurJS.getReportPeriod(BRANCH_ID, function (reportPeriod) {
								var reportPeriod = parseInt(reportPeriod);
								console.debug("Incremented", BRANCH_ID, "to period", reportPeriod);
								AugurJS.rpc.blockNumber(function (blockNumber) {
									blockNumber = parseInt(blockNumber);
									var currentPeriod = Math.floor(blockNumber / periodLength);
									var isCurrent = reportPeriod < (currentPeriod - 1) ? false : true;
									if (!isCurrent) return incrementPeriod(currentPeriod);
									console.debug("Branch caught up!");
									// if we've entered a new half-period, call autoReportSequence
									var isReportConfirmationPhase = (blockNum % branch.periodLength) > (branch.periodLength / 2);
									if (isReportConfirmationPhase !== blockchain.isReportConfirmationPhase) {
										dispatch(autoReportSequence(isReportConfirmationPhase));
									}
									dispatch({
										type: UPDATE_BLOCKCHAIN,
										data: {
											currentBlockNumber: blockNumber,
											currentBlockMillisSinceEpoch: Date.now(),
											currentPeriod: currentPeriod,
											reportPeriod: reportPeriod,
											isReportConfirmationPhase: (blockNumber % periodLength) > (periodLength / 2)
										}
									});
								});
							});
						},
						onFailed: function (err) {
							console.error("incrementPeriod:", err);
						}
					});
				} else {
					AugurJS.rpc.blockNumber(function (blockNumber) {
						blockNumber = parseInt(blockNumber);

						// if we've entered a new half-period, call autoReportSequence
						var isReportConfirmationPhase = (blockNumber % branch.periodLength) > (branch.periodLength / 2);
						if (isReportConfirmationPhase !== blockchain.isReportConfirmationPhase) {
							dispatch(autoReportSequence(isReportConfirmationPhase));
						}

						dispatch({
							type: UPDATE_BLOCKCHAIN,
							data: {
								currentBlockNumber: blockNumber,
								currentBlockMillisSinceEpoch: Date.now(),
								currentPeriod: currentPeriod,
								reportPeriod: reportPeriod,
								isReportConfirmationPhase: (blockNumber % periodLength) > (periodLength / 2)
							}
						});
					});
				}
			});
		}

		var { branch, blockchain, loginAccount } = getState();

		// if not logged in, return simple/calculated values
		var currentPeriod = Math.floor(blockNum / branch.periodLength);
		if (!loginAccount.id) {
			return dispatch({
				type: UPDATE_BLOCKCHAIN,
				data: {
					currentBlockNumber: blockNum,
					currentBlockMillisSinceEpoch: Date.now(),
					currentPeriod: currentPeriod,
					reportPeriod: null,
					isReportConfirmationPhase: (blockNum % branch.periodLength) > (branch.periodLength / 2)
				}
			});
		}

		// increment period if needed
		incrementPeriod(currentPeriod);
	};
}

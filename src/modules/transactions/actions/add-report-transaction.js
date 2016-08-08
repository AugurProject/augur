import { COMMIT_REPORT } from '../../transactions/constants/types';
import { sendCommitReport } from '../../reports/actions/commit-report';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeCommitReportTransaction =
(market, reportedOutcomeID, isUnethical, isIndeterminate, gas, etherWithoutGas, dispatch) => {
	const obj = {
		type: COMMIT_REPORT,
		gas,
		ether: etherWithoutGas,
		data: {
			market,
			outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
			reportedOutcomeID,
			isUnethical,
			isIndeterminate
		},
		action: (transactionID) =>
			dispatch(
				sendCommitReport(
					transactionID, market,
					reportedOutcomeID, isUnethical, isIndeterminate
				)
			)
	};
	return obj;
};

export const addCommitReportTransaction =
(market, reportedOutcomeID, isUnethical, isIndeterminate, gas, etherWithoutGas) =>
    (dispatch, getState) =>
        dispatch(
					addTransaction(
						makeCommitReportTransaction(
							market, reportedOutcomeID, isUnethical, isIndeterminate,
							gas, etherWithoutGas, dispatch
						)
					)
				);

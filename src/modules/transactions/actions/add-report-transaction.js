import { SUBMIT_REPORT } from '../../transactions/constants/types';
import { processReport } from '../../reports/actions/submit-report';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeReportTransaction =
(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas, dispatch) => {
	const obj = {
		type: SUBMIT_REPORT,
		gas,
		ether: etherWithoutGas,
		data: {
			market,
			outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
			reportedOutcomeID,
			isUnethical
		},
		action: (transactionID) =>
			dispatch(
				processReport(
					transactionID, market,
					reportedOutcomeID, isUnethical
				)
			)
	};
	return obj;
};

export const addReportTransaction =
(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas) =>
    (dispatch, getState) =>
        dispatch(
					addTransaction(
						makeReportTransaction(
							market, reportedOutcomeID, isUnethical,
							gas, etherWithoutGas, dispatch
						)
					)
				);

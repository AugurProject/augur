import { SUBMIT_REPORT } from '../../transactions/constants/types';

import { processReport } from '../../reports/actions/submit-report';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addReportTransaction = function(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas) {
    return function(dispatch, getState) {
        dispatch(addTransaction(makeReportTransaction(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas, dispatch)));
    };
};

export const makeReportTransaction = function(market, reportedOutcomeID, isUnethical, gas, etherWithoutGas, dispatch) {
    return {
        type: SUBMIT_REPORT,
        gas,
        ether: etherWithoutGas,
        data: 			{
			market: market,
			outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
			reportedOutcomeID,
			isUnethical
		},
        action: (transactionID) => 	dispatch(processReport(transactionID, market, reportedOutcomeID, isUnethical))
    }
};
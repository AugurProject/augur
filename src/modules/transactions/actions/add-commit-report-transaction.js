import { COMMIT_REPORT } from '../../transactions/constants/types';
import { formatRealEtherEstimate } from '../../../utils/format-number';
import { sendCommitReport } from '../../reports/actions/commit-report';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { augur } from '../../../services/augurjs';

export const makeCommitReportTransaction =
(market, reportedOutcomeID, isUnethical, isIndeterminate, gas, etherWithoutGas, dispatch) => {
	const obj = {
		type: COMMIT_REPORT,
		gas,
		ether: etherWithoutGas,
		data: {
			market,
			marketID: market.id,
			description: market.description,
			outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
			reportedOutcomeID,
			isUnethical,
			isIndeterminate
		},
		gasFees: formatRealEtherEstimate(augur.getTxGasEth({ ...augur.tx.MakeReports.submitReportHash }, augur.rpc.gasPrice)),
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

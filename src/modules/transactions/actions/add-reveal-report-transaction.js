import { formatRealEtherEstimate } from '../../../utils/format-number';
import { augur } from '../../../services/augurjs';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME, BINARY_NO_OUTCOME_NAME, BINARY_YES_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { SUBMITTED, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { REVEAL_REPORT } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

export function addRevealReportTransaction(eventID, marketID, reportedOutcomeID, salt, minValue, maxValue, type, isUnethical, isIndeterminate, callback) {
	return (dispatch, getState) => {
		augur.getDescription(eventID, (eventDescription) => {
			const outcomesData = getState().outcomesData[marketID];
			const isScalar = type === SCALAR;
			let outcome;
			if (type === BINARY) {
				if (reportedOutcomeID === '1') {
					outcome = { name: BINARY_NO_OUTCOME_NAME };
				} else if (reportedOutcomeID === '2') {
					outcome = { name: BINARY_YES_OUTCOME_NAME };
				} else {
					outcome = { name: INDETERMINATE_OUTCOME_NAME };
				}
			} else if (reportedOutcomeID === CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID) {
				outcome = { name: INDETERMINATE_OUTCOME_NAME };
			} else if (isScalar) {
				outcome = outcomesData ? outcomesData[1] : {};
			} else {
				outcome = outcomesData ? outcomesData[reportedOutcomeID] : {};
			}
			const description = eventDescription && eventDescription.length ?
				eventDescription.split('~|>')[0] :
				getState().marketsData[marketID].description;
			const transaction = {
				type: REVEAL_REPORT,
				data: {
					event: eventID,
					marketID,
					outcome,
					description,
					reportedOutcomeID,
					isUnethical,
					isScalar,
					isIndeterminate
				},
				gasFees: formatRealEtherEstimate(augur.getTxGasEth({ ...augur.tx.MakeReports.submitReport }, augur.rpc.gasPrice))
			};
			console.info(REVEAL_REPORT, transaction.data);
			transaction.action = transactionID => dispatch(processRevealReport(
				transactionID,
				eventID,
				reportedOutcomeID,
				salt,
				minValue,
				maxValue,
				type,
				isUnethical,
				isIndeterminate,
				(outcome && outcome.name) ? outcome.name : reportedOutcomeID,
				callback));
			dispatch(addTransaction(transaction));
		});
	};
}

export function processRevealReport(transactionID, eventID, reportedOutcomeID, salt, minValue, maxValue, type, isUnethical, isIndeterminate, outcomeName, callback) {
	return (dispatch, getState) => {
		console.debug('submitReport:', {
			event: eventID,
			report: reportedOutcomeID,
			salt,
			ethics: Number(!isUnethical),
			minValue,
			maxValue,
			type,
			isIndeterminate
		});
		augur.submitReport({
			event: eventID,
			report: reportedOutcomeID,
			salt,
			ethics: Number(!isUnethical),
			minValue,
			maxValue,
			type,
			isIndeterminate,
			onSent: (r) => {
				console.debug('submitReport sent:', r);
				dispatch(updateExistingTransaction(transactionID, {
					status: SUBMITTED,
					message: `revealing reported outcome: ${outcomeName}`
				}));
			},
			onSuccess: (r) => {
				console.debug('submitReport success:', r);
				dispatch(deleteTransaction(transactionID));
				dispatch(updateAssets());
				if (callback) callback(null);
			},
			onFailed: (e) => {
				console.error('submitReport failed:', e);
				dispatch(updateExistingTransaction(transactionID, {
					status: FAILED,
					message: `transaction failed: ${e.message}`
				}));
				dispatch(updateAssets());
				if (callback) callback(e);
			}
		});
	};
}

import { formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { augur } from '../../../services/augurjs';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { SUBMITTED, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { REVEAL_REPORT } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function addRevealReportTransaction(eventID, marketID, reportedOutcomeID, salt, minValue, maxValue, type, isUnethical, isIndeterminate, callback) {
	return (dispatch, getState) => {
		augur.getDescription(eventID, (eventDescription) => {
			const outcomesData = getState().outcomesData[marketID];
			const isScalar = type === SCALAR;
			let outcome;
			if (isScalar) {
				outcome = outcomesData ? outcomesData[1] : {};
			} else if (type === BINARY) {
				outcome = { name: reportedOutcomeID === '1' ? 'No' : 'Yes' };
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
			transaction.action = (transactionID) => dispatch(processRevealReport(
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
				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					hash: r.hash,
					timestamp: r.timestamp,
					message: `revealed reported outcome: ${outcomeName}`,
					gasFees: formatRealEther(r.gasFees)
				}));
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

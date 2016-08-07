import * as AugurJS from '../../../services/augurjs';
import secureRandom from 'secure-random';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { addCommitReportTransaction } from '../../transactions/actions/add-report-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateReports } from '../../reports/actions/update-reports';
import { selectMarketFromEventID } from '../../market/selectors/market';
import { selectMarketLink, selectMarketsLink } from '../../link/selectors/links';

export function commitReport(market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { marketsData, reports } = getState();
		const currentEventID = marketsData[market.id].eventID;

		dispatch(updateReports({ [currentEventID]: { reportHash: true } }));
		dispatch(addCommitReportTransaction(market, reportedOutcomeID, isUnethical, isIndeterminate));

		const nextPendingReportEventID = Object.keys(reports).find(
			eventID =>	!reports[eventID].reportHash
		);
		const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);

		if (nextPendingReportMarket) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		} else {
			selectMarketsLink(dispatch).onClick();
		}
	};
}

export function sendCommitReport(transactionID, market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch } = getState();
		const eventID = market.eventID;

		if (!loginAccount || !loginAccount.id || !eventID || !event || !market || !reportedOutcomeID) {
			return dispatch(
				updateExistingTransaction(
					transactionID,
					{ status: FAILED, message: 'Missing data' }
				)
			);
		}

		dispatch(updateExistingTransaction(transactionID, { status: 'sending...' }));

		const report = {
			reportPeriod: blockchain.reportPeriod.toString(),
			reportedOutcomeID,
			isCategorical: market.type === CATEGORICAL,
			isScalar: market.type === SCALAR,
			isUnethical,
			isIndeterminate,
			salt: bytesToHex(secureRandom(32)),
			reportHash: true
		};

		// If this is a local account, no encryption key is available in the
		// client, so store the report in localStorage instead
		dispatch(updateReports({ [eventID]: report }));

		AugurJS.commitReport(
			branch.id,
			loginAccount,
			eventID,
			report,
			branch.periodLength,
			(err, res) => {
				if (err) {
					console.log('ERROR commitReport', err);
					return dispatch(
						updateExistingTransaction(
							transactionID,
							{ status: FAILED, message: err.message }
						)
					);
				}

				dispatch(updateExistingTransaction(transactionID, { status: res.status }));

				if (res.status === SUCCESS) {
					dispatch(updateReports({ [eventID]: { reportHash: res.reportHash } }));
				}

				return;
			});
	};
}

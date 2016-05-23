import * as AugurJS from '../../../services/augurjs';
import secureRandom from 'secure-random';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { BRANCH_ID } from '../../app/constants/network';
import {
	INDETERMINATE_OUTCOME_ID,
	// INDETERMINATE_OUTCOME_NAME
} from '../../markets/constants/market-outcomes';
import {
	// BINARY,
	CATEGORICAL,
	SCALAR,
	// COMBINATORIAL
} from '../../markets/constants/market-types';
import {
	// PENDING,
	SUCCESS,
	FAILED,
	// CREATING_MARKET
} from '../../transactions/constants/statuses';
import { addReportTransaction } from '../../transactions/actions/add-report-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateReports } from '../../reports/actions/update-reports';
import { selectMarketFromEventID } from '../../market/selectors/market';
import {
	selectMarketLink,
	selectMarketsLink
} from '../../link/selectors/links';

export function submitReport(market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		const { marketsData, reports } = getState();
		const currentEventID = marketsData[market.id].eventID;

		dispatch(updateReports({ [currentEventID]: { reportHash: true } }));
		dispatch(addReportTransaction(market, reportedOutcomeID, isUnethical));

		const nextPendingReportEventID = Object.keys(reports).find(
			eventID =>	!reports[eventID].reportHash
		);
		const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);

		if (nextPendingReportMarket) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		}	else {
			selectMarketsLink(dispatch).onClick();
		}
	};
}

export function processReport(transactionID, market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain } = getState();
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
			isIndeterminate: reportedOutcomeID === INDETERMINATE_OUTCOME_ID,
			isCategorical: market.type === CATEGORICAL,
			isScalar: market.type === SCALAR,
			isUnethical,
			salt: bytesToHex(secureRandom(32)),
			reportHash: true
		};

		dispatch(updateReports({ [eventID]: report }));

		AugurJS.submitReportHash(
			BRANCH_ID,
			loginAccount.id,
			{ ...event, id: eventID },
			report,
			(err, res) => {
				if (err) {
					console.log('ERROR submitReportHash', err);
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

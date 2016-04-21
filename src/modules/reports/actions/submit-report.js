import * as AugurJS from '../../../services/augurjs';

import secureRandom from 'secure-random';
import { bytesToHex } from '../../../utils/bytes-to-hex';

import { BRANCH_ID } from '../../app/constants/network';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';
import { SUBMIT_REPORT } from '../../transactions/constants/types';

import { addTransactions } from '../../transactions/actions/add-transactions';
import { updateTransactions } from '../../transactions/actions/update-transactions';
import { updateReports } from '../../reports/actions/update-reports';

import { selectNewTransaction } from '../../transactions/selectors/transactions';
import { selectMarketFromEventID } from '../../market/selectors/market';
import { selectMarketLink, selectMarketsLink } from '../../link/selectors/links';

export function submitReport(market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		var { marketsData, reports } = getState(),
			currentEventID = marketsData[market.id].eventID;

		dispatch(updateReports({ [currentEventID]: { reportHash: true } }));

		dispatch(addTransactions([selectNewTransaction(
			SUBMIT_REPORT,
			0,
			0,
			0,
			0,
			{
				market: market,
				outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
				reportedOutcomeID,
				isUnethical
			},
			(transactionID) => 	dispatch(processReport(transactionID, market, reportedOutcomeID, isUnethical))
		)]));

		var nextPendingReportEventID = Object.keys(reports).find(eventID => !reports[eventID].reportHash),
			nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);

		if (nextPendingReportMarket) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		}
		else {
			selectMarketsLink(dispatch).onClick();
		}
	};
}

export function processReport(transactionID, market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		var { loginAccount, blockchain } = getState(),
			eventID = market.eventID,
			report;

		if (!loginAccount || !loginAccount.id || !eventID || !event || !market || !reportedOutcomeID ) {
			return dispatch(updateTransactions({
				[transactionID]: { status: FAILED, message: 'Missing data' }
			}));
		}

		dispatch(updateTransactions({
			[transactionID]: { status: 'sending...' }
		}));

		report = {
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

		AugurJS.submitReportHash(BRANCH_ID, loginAccount.id, { ...event, id: eventID }, report, (err, res) => {
			if (err) {
				console.log('ERROR submitReportHash', err);
				return dispatch(updateTransactions({
					[transactionID]: { status: FAILED, message: err.message }
				}));
			}

			dispatch(updateTransactions({
				[transactionID]: { status: res.status }
			}));

			if (res.status === SUCCESS) {
				dispatch(updateReports({ [eventID]: { reportHash: res.reportHash }}));
			}

			return;
		});
	};
}


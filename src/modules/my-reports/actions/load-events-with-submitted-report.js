import { augur, abi } from '../../../services/augurjs';
import store from '../../../store';
import { dateToBlock } from '../../../utils/date-to-block-to-date';
import { updateOldestLoadedEventPeriod } from '../../my-reports/actions/update-oldest-loaded-event-period';
import { updateEventsWithAccountReportData } from '../../my-reports/actions/update-events-with-account-report-data';

export function loadEventsWithSubmittedReport(loadMore) {
	return (dispatch, getState) => {
		const { branch, loginAccount, oldestLoadedEventPeriod } = getState();

		if (branch.id && branch.currentPeriod && loginAccount.id) {
			const oldestLoadedPeriod = oldestLoadedEventPeriod || branch.currentPeriod - 5;

			let startPeriod = !!loadMore ? oldestLoadedPeriod - 5 : oldestLoadedPeriod;

			dispatch(updateOldestLoadedEventPeriod(startPeriod));

			while (startPeriod <= branch.currentPeriod) {
				getEventsWithReports(branch.id, startPeriod, loginAccount.id);
				startPeriod++;
			}
		}
	};
}

function getEventsWithReports(branch, period, accountID) {
	augur.getEventsWithSubmittedReport(branch, period, accountID, (eventIDs) => {
		const events = {};
		(eventIDs || []).forEach(eventID => {
			if (parseInt(eventID, 16)) events[eventID] = { branch, period };
		});

		store.dispatch(updateEventsWithAccountReportData(events));

		loadAdditionalEventData(events);
	});
}

function loadAdditionalEventData(events) {
	const { loginAccount, blockchain } = store.getState();

	const updateEvent = (eventID, data) => {
		const event = {};
		event[eventID] = { ...data };
		store.dispatch(updateEventsWithAccountReportData(event));
	};

	Object.keys(events).forEach(eventID => {
		augur.getExpiration(eventID, expirationDate => {
			if (!!expirationDate) {
				const expDate = new Date(parseInt(expirationDate, 10) * 1000);
				updateEvent(eventID, { expirationDate: expDate });
				const expirationBlock = dateToBlock(expDate, blockchain.currentBlockNumber);
				augur.rpc.getLogs({
					fromBlock: expirationBlock,
					address: augur.contracts.Consensus,
					topics: [abi.format_int256(loginAccount.id)]
				}, repEarned => !!repEarned && updateEvent(eventID, { repEarned }));
			}
		});
		augur.getFinal(eventID, isFinal => !!isFinal && updateEvent(eventID, { isFinal }));
		augur.getMarket(eventID, 0, marketID => { // Simply getting the first market since events -> markets are 1-to-1 currently
			if (!!marketID) {
				updateEvent(eventID, { marketID });
				augur.getFees(marketID, marketFees => !!marketFees && updateEvent(eventID, { marketFees }));
			}
		});
		augur.getOutcome(eventID, marketOutcome => !!marketOutcome && updateEvent(eventID, { marketOutcome }));
		augur.proportionCorrect(eventID, proportionCorrect => !!proportionCorrect && updateEvent(eventID, { proportionCorrect }));
		augur.getReport(events[eventID].branch, events[eventID].period, eventID, loginAccount.id, accountReport => !!accountReport && updateEvent(eventID, { accountReport }));
		augur.getRepBalance(events[eventID].branch, loginAccount.id, repBalance => !!repBalance && updateEvent(eventID, { repBalance }));
		// augur.getEventWeight(events[eventID].branch, events[eventID].period, eventID, eventWeight => !!eventWeight && updateEvent(eventID, { eventWeight }));
		augur.getRoundTwo(eventID, isChallenged => !!isChallenged && updateEvent(eventID, { isChallenged }));
	});
}

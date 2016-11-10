import { augur, abi, rpc } from '../../../services/augurjs';
import store from '../../../store';
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

// TODO optimize RPC requests, this is slooooowwwwww
function loadAdditionalEventData(events) {
	const { branch, loginAccount, reports } = store.getState();

	const updateEvent = (eventID, data) => {
		const event = {};
		event[eventID] = { ...data };
		store.dispatch(updateEventsWithAccountReportData(event));
	};

	const branchReports = reports[branch.id];
	if (branchReports) {
		const eventIDs = Object.keys(branchReports);
		const numEventIDs = eventIDs.length;
		let report;
		let eventID;
		for (let i = 0; i < numEventIDs; ++i) {
			eventID = eventIDs[i];
			report = branchReports[eventID];
			updateEvent(eventID, {
				marketID: report.marketID,
				reportHash: report.reportHash,
				accountReport: report.reportedOutcomeID,
				isUnethical: report.isUnethical,
				isRevealed: report.isRevealed,
				isCommitted: report.isCommitted
			});
		}
	}

	Object.keys(events).forEach(eventID => {
		augur.getExpiration(eventID, (expirationDate) => {
			if (!!expirationDate) {
				updateEvent(eventID, {
					expirationDate: new Date(parseInt(expirationDate, 10) * 1000)
				});
			}
		});
		augur.getMarket(eventID, 0, (marketID) => { // Simply getting the first market since events -> markets are 1-to-1 currently
			if (!!marketID) {
				updateEvent(eventID, { marketID });
				augur.getFees(marketID, marketFees => !!marketFees && updateEvent(eventID, { marketFees }));
			}
		});
		augur.rpc.getLogs({
			fromBlock: loginAccount.registerBlockNumber || '0x1',
			address: augur.contracts.Consensus,
			topics: [
				augur.api.events.penalize.signature,
				abi.format_int256(loginAccount.address)
			]
		}, (logs) => {
			let logData;
			if (logs && logs.length) {
				for (let i = 0, n = logs.length; i < n; ++i) {
					if (logs[i] && logs[i].data && logs[i].data !== '0x') {
						logData = rpc.unmarshal(logs[i].data);
						if (logData.length > 3) {
							updateEvent(eventID, {
								repEarned: abi.unfix(abi.hex(logData[2], true), 'string')
							});
						}
					}
				}
			}
		});
		// augur.getFinal(eventID, isFinal => !!isFinal && updateEvent(eventID, { isFinal: isFinal === '1' }));
		augur.getOutcome(eventID, (marketOutcome) => {
			if (marketOutcome) {
				updateEvent(eventID, { marketOutcome });
				augur.proportionCorrect(eventID, proportionCorrect => !!proportionCorrect && updateEvent(eventID, { proportionCorrect }));
			}
		});
		if (!branchReports || !branchReports[eventID] || !branchReports[eventID].reportedOutcomeID) {
			augur.getReport(events[eventID].branch, events[eventID].period, eventID, loginAccount.address, (accountReport) => {
				if (accountReport && accountReport !== '0' && !accountReport.error) {
					updateEvent(eventID, {
						accountReport,
						isRevealed: true,
						isCommitted: true
					});
					augur.getEthicReport(events[eventID].branch, events[eventID].period, eventID, loginAccount.address, (ethicReport) => {
						if (ethicReport && ethicReport !== '0' && !ethicReport.error) {
							updateEvent(eventID, { isUnethical: ethicReport === '0' });
						}
					});
				}
			});
		}
		// augur.getRepBalance(events[eventID].branch, loginAccount.address, repBalance => !!repBalance && updateEvent(eventID, { repBalance }));
		if (loginAccount.rep !== '0') {
			updateEvent(eventID, { repBalance: loginAccount.rep });
		}
		// augur.getEventWeight(events[eventID].branch, events[eventID].period, eventID, eventWeight => !!eventWeight && updateEvent(eventID, { eventWeight }));
		// augur.getRoundTwo(eventID, isChallenged => !!isChallenged && updateEvent(eventID, { isChallenged: isChallenged === '1' }));
	});
}

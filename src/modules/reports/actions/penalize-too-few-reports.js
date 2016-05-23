import * as AugurJS from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { BRANCH_ID } from '../../app/constants/network';

export function penalizeTooFewReports() {
	return (dispatch, getState) => {
		const { blockchain, loginAccount } = getState();
		const branchID = BRANCH_ID;
		const previousReportPeriod = blockchain.reportPeriod - 1;

		if (blockchain.isReportConfirmationPhase || !loginAccount.rep) {
			return;
		}

		AugurJS.getReportedPeriod(branchID, previousReportPeriod, loginAccount, reported => {
			// if the reporter submitted a report during the previous period,
			// penalize if they did not submit enough reports.
			if (reported === '1') {
				AugurJS.penalizeNotEnoughReports(branchID, (err, res) => {
					if (err) {
						console.log('ERROR getReportedPeriod', err);
						return;
					}
					console.log('------> penalizeNotEnoughReports', res);
					dispatch(updateAssets());
				});
			} else {
				// if the reporter did not submit a report during the previous period,
				// dock 10% for each report-less period.
				AugurJS.penalizationCatchup(branchID, (err, res) => {
					if (err) {
						console.log('ERROR penalizationCatchup', err);
						return;
					}
					console.log('------> penalizationCatchup', res);
					dispatch(updateAssets());
				});
			}
		});
	};
}

import { augur } from '../../../services/augurjs';

export function checkPeriod() {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		console.log('checkPeriod', !blockchain.isReportConfirmationPhase, loginAccount.rep);
		if (!blockchain.isReportConfirmationPhase && loginAccount.rep) {
			augur.checkPeriod(branch.id, branch.periodLength, loginAccount.id, (err, period) => {
				if (err) console.log('checkPeriod failed:', err);
				console.log('checkPeriod:', period);
				dispatch({ type: 'CHECK_PERIOD' });
			});
		}
	};
}

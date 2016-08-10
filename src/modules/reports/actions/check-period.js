import { augur } from '../../../services/augurjs';
import { UPDATE_BLOCKCHAIN } from '../../app/actions/update-blockchain';

export function checkPeriod(cb) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		console.log('checkPeriod:', !blockchain.isReportConfirmationPhase, loginAccount.rep);
		if (!blockchain.isReportConfirmationPhase && loginAccount.rep) {
			augur.checkPeriod(branch.id, branch.periodLength, loginAccount.id, (err, reportPeriod) => {
				if (err) return cb(err);
				dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod } });
				cb(null, reportPeriod);
			});
		}
	};
}

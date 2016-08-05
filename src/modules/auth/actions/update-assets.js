import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { updateLoginAccount } from '../../auth/actions/update-login-account';

export function updateAssets() {
	return (dispatch, getState) => {
		const { loginAccount, branch } = getState();
		if (!loginAccount.id) {
			return dispatch(updateLoginAccount({
				ether: undefined,
				realEther: undefined,
				rep: undefined }));
		}
		AugurJS.loadAssets(branch.id || BRANCH_ID, loginAccount.id,
			(err, ether) => {
				if (err) {
					console.info('!! ERROR updateAssets() ether', err);
					return;
				}
				if (!loginAccount.ether || loginAccount.ether !== ether) {
					return dispatch(updateLoginAccount({ ether }));
				}
			},
			(err, rep) => {
				if (err) {
					console.info('!! ERROR updateAssets() rep', err);
					return;
				}
				if (!loginAccount.rep || loginAccount.rep !== rep) {
					return dispatch(updateLoginAccount({ rep }));
				}
			},
			(err, realEther) => {
				if (err) {
					console.info('!! ERROR updateAssets() real-ether', realEther);
					return;
				}

				if (!loginAccount.realEther || loginAccount.realEther !== realEther) {
					return dispatch(updateLoginAccount({ realEther }));
				}
			}
		);
	};
}

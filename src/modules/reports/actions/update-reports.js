export const UPDATE_REPORTS = 'UPDATE_REPORTS';
export const CLEAR_REPORTS = 'CLEAR_REPORTS';

function saveReportsToLocalStorage(reports, account) {
	console.debug('Saving reports for', account, 'to localStorage...');
	const localStorageRef = typeof window !== 'undefined' && window.localStorage;
	if (localStorageRef && localStorageRef.setItem && localStorageRef.getItem) {
		const storedInfo = localStorageRef.getItem(account);
		if (storedInfo) {
			storedInfo.reports = JSON.parse(storedInfo).reports;
		}
		localStorageRef.setItem(account, JSON.stringify(storedInfo));
	}
}

export function updateReports(reports) {
	return (dispatch, getState) => {
		const { loginAccount } = getState();

		// If this is a local account, no encryption key is available in the
		// client, so store the report in localStorage instead of on-chain
		if (loginAccount.id && !loginAccount.derivedKey) {
			saveReportsToLocalStorage(reports, loginAccount.id);
		}
		dispatch({ type: UPDATE_REPORTS, reports });
	};
}

export function clearReports() {
	return { type: CLEAR_REPORTS };
}

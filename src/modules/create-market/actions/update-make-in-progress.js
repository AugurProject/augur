export const UPDATE_MAKE_IN_PROGRESS = 'UPDATE_MAKE_IN_PROGRESS';
export const CLEAR_MAKE_IN_PROGRESS = 'CLEAR_MAKE_IN_PROGRESS';

export function updateMakeInProgress(data) {
	return { type: UPDATE_MAKE_IN_PROGRESS, data };
}

export function clearMakeInProgress() {
	return { type: CLEAR_MAKE_IN_PROGRESS };
}
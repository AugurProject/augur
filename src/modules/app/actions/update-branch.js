export const UPDATE_BRANCH = 'UPDATE_BRANCH';

export function updateBranch(branch) {
	return { type: UPDATE_BRANCH, branch };
}
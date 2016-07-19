export default {
	selectedUserOpenOrdersGroupID: null,
	updateSelectedUserOpenOrdersGroup: (selectedUserOpenOrdersGroupID) => {
		const selectors = require('../selectors');
		selectors.update({
			selectedUserOpenOrdersGroup: {
				...selectors.selectedUserOpenOrdersGroup,
				selectedUserOpenOrdersGroupID
			}
		});
	}
};

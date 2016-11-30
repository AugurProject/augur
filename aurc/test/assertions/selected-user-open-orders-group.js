import { assert } from 'chai';

export default function (selectedUserOpenOrdersGroup) {
	describe('augur-ui-react-components selectedUserOpenOrdersGroup', () => {
		it('should exist', () => {
			assert.isDefined(selectedUserOpenOrdersGroup, `selectedUserOpenOrdersGroup is empty.`);
		});

		it('should be object', () => {
			assert.isObject(selectedUserOpenOrdersGroup, `selectedUserOpenOrdersGroup is not object.`);
		});

		describe('selectedUserOpenOrdersGroupID', () => {
			it('should exist', () => {
				assert.isDefined(selectedUserOpenOrdersGroup.selectedUserOpenOrdersGroupID, `selectedUserOpenOrdersGroupID is not defined.`);
			});
		});

		describe('updateSelectedUserOpenOrdersGroup', () => {
			it('should be function', () => {
				assert.isFunction(selectedUserOpenOrdersGroup.updateSelectedUserOpenOrdersGroup, `updateSelectedUserOpenOrdersGroup is not function.`);
			});
		});
	});
};

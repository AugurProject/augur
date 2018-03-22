

export default function (selectedUserOpenOrdersGroup) {
  describe('selectedUserOpenOrdersGroup', () => {
    it('should exist', () => {
      assert.isDefined(selectedUserOpenOrdersGroup, `selectedUserOpenOrdersGroup is empty.`)
    })

    it('should be object', () => {
      assert.isObject(selectedUserOpenOrdersGroup, `selectedUserOpenOrdersGroup is not object.`)
    })

    describe('selectedUserOpenOrdersGroupId', () => {
      it('should exist', () => {
        assert.isDefined(selectedUserOpenOrdersGroup.selectedUserOpenOrdersGroupId, `selectedUserOpenOrdersGroupId is not defined.`)
      })
    })

    describe('updateSelectedUserOpenOrdersGroup', () => {
      it('should be function', () => {
        assert.isFunction(selectedUserOpenOrdersGroup.updateSelectedUserOpenOrdersGroup, `updateSelectedUserOpenOrdersGroup is not function.`)
      })
    })
  })
}

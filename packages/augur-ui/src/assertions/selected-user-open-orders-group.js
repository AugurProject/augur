export default function(selectedUserOpenOrdersGroup) {
  describe("selectedUserOpenOrdersGroup", () => {
    test("should exist", () => {
      expect(selectedUserOpenOrdersGroup).toBeDefined();
    });

    test("should be object", () => {
      expect(typeof selectedUserOpenOrdersGroup).toBe("object");
    });

    describe("selectedUserOpenOrdersGroupId", () => {
      test("should exist", () => {
        expect(selectedUserOpenOrdersGroup.selectedUserOpenOrdersGroupId).toBeDefined();
      });
    });

    describe("updateSelectedUserOpenOrdersGroup", () => {
      test("should be function", () => {
        expect(typeof selectedUserOpenOrdersGroup.updateSelectedUserOpenOrdersGroup).toBe("function");
      });
    });
  });
}

describe("modules/orders/helpers/is-order-of-user.js", () => {
  const { isOrderOfUser } = require("modules/orders/helpers/is-order-of-user");

  describe("isOrderOfUser", () => {
    test("should return false if order is not of user", () => {
      expect(isOrderOfUser({ owner: "owner_address" })).toBeFalsy();
      expect(
        isOrderOfUser({ owner: "owner_address" }, "some other address")
      ).toBeFalsy();
    });

    test("should return correct ", () => {
      expect(
        isOrderOfUser({ owner: "owner_address" }, "owner_address")
      ).toBeTruthy();
    });
  });
});

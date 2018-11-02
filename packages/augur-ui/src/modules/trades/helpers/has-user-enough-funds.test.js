import { formatEther } from "utils/format-number";

describe("modules/trades/helpers/has-user-enough-funds.js", () => {
  const hasUserEnoughFunds = require("modules/trades/helpers/has-user-enough-funds")
    .default;

  test(`should return false if user doesn't have enough money`, () => {
    expect(
      hasUserEnoughFunds([], { address: "address", ether: undefined })
    ).toBe(false);
    expect(hasUserEnoughFunds([], { address: "address", ether: null })).toBe(
      false
    );
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("11") }], {
        address: "address",
        ether: "10"
      })
    ).toBe(false);
    expect(
      hasUserEnoughFunds([], { address: "address", ether: undefined })
    ).toBe(false);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], {
        address: "address",
        ether: "0"
      })
    ).toBe(false);
  });

  test(`should return false if user has no id defined`, () => {
    expect(hasUserEnoughFunds([], { address: null, ether: undefined })).toBe(
      false
    );
    expect(
      hasUserEnoughFunds([], { address: undefined, ether: undefined })
    ).toBe(false);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], {
        address: null,
        ether: "10"
      })
    ).toBe(false);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], {
        address: undefined,
        ether: "10"
      })
    ).toBe(false);
  });

  test(`should return false if there is no logged in user`, () => {
    expect(hasUserEnoughFunds([], undefined)).toBe(false);
    expect(hasUserEnoughFunds([], null)).toBe(false);
    expect(hasUserEnoughFunds([], {})).toBe(false);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], null)
    ).toBe(false);
    expect(
      hasUserEnoughFunds(
        [{ side: "buy", totalCost: formatEther("10") }],
        undefined
      )
    ).toBe(false);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], {})
    ).toBe(false);
  });

  test("should return true if user has enough money", () => {
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("10") }], {
        address: "address",
        ether: "10"
      })
    ).toBe(true);
    expect(
      hasUserEnoughFunds([{ side: "buy", totalCost: formatEther("9") }], {
        address: "address",
        ether: "10"
      })
    ).toBe(true);
  });
});

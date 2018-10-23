import insufficientFunds from "modules/markets/helpers/insufficient-funds";

jest.mock("utils/log-error");

describe("src/modules/markets/helpers/insufficient-funds.js", () => {
  describe("when user has insufficient ETH", () => {
    test("should output 'ETH'", () => {
      const validityBond = 0.01;
      const gasCost = 0.001;
      const designatedReportNoShowReputationBond = 0.035;
      const availableEth = 0.001;
      const availableRep = 10;

      const expected = "ETH";
      const result = insufficientFunds(
        validityBond,
        gasCost,
        designatedReportNoShowReputationBond,
        availableEth,
        availableRep
      );

      expect(result).toEqual(expected);
    });
  });
  describe("when user has insufficient REP", () => {
    test("should output 'REP'", () => {
      const validityBond = 0.01;
      const gasCost = 0.001;
      const designatedReportNoShowReputationBond = 0.035;
      const availableEth = 10;
      const availableRep = 0.03;

      const expected = "REP";
      const result = insufficientFunds(
        validityBond,
        gasCost,
        designatedReportNoShowReputationBond,
        availableEth,
        availableRep
      );

      expect(result).toEqual(expected);
    });
  });
  describe("when user has insufficient ETH and REP", () => {
    test("should output 'ETH and REP'", () => {
      const validityBond = 0.01;
      const gasCost = 0.001;
      const designatedReportNoShowReputationBond = 0.035;
      const availableEth = 0.001;
      const availableRep = 0.03;

      const expected = "ETH and REP";
      const result = insufficientFunds(
        validityBond,
        gasCost,
        designatedReportNoShowReputationBond,
        availableEth,
        availableRep
      );

      expect(result).toEqual(expected);
    });
  });
  describe("when user has sufficient funds", () => {
    test("should output empty string", () => {
      const validityBond = 0.01;
      const gasCost = 0.001;
      const designatedReportNoShowReputationBond = 0.035;
      const availableEth = 0.035;
      const availableRep = 0.035;

      const expected = "";
      const result = insufficientFunds(
        validityBond,
        gasCost,
        designatedReportNoShowReputationBond,
        availableEth,
        availableRep
      );

      expect(result).toEqual(expected);
    });
  });
});

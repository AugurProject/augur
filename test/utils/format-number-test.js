import * as formatNumber from "utils/format-number";

describe("utils/format-number.js", () => {
  const num = 1000.1;
  const utils = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: "1,000.1000",
        rounded: "1,000.1000",
        minimized: "1,000.1",
        denomination: " ETH",
        full: "1,000.1000 ETH",
        fullPrecision: "1000.1"
      }
    },
    {
      func: "formatEtherEstimate",
      denom: "ETH (estimated)",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: "1,000.1000",
        rounded: "1,000.1000",
        minimized: "1,000.1",
        denomination: " ETH (estimated)",
        full: "1,000.1000 ETH (estimated)",
        fullPrecision: "1000.1"
      }
    },
    {
      func: "formatPercent",
      denom: "%",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000,
        formatted: "1,000.10",
        rounded: "1,000",
        minimized: "1,000.1",
        denomination: "%",
        full: "1,000.10%",
        fullPrecision: "1000.1"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: "1,000.1000",
        rounded: "1,000.1000",
        minimized: "1,000.1",
        denomination: " Shares",
        full: "1,000.1000 Shares",
        fullPrecision: "1000.1"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      num: 1,
      out: {
        value: 1,
        formattedValue: 1,
        roundedValue: 1,
        formatted: "1.0000",
        rounded: "1.0000",
        minimized: "1",
        denomination: " Share",
        full: "1.0000 Share",
        fullPrecision: "1"
      }
    },
    {
      func: "formatRep",
      denom: "REP",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000,
        formatted: "1,000.1000",
        rounded: "1,000",
        minimized: "1,000.1",
        denomination: " REP",
        full: "1,000.1000 REP",
        fullPrecision: "1000.1"
      }
    },
    {
      func: "formatRepTokens",
      denom: "REP",
      out: {
        value: 1000.1,
        formattedValue: 1000.1,
        roundedValue: 1000.1,
        formatted: "1,000.10",
        rounded: "1,000.10",
        minimized: "1,000.1",
        denomination: " REP Tokens",
        full: "1,000.10 REP Tokens",
        fullPrecision: "1000.1"
      }
    }
  ];

  utils.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      it("should return a correctly formatted object", () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num),
          currentUtil.out,
          "returned formatted number is not correctly formatted"
        );
      });
    });
  });

  const num2 = 0.0000340524;
  const utils2 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: 0.0000340524,
        formattedValue: 0.00003405,
        roundedValue: 0,
        formatted: "0.000034",
        rounded: "0.0000",
        minimized: "0.00003405",
        denomination: " ETH",
        full: "0.000034 ETH",
        fullPrecision: "0.0000340524"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: 0.0000340524,
        formattedValue: 0.00003405,
        roundedValue: 0,
        formatted: "0.000034",
        rounded: "0.0000",
        minimized: "0.00003405",
        denomination: " Shares",
        full: "0.000034 Shares",
        fullPrecision: "0.0000340524"
      }
    }
  ];

  utils2.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      it("should return a correctly formatted object", () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num2),
          currentUtil.out,
          "returned formatted number is not correctly formatted"
        );
      });
    });
  });

  const num3 = 0.000998;
  const utils3 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: 0.000998,
        formattedValue: 0.000998,
        roundedValue: 0.001,
        formatted: "0.0010",
        rounded: "0.0010",
        minimized: "0.000998",
        denomination: " ETH",
        full: "0.0010 ETH",
        fullPrecision: "0.000998"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: 0.000998,
        formattedValue: 0.000998,
        roundedValue: 0.0009,
        formatted: "0.0010",
        rounded: "0.0009",
        minimized: "0.000998",
        denomination: " Shares",
        full: "0.0010 Shares",
        fullPrecision: "0.000998"
      }
    }
  ];

  utils3.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      it("should return a correctly formatted object", () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num3),
          currentUtil.out,
          "returned formatted number is not correctly formatted"
        );
      });
    });
  });

  const num4 = 0.00000021034;
  const utils4 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: 0.00000021034,
        formattedValue: 2.103e-7,
        roundedValue: 0,
        formatted: "0.00000021",
        rounded: "0.0000",
        minimized: "0.0000002103",
        denomination: " ETH",
        full: "0.00000021 ETH",
        fullPrecision: "0.00000021034"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: 0.00000021034,
        formattedValue: 2.103e-7,
        roundedValue: 0,
        formatted: "0.00000021",
        rounded: "0.0000",
        minimized: "0.0000002103",
        denomination: " Shares",
        full: "0.00000021 Shares",
        fullPrecision: "0.00000021034"
      }
    }
  ];

  utils4.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      it("should return a correctly formatted object", () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num4),
          currentUtil.out,
          "returned formatted number is not correctly formatted"
        );
      });
    });
  });

  const num5 = 0.0000000000234;
  const utils5 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: 0.0000000000234,
        formattedValue: 2.34e-11,
        roundedValue: 0,
        formatted: "0.0000",
        rounded: "0.0000",
        minimized: "0.0000000000234",
        denomination: " ETH",
        full: "0.0000 ETH",
        fullPrecision: "0.0000000000234"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: 0.0000000000234,
        formattedValue: 2.34e-11,
        roundedValue: 0,
        formatted: "0.0000",
        rounded: "0.0000",
        minimized: "0.0000000000234",
        denomination: " Shares",
        full: "0.0000 Shares",
        fullPrecision: "0.0000000000234"
      }
    }
  ];

  utils5.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      it("should return a correctly formatted object", () => {
        assert.deepEqual(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num5),
          currentUtil.out,
          "returned formatted number is not correctly formatted"
        );
      });
    });
  });

  describe("formatNone", () => {
    it("should return a properly formatted `none` number object", () => {
      const out = {
        value: 0,
        formattedValue: 0,
        formatted: "-",
        roundedValue: 0,
        rounded: "-",
        minimized: "-",
        denomination: "",
        full: "-"
      };

      assert.deepEqual(
        formatNumber.formatNone(),
        out,
        "returned `none` formatted number object was not correct formatted"
      );
    });
  });

  describe("format gas cost", () => {
    it("should return a properly formatted gas cost number", () => {
      assert.deepEqual(
        formatNumber.formatGasCostToEther(
          "0x632ea0",
          { decimalsRounded: 4 },
          20000000
        ),
        "0.0001",
        "returned gas cost formated in ether"
      );
    });
  });

  describe("format gas cost different gas", () => {
    it("should return a properly formatted gas cost number", () => {
      assert.deepEqual(
        formatNumber.formatGasCostToEther(
          "0x632ea0",
          { decimalsRounded: 8 },
          20000000
        ),
        "0.00013000",
        "returned gas cost formated in ether given gas price"
      );
    });
  });

  describe("format attoETH", () => {
    it("should return a properly formatted attoETH number", () => {
      const result = formatNumber.formatAttoEth("349680582682291650", {
        decimals: 4
      });
      assert.deepEqual(
        result.formatted,
        "0.3497",
        "returned attoETH formated to 4 decimals"
      );
    });
  });

  describe("format attoREP", () => {
    it("should return a properly formatted attoREP number", () => {
      const result = formatNumber.formatAttoRep("349680582682291650", {
        decimals: 4
      });
      assert.deepEqual(
        result.formatted,
        "0.3497",
        "returned attoREP formated to 4 decimals"
      );
    });
  });

  describe("format largish attoREP", () => {
    it("should return a properly formatted attoREP number", () => {
      const result = formatNumber.formatAttoRep("3496805826822916500000", {
        decimals: 4
      });
      assert.deepEqual(
        result.formatted,
        "3,496.8058",
        "returned larger formatted attoREP to 4 decimals"
      );
    });
  });
});

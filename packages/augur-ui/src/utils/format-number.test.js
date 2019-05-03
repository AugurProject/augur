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
        roundedFormatted: "1,000.1000",
        minimized: "1,000.1",
        rounded: "1000.1",
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
        roundedFormatted: "1,000.1000",
        minimized: "1,000.1",
        rounded: "1000.1",
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
        roundedFormatted: "1,000",
        minimized: "1,000.1",
        rounded: "1000",
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
        roundedFormatted: "1,000.1000",
        minimized: "1,000.1",
        rounded: "1000.1",
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
        roundedFormatted: "1.0000",
        minimized: "1",
        rounded: "1",
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
        roundedFormatted: "1,000",
        minimized: "1,000.1",
        rounded: "1000",
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
        roundedFormatted: "1,000.10",
        minimized: "1,000.1",
        rounded: "1000.1",
        denomination: " REP Tokens",
        full: "1,000.10 REP Tokens",
        fullPrecision: "1000.1"
      }
    }
  ];

  utils.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num)
        ).toEqual(currentUtil.out);
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
        roundedFormatted: "0.0000",
        minimized: "0.00003405",
        rounded: "0",
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
        roundedFormatted: "0.0000",
        minimized: "0.00003405",
        rounded: "0",
        denomination: " Shares",
        full: "0.000034 Shares",
        fullPrecision: "0.0000340524"
      }
    }
  ];

  utils2.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num2)
        ).toEqual(currentUtil.out);
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
        roundedFormatted: "0.0010",
        minimized: "0.000998",
        rounded: "0.001",
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
        roundedFormatted: "0.0009",
        minimized: "0.000998",
        rounded: "0.0009",
        denomination: " Shares",
        full: "0.0010 Shares",
        fullPrecision: "0.000998"
      }
    }
  ];

  utils3.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num3)
        ).toEqual(currentUtil.out);
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
        roundedFormatted: "0.0000",
        minimized: "0.0000002103",
        rounded: "0",
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
        roundedFormatted: "0.0000",
        minimized: "0.0000002103",
        rounded: "0",
        denomination: " Shares",
        full: "0.00000021 Shares",
        fullPrecision: "0.00000021034"
      }
    }
  ];

  utils4.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num4)
        ).toEqual(currentUtil.out);
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
        roundedFormatted: "0.0000",
        minimized: "0.0000000000234",
        rounded: "0",
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
        roundedFormatted: "0.0000",
        minimized: "0.0000000000234",
        rounded: "0",
        denomination: " Shares",
        full: "0.0000 Shares",
        fullPrecision: "0.0000000000234"
      }
    }
  ];

  utils5.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num5)
        ).toEqual(currentUtil.out);
      });
    });
  });

  const num6 = -0.0000000000234;
  const utils6 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: -0.0000000000234,
        formattedValue: -2.34e-11,
        roundedValue: -0,
        formatted: "0.0000",
        roundedFormatted: "0.0000",
        minimized: "-0.0000000000234",
        rounded: "0",
        denomination: " ETH",
        full: "0.0000 ETH",
        fullPrecision: "-0.0000000000234"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: -0.0000000000234,
        formattedValue: -2.34e-11,
        roundedValue: -0,
        formatted: "0.0000",
        roundedFormatted: "0.0000",
        minimized: "-0.0000000000234",
        rounded: "0",
        denomination: " Shares",
        full: "0.0000 Shares",
        fullPrecision: "-0.0000000000234"
      }
    }
  ];

  utils6.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num6)
        ).toEqual(currentUtil.out);
      });
    });
  });

  const num7 = -0.00004;
  const utils7 = [
    {
      func: "formatEther",
      denom: "ETH",
      out: {
        value: -0.00004,
        formattedValue: -0.00004,
        roundedValue: -0,
        formatted: "-0.000040",
        roundedFormatted: "0.0000",
        minimized: "-0.00004",
        rounded: "0",
        denomination: " ETH",
        full: "-0.000040 ETH",
        fullPrecision: "-0.00004"
      }
    },
    {
      func: "formatShares",
      denom: "Shares",
      out: {
        value: -0.00004,
        formattedValue: -0.00004,
        roundedValue: -0,
        formatted: "-0.000040",
        roundedFormatted: "0.0000",
        minimized: "-0.00004",
        rounded: "0",
        denomination: " Shares",
        full: "-0.000040 Shares",
        fullPrecision: "-0.00004"
      }
    }
  ];

  utils7.forEach(currentUtil => {
    describe(`${currentUtil.func}`, () => {
      test("should return a correctly formatted object", () => {
        expect(
          formatNumber[`${currentUtil.func}`](currentUtil.num || num7)
        ).toEqual(currentUtil.out);
      });
    });

    describe("formatNone", () => {
      test("should return a properly formatted `none` number object", () => {
        const out = {
          value: 0,
          formattedValue: 0,
          formatted: "-",
          roundedValue: 0,
          roundedFormatted: "-",
          minimized: "-",
          rounded: "-",
          denomination: "",
          full: "-",
          fullPrecision: "0"
        };

        expect(formatNumber.formatNone()).toEqual(out);
      });
    });

    describe("format gas cost", () => {
      test("should return a properly formatted gas cost number", () => {
        expect(
          formatNumber.formatGasCostToEther(
            "0x632ea0",
            { decimalsRounded: 4 },
            20000000
          )
        ).toEqual("0.0001");
      });
    });

    describe("format gas cost different gas", () => {
      test("should return a properly formatted gas cost number", () => {
        expect(
          formatNumber.formatGasCostToEther(
            "0x632ea0",
            { decimalsRounded: 8 },
            20000000
          )
        ).toEqual("0.00013000");
      });
    });

    describe("format attoETH", () => {
      test("should return a properly formatted attoETH number", () => {
        const result = formatNumber.formatAttoEth("349680582682291650", {
          decimals: 4
        });
        expect(result.formatted).toEqual("0.3497");
      });
    });

    describe("format attoREP", () => {
      test("should return a properly formatted attoREP number", () => {
        const result = formatNumber.formatAttoRep("349680582682291650", {
          decimals: 4
        });
        expect(result.formatted).toBe("0.3497");
      });
    });

    describe("format largish attoREP", () => {
      test("should return a properly formatted attoREP number", () => {
        const result = formatNumber.formatAttoRep("3496805826822916500000", {
          decimals: 4
        });

        expect(result.formatted).toBe("3,496.8058");
      });
    });
  });
});

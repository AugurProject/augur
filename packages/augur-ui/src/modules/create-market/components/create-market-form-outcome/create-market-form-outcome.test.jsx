import React from "react";
import { shallow } from "enzyme";
import CreateMarketOutcome from "modules/create-market/components/create-market-form-outcome/create-market-form-outcome";
import { SCALAR } from "modules/markets/constants/market-types";
import { createBigNumber } from "utils/create-big-number";

describe("create-market-form-outcome", () => {
  let cmp;
  let isValidSpy;
  let newMarket;
  let updateNewMarketSpy;
  let validateFieldSpy;

  beforeEach(() => {
    newMarket = {
      isValid: false,
      validations: [
        {
          description: null,
          category: null,
          tag1: "",
          tag2: ""
        },
        {
          type: null
        },
        {
          designatedReporterType: null,
          designatedReporterAddress: null,
          expirySourceType: null,
          endTime: null,
          hour: null,
          minute: null,
          meridiem: null
        },
        {
          settlementFee: ""
        }
      ],
      currentStep: 0,
      type: "",
      outcomes: Array(8).fill(""),
      scalarSmallNum: "",
      scalarBigNum: "",
      scalarDenomination: "",
      description: "",
      expirySourceType: "",
      expirySource: "",
      designatedReporterType: "",
      designatedReporterAddress: "",
      endTime: {},
      hour: "",
      minute: "",
      meridiem: "",
      detailsText: "",
      category: "",
      tag1: "",
      tag2: "",
      orderBook: {},
      orderBookSorted: {},
      orderBookSeries: {},
      initialLiquidityEth: createBigNumber(0),
      initialLiquidityGas: createBigNumber(0),
      creationError:
        "Unable to create market.  Ensure your market is unique and all values are valid."
    };

    isValidSpy = jest.fn(() => {});
    updateNewMarketSpy = jest.fn(() => {});
    validateFieldSpy = jest.fn(() => {});
  });

  describe("scalar market", () => {
    let tickSizeInput;

    beforeEach(() => {
      newMarket.type = SCALAR;
      newMarket.currentStep = 1;
      cmp = shallow(
        <CreateMarketOutcome
          newMarket={newMarket}
          updateNewMarket={updateNewMarketSpy}
          validateField={validateFieldSpy}
          isValid={isValidSpy}
          isMobileSmall={false}
        />
      );

      tickSizeInput = cmp.find("#cm__input--ticksize");
    });

    describe("tick size field", () => {
      describe("when less tha zero", () => {
        test("should render validation message", () => {
          tickSizeInput.simulate("change", { target: { value: "-7" } });
          const newMarketObj = updateNewMarketSpy.mock.calls[0][0];

          expect(newMarketObj.tickSize).toBe("-7");
          expect(
            newMarketObj.validations[newMarketObj.currentStep].tickSize
          ).toBe("Tick size cannot be negative.");
        });
      });

      describe("when zero", () => {
        let newMarketObj;

        beforeEach(() => {
          tickSizeInput.simulate("change", { target: { value: 0 } });
          newMarketObj = updateNewMarketSpy.mock.calls[0][0];
        });

        test("should update market with new value", () => {
          expect(newMarketObj.tickSize).toBe(0);
        });

        test("should set validation message to true", () => {
          expect(
            newMarketObj.validations[newMarketObj.currentStep].tickSize
          ).toBe("Tick size is required.");
        });
      });

      describe("when valid", () => {
        let newMarketObj;

        beforeEach(() => {
          tickSizeInput.simulate("change", { target: { value: 1000 } });
          newMarketObj = updateNewMarketSpy.mock.calls[0][0];
        });

        test("should update market with new value", () => {
          expect(newMarketObj.tickSize).toBe(1000);
        });

        test("should set validation message to true", () => {
          expect(
            newMarketObj.validations[newMarketObj.currentStep].tickSize
          ).toBe("");
        });
      });

      describe("validation message", () => {
        test("should render into the dom tree when provided", () => {
          const validationMessage = "Some fancy validation message";
          newMarket.validations[
            newMarket.currentStep
          ].tickSize = validationMessage;

          cmp.setProps({
            newMarket
          });

          expect(cmp.text()).toEqual(
            expect.stringContaining(validationMessage)
          );
        });
      });
    });
  });
});

import React from "react";
import { shallow } from "enzyme";
import ReportDisputeNoRepState from "src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state";

describe("ReportDisputeNoRepState", () => {
  let cmp;
  let exampleMessage;
  let onClickSpy;

  beforeEach(() => {
    onClickSpy = jest.fn(() => {});
    exampleMessage = "some message";
    cmp = shallow(
      <ReportDisputeNoRepState
        onClickHandler={onClickSpy}
        message={exampleMessage}
      />
    );
  });

  describe("props", () => {
    let btn;

    beforeEach(() => {
      btn = cmp.find("button");
    });

    describe("message", () => {
      test("should be rendered into the DOM", () => {
        expect(cmp.text()).toEqual(expect.stringContaining(exampleMessage));
      });
    });

    describe("onClick", () => {
      test("should fire when action button is clicked", () => {
        btn.simulate("click");
        expect(onClickSpy).toHaveBeenCalled();
      });
    });

    describe("btnText", () => {
      test("should default to 'OK'", () => {
        expect(btn.text()).toEqual(expect.stringContaining("OK"));
      });

      test("should appear in the body of the button", () => {
        const btnText = "some button text";
        cmp = shallow(
          <ReportDisputeNoRepState
            onClickHandler={onClickSpy}
            message={exampleMessage}
            btnText={btnText}
          />
        );
        expect(cmp.find("button").text()).toEqual(
          expect.stringContaining(btnText)
        );
      });
    });
  });
});

import React from "react";
import { shallow } from "enzyme";

import TimeRemainingIndicatorWrapper from "src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator";

describe("time-remaining-indicator", () => {
  const EmptyComponent = () => null;

  // These are exactly one minute apart.
  const startTimeInUTC = 1519261200000;
  const endTimeInUTC = 1519261260000;
  const thirtySecondsInMiliseconds = 30000;

  let Cmp;
  let endTimeAsDate;
  let startTimeAsDate;

  beforeEach(() => {
    Cmp = TimeRemainingIndicatorWrapper(EmptyComponent);

    startTimeAsDate = new Date(startTimeInUTC);
    endTimeAsDate = new Date(endTimeInUTC);
  });

  describe("current time is in interval", () => {
    test("should calculate percentage elapsed using currentTimestamp", () => {
      const wrapper = shallow(
        <Cmp
          startDate={startTimeAsDate}
          endTime={endTimeAsDate}
          currentTimestamp={startTimeInUTC + thirtySecondsInMiliseconds}
        />
      );
      const emptyCmpArr = wrapper.find(EmptyComponent);

      expect(emptyCmpArr).toHaveLength(1);
      expect(emptyCmpArr.props().percentage).toEqual(0.5);
    });
  });

  describe("current time is before interval", () => {
    test("should clamp percentages 0", () => {
      const wrapper = shallow(
        <Cmp
          startDate={startTimeAsDate}
          endTime={endTimeAsDate}
          currentTimestamp={startTimeInUTC - thirtySecondsInMiliseconds}
        />
      );
      const emptyCmpArr = wrapper.find(EmptyComponent);
      expect(emptyCmpArr).toHaveLength(1);
      expect(emptyCmpArr.props().percentage).toEqual(0);
    });
  });

  describe("current time is after interval", () => {
    test("should clamp percentage to 100", () => {
      const wrapper = shallow(
        <Cmp
          startDate={startTimeAsDate}
          endTime={endTimeAsDate}
          currentTimestamp={startTimeInUTC + thirtySecondsInMiliseconds * 4}
        />
      );
      const emptyCmpArr = wrapper.find(EmptyComponent);
      expect(emptyCmpArr).toHaveLength(1);
      expect(emptyCmpArr.props().percentage).toEqual(1);
    });
  });

  describe("wrapped component props", () => {
    let emptyCmpArr;
    beforeEach(() => {
      const wrapper = shallow(
        <Cmp
          startDate={startTimeAsDate}
          endTime={endTimeAsDate}
          someprop="hello!"
        />
      );
      emptyCmpArr = wrapper.find(EmptyComponent);
    });

    test("should contain any arbitrary props to the wrapper", () => {
      expect(emptyCmpArr.props().someprop).toEqual("hello!");
    });

    test("should not contain endTime", () => {
      expect(emptyCmpArr.props()).not.toHaveProperty("endTime");
    });

    test("should not contain startDate", () => {
      expect(emptyCmpArr.props()).not.toHaveProperty("startDate");
    });

    test("should not contain current timestamp", () => {
      expect(emptyCmpArr.props()).not.toHaveProperty("currentTimestamp");
    });
  });

  describe("when endTime is before startDate", () => {
    test("should not render the wrapped component", () => {
      const cmp = shallow(
        <Cmp startDate={endTimeAsDate} endTime={startTimeAsDate} />
      );
      expect(cmp.find(EmptyComponent)).toHaveLength(0);
    });
  });
});

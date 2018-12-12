import React from "react";

import { shallow } from "enzyme";
import WordTrail from "modules/common/components/word-trail/word-trail";
import { SimpleButton } from "modules/common/components/simple-button";

describe("word-trail", () => {
  let items;
  let wrapper;

  const SOME_LABEL = "some-title";

  describe("when tags array is empty", () => {
    beforeEach(() => {
      items = [];
      wrapper = shallow(<WordTrail items={items} typeLabel={SOME_LABEL} />);
    });

    test("should render a list", () => {
      expect(wrapper.html()).toEqual(expect.stringContaining(SOME_LABEL));
    });

    test("should only display the label prop", () => {
      const topLabel = wrapper.find("button");
      expect(topLabel).toHaveLength(0);
    });
  });

  describe("when tags are populated", () => {
    beforeEach(() => {
      items = [
        {
          label: "tag1",
          onClick: () => {}
        },
        {
          label: "tag2",
          onClick: () => {}
        }
      ];

      wrapper = shallow(<WordTrail items={items} typeLabel={SOME_LABEL} />);
    });

    test("should render each of them", () => {
      expect(wrapper.find(SimpleButton)).toHaveLength(2);
    });

    test("should display the passed label for each item", () => {
      const titlesArr = wrapper.find(SimpleButton).map(cmp => cmp.props().text);
      expect(titlesArr).toEqual(["tag1", "tag2"]);
    });

    test("should display the top label prop", () => {
      expect(wrapper.html()).toEqual(expect.stringContaining(SOME_LABEL));
    });
  });
});

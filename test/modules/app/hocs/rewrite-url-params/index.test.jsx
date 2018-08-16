import React from "react";

import { describe, it } from "mocha";
import { assert } from "chai";

import { shallow } from "enzyme";
import { RewriteUrlParams } from "src/modules/app/hocs/rewrite-url-params";

describe("when endpoint info i", () => {});

describe("check for url parms on window.location object", () => {
  const EmptyComponent = () => null;

  let windowRef;
  let routerLocationRef;

  beforeEach(() => {
    windowRef = {
      location: {
        search: "",
        href: ""
      }
    };

    routerLocationRef = {
      pathname: "",
      search: "",
      hash: "",
      state: {}
    };
    RewriteUrlParams(windowRef)(EmptyComponent);
  });

  it("should do nothing", () => {
    const cmp = shallow(<RewriteUrlParams />);
  });
});

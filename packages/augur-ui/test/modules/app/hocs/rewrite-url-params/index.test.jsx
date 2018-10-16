import React from "react";

import { describe, it } from "mocha";
import { assert } from "chai";

import { shallow } from "enzyme";
import { RewriteUrlParams } from "src/modules/app/hocs/rewrite-url-params";

describe("src/modules/app/hocs/rewrite-url-params/index.jsx", () => {
  const EmptyComponent = () => null;

  let windowRef;
  let routerLocationRef;

  describe("when endpoints are ", () => {
    describe("in react router search string", () => {
      beforeEach(() => {
        windowRef = {
          location: {
            origin: "http://example.com",
            search: "",
            href:
              "http://example.com/#/markets?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546&some_other_param=somevalue"
          }
        };

        routerLocationRef = {
          pathname: "/markets",
          search:
            "?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546&some_other_param=somevalue",
          hash: ""
        };
      });

      it("should move the params from the router search string to the window", () => {
        const Cmp = RewriteUrlParams(windowRef)(EmptyComponent);
        shallow(<Cmp location={routerLocationRef} />);

        assert.equal(
          windowRef.location.href,
          "http://example.com?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546#/markets?some_other_param=somevalue"
        );
      });
    });
    describe("when endpoint are in window search string", () => {
      let cmp;
      beforeEach(() => {
        windowRef = {
          location: {
            search:
              "?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546",
            href:
              "http://example.com?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546#/markets?some_other_param=somevalue"
          }
        };

        routerLocationRef = {
          pathname: "",
          search: "",
          hash: "",
          state: {}
        };
        const Cmp = RewriteUrlParams(windowRef)(EmptyComponent);
        cmp = shallow(<Cmp location={routerLocationRef} />);
      });

      it("should do nothing to the url", () => {
        assert.equal(
          windowRef.location.href,
          "http://example.com?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546#/markets?some_other_param=somevalue"
        );
      });

      it("should pass endpoints as props to wrapped component", () => {
        const wrappedCmp = cmp.find(EmptyComponent);
        console.log(wrappedCmp.props());
        assert.propertyVal(
          wrappedCmp.props(),
          "augurNode",
          "ws://127.0.0.1:9001"
        );
        assert.propertyVal(
          wrappedCmp.props(),
          "ethereumNodeHttp",
          "http://127.0.0.1:8545"
        );
        assert.propertyVal(
          wrappedCmp.props(),
          "ethereumNodeWs",
          "ws://127.0.0.1:8546"
        );
      });
    });
  });
});

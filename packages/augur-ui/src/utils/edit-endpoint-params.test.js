import { editEndpointParams } from "src/utils/edit-endpoint-params";
import * as sinon from "sinon";

describe("src/utils/edit-endpoint-params.js", () => {
  let windowRef;
  let spy;
  beforeEach(() => {
    spy = sinon.spy();
    windowRef = {
      location: {
        search:
          "?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546&some_other_param=somevalue",
        origin: "http://example.com",
        hash: "#/markets",
        get href() {
          return "";
        },
        set href(value) {
          spy(value);
        },
        reload() {}
      }
    };
  });

  // Not changing params
  describe("when the same or null values are passed", () => {
    describe("when nothing is passed", () => {
      test("should not change the location", () => {
        editEndpointParams(windowRef, {});
        expect(spy.called).toBeFalsy();
      });
    });

    describe("when only the same augur-node is passed", () => {
      test("should not update location", () => {
        editEndpointParams(windowRef, { augurNode: "ws://127.0.0.1:9001" });
        expect(spy.called).toBeFalsy();
      });
    });

    describe("when only the same ethereum-node-http is passed", () => {
      test("should not update location", () => {
        editEndpointParams(windowRef, {
          ethereumNodeHTTP: "http://127.0.0.1:8545"
        });
        expect(spy.called).toBeFalsy();
      });
    });

    describe("when only the same ethereum-node-ws is passed", () => {
      test("should not update location", () => {
        editEndpointParams(windowRef, {
          ethereumNodeWS: "ws://127.0.0.1:8546"
        });
        expect(spy.called).toBeFalsy();
      });
    });
  });

  // Changing params

  describe("when only a new augur-node is passed", () => {
    test("should update the augur-node endpoint in the url search string", () => {
      editEndpointParams(windowRef, {
        augurNode: "ws://different-endpoint:100000"
      });
      expect(
        spy.calledWith(
          "http://example.com?augur_node=ws%3A%2F%2Fdifferent-endpoint%3A100000&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546&some_other_param=somevalue#/markets"
        )
      ).toBeTruthy();
    });
  });

  describe("when only a new ethereum-node-http is passed", () => {
    test("should update the ehtereum-node-http in the url search string", () => {
      editEndpointParams(windowRef, {
        ethereumNodeHTTP: "http://111.1.1.1:1111"
      });
      expect(
        spy.calledWith(
          "http://example.com?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F111.1.1.1%3A1111&ethereum_node_ws=ws%3A%2F%2F127.0.0.1%3A8546&some_other_param=somevalue#/markets"
        )
      ).toBeTruthy();
    });
  });

  describe("when only a new ethereum-node-ws is passed", () => {
    test("should update the ethereum-node-ws in the url search string", () => {
      editEndpointParams(windowRef, {
        ethereumNodeWS: "ws://222.2.2.2:2222"
      });
      expect(
        spy.calledWith(
          "http://example.com?augur_node=ws%3A%2F%2F127.0.0.1%3A9001&ethereum_node_http=http%3A%2F%2F127.0.0.1%3A8545&ethereum_node_ws=ws%3A%2F%2F222.2.2.2%3A2222&some_other_param=somevalue#/markets"
        )
      ).toBeTruthy();
    });
  });
});

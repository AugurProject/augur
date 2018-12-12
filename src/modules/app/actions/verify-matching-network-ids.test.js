import * as verifyMatchingNetworkIdsModule from "modules/app/actions/verify-matching-network-ids";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as isGlobalWeb3Module from "modules/auth/helpers/is-global-web3";
import * as getAugurNodeNetworkIdModule from "modules/app/actions/get-augur-node-network-id";
import { augur } from "services/augurjs";

jest.mock("modules/auth/helpers/is-global-web3");
jest.mock("services/augurjs");
jest.mock("modules/app/actions/get-augur-node-network-id");

describe("modules/app/actions/verify-matching-network-ids.test.js", () => {
  const store = configureMockStore([thunk])({});
  let isGlobalWeb3Spy;
  let getAugurNodeNetworkIdSpy;
  let getNetworkIdSpy;
  let augurNetVersionSpy;

  const t1 = {
    description: "using global web3, network ids all equal to 4",
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => {
        callback(null, "4");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => "4",
          net: {
            version: callback => {
              callback(null, "4");
            }
          }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toBeNull();
      expect(expectedNetworkId).toBeUndefined();
    }
  };

  const t2 = {
    description: "using global web3, global web3 network id 1, others on 4",
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => {
        callback(null, "4");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => "4",
          net: { version: callback => callback(null, "1") }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toBeNull();
      expect(expectedNetworkId).toStrictEqual("4");
    }
  };

  const t3 = {
    description: "using global web3, middleware network id 1, others on 4",
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => {
        callback(null, "4");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => "1",
          net: { version: callback => callback(null, "4") }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toBeNull();
      expect(expectedNetworkId).toStrictEqual("4");
    }
  };

  const t4 = {
    description: "not using global web3, middleware and augur-node both on 4",
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => {
        callback(null, "4");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => "4",
          net: { version: () => {} }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toBeNull();
      expect(expectedNetworkId).toBeUndefined();
    }
  };

  const t5 = {
    description: "not using global web3, middleware on 4, augur-node on 1",
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => {
        callback(null, "1");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => "4",
          net: { version: () => {} }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toBeNull();
      expect(expectedNetworkId).toStrictEqual("1");
    }
  };

  const t6 = {
    description:
      "not using global web3, middleware network id not found, augur-node on 4",
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => {
        callback(null, "4");
        return { type: "TEST" };
      },
      augur: {
        rpc: {
          getNetworkID: () => null,
          net: { version: () => {} }
        }
      }
    },
    assertions: (err, expectedNetworkId) => {
      expect(err).toStrictEqual(
        'One or more network IDs not found: {"augurNode":"4","middleware":null}'
      );
      expect(expectedNetworkId).toBeUndefined();
    }
  };

  describe.each([t1, t2, t3, t4, t5, t6])(
    "Verify matching network tests",
    t => {
      beforeEach(() => {
        isGlobalWeb3Spy = jest
          .spyOn(isGlobalWeb3Module, "default")
          .mockImplementation(t.stub.isGlobalWeb3);
        getAugurNodeNetworkIdSpy = jest
          .spyOn(getAugurNodeNetworkIdModule, "getAugurNodeNetworkId")
          .mockImplementation(t.stub.getAugurNodeNetworkId);
        getNetworkIdSpy = jest
          .spyOn(augur.rpc, "getNetworkID")
          .mockImplementation(t.stub.augur.rpc.getNetworkID);
        augurNetVersionSpy = jest
          .spyOn(augur.rpc.net, "version")
          .mockImplementation(t.stub.augur.rpc.net.version);
      });

      afterEach(() => {
        store.clearActions();
        isGlobalWeb3Spy.mockReset();
        getAugurNodeNetworkIdSpy.mockReset();
        getNetworkIdSpy.mockReset();
        augurNetVersionSpy.mockReset();
      });

      test(t.description, () => {
        store.dispatch(
          verifyMatchingNetworkIdsModule.verifyMatchingNetworkIds(
            (err, expectedNetworkId) => {
              t.assertions(err, expectedNetworkId);
            }
          )
        );
      });
    }
  );
});

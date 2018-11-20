import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { transferFunds } from "modules/auth/actions/transfer-funds";
import { ETH, REP } from "modules/account/constants/asset-types";
import { augur } from "services/augurjs";
import * as updateAssetsModule from "modules/auth/actions/update-assets";
import * as notificationsModule from "modules/notifications/actions/notifications";

describe("modules/auth/actions/transfer-funds.js", () => {
  const mockStore = configureMockStore([thunk]);

  afterEach(() => {
    jest.resetModules();
  });

  const t1 = {
    description: `should return the expected console error from the default switch`,
    state: {
      loginAccount: {
        address: "0xtest"
      }
    },
    assertions: (done, store) => {
      const origConErr = console.error;
      console.error = jest.fn();
      store.dispatch(transferFunds(10, "to-default", "0xtest2"));
      expect(console.error).toHaveBeenCalledTimes(1);
      console.error = origConErr;
      done();
    }
  };

  const t2 = {
    description: `should call the 'sendEther' method of augur when currency is ETH`,
    state: {
      loginAccount: {
        address: "0xtest"
      }
    },
    assertions: (done, store) => {
      const sendEtherSpy = jest
        .spyOn(augur.assets, "sendEther")
        .mockImplementation(() => jest.fn());

      store.dispatch(transferFunds(10, ETH, "0xtest2"));

      expect(sendEtherSpy).toHaveBeenCalledTimes(1);

      done();
    }
  };

  const t3 = {
    description: `should call the 'REP' method of augur when currency is REP`,
    state: {
      loginAccount: {
        address: "0xtest"
      },
      universe: {
        id: "0xuniverse"
      }
    },
    assertions: (done, store) => {
      const sendReputationSpy = jest
        .spyOn(augur.assets, "sendReputation")
        .mockImplementation(() => jest.fn());
      store.dispatch(transferFunds(10, REP, "0xtest2"));
      expect(sendReputationSpy).toHaveBeenCalledTimes(1);
      done();
    }
  };

  const t4 = {
    description: `should dispatch the 'updateAssets' and 'addNotification' method from the 'onSuccess' callback of 'sendEther`,
    state: {
      loginAccount: {
        address: "0xtest"
      },
      blockchain: {
        currentAugurTimestamp: 1521665
      }
    },
    assertions: (done, store) => {
      jest.spyOn(updateAssetsModule, "updateAssets").mockImplementation(() => ({
        type: "updateAssets"
      }));

      jest
        .spyOn(notificationsModule, "addNotification")
        .mockImplementation(() => ({
          type: "addNotification"
        }));

      const updateNotificationSpy = jest
        .spyOn(notificationsModule, "updateNotification")
        .mockImplementation(() => ({
          type: "updateNotification"
        }));

      jest.spyOn(augur.assets, "sendEther").mockImplementation(options => {
        options.onSuccess({ hash: "0xtest" });
      });
      store.dispatch(transferFunds(10, ETH, "0xtest2"));
      expect(updateNotificationSpy).toHaveBeenCalledTimes(1);
      done();
    }
  };

  describe.each([t1, t2, t3, t4])("transfer funds tests", t => {
    test(t.description, done => {
      const store = mockStore(t.state || {});
      t.assertions(done, store);
    });
  });
});

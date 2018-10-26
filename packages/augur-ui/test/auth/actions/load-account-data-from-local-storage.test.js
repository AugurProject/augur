import mockStore from "test/mockStore";
import {
  loadAccountDataFromLocalStorage,
  __RewireAPI__ as storageRewireAPI
} from "modules/auth/actions/load-account-data-from-local-storage";

describe("modules/auth/actions/load-account-data-from-local-storage.js", () => {
  test(`should return no action b/c there is nothing in localStorage`, () => {
    const store = mockStore.mockStore({});

    const localStorageRef = {
      getItem: () =>
        '{"scalarMarketsShareDenomination":{},"favorites":{},"reports":{},"notifications":{}}'
    };

    storageRewireAPI.__Rewire__("addNotification", () => {});
    storageRewireAPI.__Rewire__("updateReports", () => {});
    storageRewireAPI.__Rewire__(
      "updateScalarMarketShareDenomination",
      () => {}
    );
    storageRewireAPI.__Rewire__("updateFavorites", () => {});
    storageRewireAPI.__Rewire__("localStorageRef", localStorageRef);
    storageRewireAPI.__Rewire__(
      "registerUserDefinedGasPriceFunction",
      () => {}
    );

    store.dispatch(loadAccountDataFromLocalStorage("address"));

    const expected = [];

    expect(store.getActions()).toEqual(expected);
  });
});

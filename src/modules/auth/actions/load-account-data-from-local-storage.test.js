import mockStore from "test/mockStore";

import { updateFavorites } from "modules/markets/actions/update-favorites";
import { updateScalarMarketShareDenomination } from "modules/markets/actions/update-scalar-market-share-denomination";
import { updateReports } from "modules/reports/actions/update-reports";
import { addNotification } from "modules/notifications/actions/notifications";
import { registerUserDefinedGasPriceFunction } from "modules/app/actions/register-user-defined-gasPrice-function";
import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";

jest.mock("modules/markets/actions/update-favorites");
jest.mock("modules/markets/actions/update-scalar-market-share-denomination");
jest.mock("modules/reports/actions/update-reports");
jest.mock("modules/notifications/actions/notifications");
jest.mock("modules/app/actions/register-user-defined-gasPrice-function");

describe("modules/auth/actions/load-account-data-from-local-storage.js", () => {
  test(`should return no action b/c there is nothing in localStorage`, () => {
    const store = mockStore.mockStore({
      connection: { augurNodeNetworkId: "102" }
    });
    localStorage.getItem.mockImplementation(
      () =>
        '{"scalarMarketsShareDenomination":{},"favorites":{},"reports":{},"notifications":{}}'
    );

    updateFavorites.mockImplementation(() => {});
    updateScalarMarketShareDenomination.mockImplementation(() => {});
    updateReports.mockImplementation(() => {});
    addNotification.mockImplementation(() => {});
    registerUserDefinedGasPriceFunction.mockImplementation(() => {});

    store.dispatch(loadAccountDataFromLocalStorage("address"));

    const expected = [];

    expect(store.getActions()).toEqual(expected);
  });
});

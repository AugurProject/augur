import mockStore from "test/mockStore";
import { loadAccountDataFromLocalStorage } from "modules/auth/actions/load-account-data-from-local-storage";

jest.mock("modules/notifications/actions/notifications", () => {});
jest.mock("modules/reports/actions/update-reports", () => {});
jest.mock(
  "modules/markets/actions/update-scalar-market-share-denomination",
  () => {}
);
jest.mock("modules/markets/actions/update-favorites", () => {});
jest.mock(
  "modules/app/actions/register-user-defined-gasPrice-function",
  () => {}
);

describe("modules/auth/actions/load-account-data-from-local-storage.js", () => {
  test(`should return no action b/c there is nothing in localStorage`, () => {
    const store = mockStore.mockStore({});

    const window = { localStorage: { getItem: () => {} } };

    jest
      .spyOn(window.localStorage, "getItem")
      .mockImplementation(
        () =>
          '{"scalarMarketsShareDenomination":{},"favorites":{},"reports":{},"notifications":{}}'
      );

    store.dispatch(loadAccountDataFromLocalStorage("address"));

    const expected = [];

    expect(store.getActions()).toEqual(expected);
  });
});

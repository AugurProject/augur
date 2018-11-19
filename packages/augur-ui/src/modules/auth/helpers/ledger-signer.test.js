import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { updateModal } from "modules/modal/actions/update-modal";
import { closeModal } from "modules/modal/actions/close-modal";
import ledgerSigner from "modules/auth/helpers/ledger-signer";

jest.mock("modules/modal/actions/update-modal");
jest.mock("modules/modal/actions/close-modal");

describe("modules/auth/helpers/ledger-signer", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore({});

  let ledgerLib;
  beforeEach(() => {
    updateModal.mockImplementation(() => ({ type: "stubbedUpdateModal" }));
    closeModal.mockImplementation(() => ({ type: "stubbedCloseModal" }));

    ledgerLib = {
      signTransaction: jest.fn()
    };

    store.clearActions();
  });

  test("should dispatch the expected actions when signing succeeds", async () => {
    const expected = [
      {
        type: "stubbedUpdateModal"
      },
      {
        type: "stubbedCloseModal"
      }
    ];

    ledgerLib.signTransaction.mockResolvedValue({
      r: "blah",
      s: "test",
      v: "bob"
    });

    await ledgerSigner(
      [{}, () => {}],
      ledgerLib,
      "m/44'/60'/0'/0/0",
      store.dispatch
    );
    const actual = store.getActions();
    expect(actual).toEqual(expected);
  });

  test("should dispatch the expected actions when signing fails", async () => {
    let actual;
    const expected = [
      {
        type: "stubbedUpdateModal"
      },
      {
        type: "stubbedUpdateModal"
      }
    ];

    ledgerLib.signTransaction.mockRejectedValue();

    await ledgerSigner(
      [{}, () => {}],
      ledgerLib,
      "m/44'/60'/0'/0/0",
      store.dispatch
    )
      .then(() => {
        expect(false).toBeTruthy();
      })
      .catch(() => {
        actual = store.getActions();
        expect(actual).toEqual(expected);
      });
  });
});

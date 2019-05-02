import { selectLoginAccount } from "modules/auth/selectors/login-account";
import generateDownloadAccountLink from "modules/auth/helpers/generate-download-account-link";
import { augur } from "services/augurjs";

import { formatRep, formatEther } from "utils/format-number";

jest.mock("modules/auth/helpers/generate-download-account-link");
jest.mock("services/augurjs");

describe(`modules/auth/selectors/login-account.js`, () => {
  describe("selectLoginAccount", () => {
    beforeEach(() => {
      generateDownloadAccountLink.mockImplementation(() => {});
      augur.accounts = {
        account: {
          keystore: ""
        }
      };
    });

    test(`should return the expected object when user is unlogged`, () => {
      const accountName = null;

      const actual = selectLoginAccount.resultFunc({}, accountName);

      const expected = {
        accountName: null,
        rep: formatRep(undefined, { decimalsRounded: 4 }),
        eth: formatEther(undefined, { decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      expect(generateDownloadAccountLink).toHaveBeenCalledTimes(1);
    });

    test(`should return the expected object when user is logged via loginId with account locked`, () => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12"
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      expect(generateDownloadAccountLink).toHaveBeenCalledTimes(1);
    });

    test(`should return the expected object when user is logged via loginId with account locked and name encoded`, () => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12"
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      expect(generateDownloadAccountLink).toHaveBeenCalledTimes(1);
    });

    test(`should return the expected object when user is logged via loginId with account UNlocked`, () => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12",
        isUnlocked: true
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        isUnlocked: true,
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      expect(generateDownloadAccountLink).toHaveBeenCalledTimes(1);
    });

    test(`should return the expected object when user is logged via Edge`, () => {
      const loginAccount = {
        edgeAccount: {},
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12",
        isUnlocked: true
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        edgeAccount: {},
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        isUnlocked: true,
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      expect(generateDownloadAccountLink).toHaveBeenCalledTimes(1);
    });
  });
});

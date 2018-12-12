import generateDownloadAccountLink from "modules/auth/helpers/generate-download-account-link";
import keythereum from "keythereum";
import speedomatic from "speedomatic";
import { augur } from "services/augurjs";

jest.mock("keythereum");
jest.mock("speedomatic");
jest.mock("services/augurjs");

describe("modules/auth/helpers/generate-download-account-link.js", () => {
  test(`should return the expected values + call the expected methods`, () => {
    speedomatic.byteArrayToHexString.mockImplementation(
      privateKey => privateKey
    );

    keythereum.generateKeystoreFilename.mockImplementation(address => address);
    augur.accounts = {
      account: {
        privateKey: "123privatekey"
      }
    };

    const actual = generateDownloadAccountLink(
      "0xtest",
      { keystore: "object" },
      "123privatekey"
    );

    const expected = {
      accountPrivateKey: "123privatekey",
      downloadAccountDataString: "data:,%7B%22keystore%22%3A%22object%22%7D",
      downloadAccountFileName: "0xtest"
    };

    expect(actual).toEqual(expected);
    expect(speedomatic.byteArrayToHexString).toHaveBeenCalledTimes(1);
    expect(keythereum.generateKeystoreFilename).toHaveBeenCalledTimes(1);
  });
});

import generateDownloadAccountLink from "modules/auth/helpers/generate-download-account-link";
import keythereum from "keythereum";
import * as speedomatic from "speedomatic";

jest.mock("keythereum");
jest.mock("speedomatic");
jest.mock("services/initialize");

describe("modules/auth/helpers/generate-download-account-link.js", () => {
  test(`should return the expected values + call the expected methods`, () => {
    speedomatic.byteArrayToHexString.mockImplementation(
      privateKey => privateKey
    );

    keythereum.generateKeystoreFilename.mockImplementation(address => address);

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

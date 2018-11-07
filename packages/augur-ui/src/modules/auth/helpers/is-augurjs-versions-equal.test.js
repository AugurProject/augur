import isAugurJSVersionsEqual from "modules/auth/helpers/is-augurjs-versions-equal";

import { augur } from "services/augurjs";

jest.mock("services/augurjs");

describe("modules/auth/helpers/is-augurjs-versions-equal", () => {
  test(
    `Should handle an error from augurNode.getSyncData, and return false`,
    async () => {
      augur.version = "helloWorld";
      augur.augurNode.getSyncData.mockImplementation(cb => {
        cb({ error: 1000, message: "Uh-Oh!" });
      });

      const res = await isAugurJSVersionsEqual();
      expect(typeof res).toBe("object");
      expect(res.isEqual).toBe(false);
      expect(res.augurNode).not.toBeDefined();
      expect(res.augurjs).toEqual("helloWorld");
    }
  );

  test(`Should handle a versionMismatch and return false`, async () => {
    augur.version = "helloWorld";
    augur.augurNode.getSyncData.mockImplementation(cb => {
      cb(undefined, { version: "goodbyeWorld" });
    });

    const res = await isAugurJSVersionsEqual();
    expect(typeof res).toBe("object");
    expect(res.isEqual).toBe(false);
    expect(res.augurNode).toEqual("goodbyeWorld");
    expect(res.augurjs).toEqual("helloWorld");
  });

  test(`Should handle a matching version and return true`, async () => {
    augur.version = "helloWorld";
    augur.augurNode.getSyncData.mockImplementation(cb => {
      cb(undefined, { version: "helloWorld" });
    });

    const res = await isAugurJSVersionsEqual();
    expect(typeof res).toBe("object");
    expect(res.isEqual).toBe(true);
    expect(res.augurNode).toEqual("helloWorld");
    expect(res.augurjs).toEqual("helloWorld");
  });
});

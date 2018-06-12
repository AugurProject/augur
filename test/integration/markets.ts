import { expect } from "chai";
import "mocha";
import { augurNodeRequest } from "./utils";
import Augur from "augur.js";



describe("Hello function", () => {
  it("should return hello world", async () => {
    return augurNodeRequest("getContractAddresses", {}).then((result) => {
      expect(result.isSyncFinished).to.equal(true);
      const augur = new Augur();
      expect(result.addresses).to.deep.equal(augur.contracts.addresses[result.netId]);
    });
  });
});



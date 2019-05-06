import { BigNumber } from "../../../types";

import { volumeForTrade } from "./update-volumetrics";

describe("volumeForTrade", () => {
  test("general test case where every input contributes to the output", () => {
    const td = {
      numTicks: new BigNumber("12"),
      numCreatorTokens: new BigNumber("17"),
      numCreatorShares: new BigNumber("19"),
      numFillerTokens: new BigNumber("31"),
      numFillerShares: new BigNumber("70"),
      expectedVolume: new BigNumber("276")
    };
    expect(volumeForTrade(td.numTicks, {
      numCreatorTokens: td.numCreatorTokens,
      numCreatorShares: td.numCreatorShares,
      numFillerTokens: td.numFillerTokens,
      numFillerShares: td.numFillerShares,
    })).toEqual(td.expectedVolume);
  });
});

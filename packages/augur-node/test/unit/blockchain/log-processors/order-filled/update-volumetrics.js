
import BigNumber from "bignumber.js";
import { volumeForTrade } from "src/blockchain/log-processors/order-filled/update-volumetrics";

test("volumeForTrade", () => {
  const testData = [
    {
      name: "general test case where every input contributes to the output",
      numTicks: new BigNumber("12", 10),
      numCreatorTokens: new BigNumber("17", 10),
      numCreatorShares: new BigNumber("19", 10),
      numFillerTokens: new BigNumber("31", 10),
      numFillerShares: new BigNumber("70", 10),
      expectedVolume: new BigNumber("276", 10),
    },
    // append test cases here as needed
  ];

  testData.forEach(td => {
    expect(volumeForTrade(td.numTicks, {
      numCreatorTokens: td.numCreatorTokens,
      numCreatorShares: td.numCreatorShares,
      numFillerTokens: td.numFillerTokens,
      numFillerShares: td.numFillerShares,
    })).toEqual(td.expectedVolume);
  });
});

import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { makeProvider } from "../../libs";
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';

let john: ContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  await john.approveCentralAuthority();
});

test('Hot Loading :: Get Market Data', async () => {
  const market = await john.createReasonableYesNoMarket();

  let eventData = await john.getHotLoadingMarketData(market.address);

  await expect(eventData).toBeDefined();

  await expect(eventData.author).toEqual(john.account.publicKey);
  await expect(eventData.designatedReporter).toEqual(john.account.publicKey);
  await expect(eventData.marketType).toEqual("YesNo");
  await expect(eventData.tickSize).toEqual("0.01");
  await expect(eventData.reportingState).toEqual("PreReporting");
  await expect(eventData.volume).toEqual("0");
  await expect(eventData.openInterest).toEqual("0");
  await expect(eventData.numTicks).toEqual("100");
  await expect(eventData.marketCreatorFeeRate).toEqual("0.01");
  await expect(eventData.reportingFeeRate).toEqual("0.01");
  await expect(eventData.settlementFee).toEqual("0.02");
  await expect(eventData.numOutcomes).toEqual(3);
  await expect(eventData.minPrice).toEqual("0");
  await expect(eventData.maxPrice).toEqual("1");
  await expect(eventData.cumulativeScale).toEqual("1");
  await expect(eventData.outcomes[0]).toEqual({
    "id": 0,
    "price": "0",
    "description": "Invalid",
    "volume": 0
  });

  const categoricalMarket = await john.createReasonableMarket([stringTo32ByteHex("Trump"), stringTo32ByteHex("Warren"), stringTo32ByteHex("Yang")]);

  eventData = await john.getHotLoadingMarketData(categoricalMarket.address);

  await expect(eventData).toBeDefined();

  await expect(eventData.outcomes[1]).toEqual({
    "id": 1,
    "price": "0",
    "description": "Trump",
    "volume": 0
  });
});

test('Hot Loading :: Get Dispute Window Data', async () => {
  let disputeWindowData = await john.getHotLoadingDisputeWindowData();

  await expect(disputeWindowData).toBeDefined();

  await expect(typeof(disputeWindowData.startTime)).toEqual(typeof(0));
  await expect(typeof(disputeWindowData.endTime)).toEqual(typeof(0));
  await expect(disputeWindowData.purchased).toEqual("0");
  await expect(disputeWindowData.fees).toEqual("0");
});

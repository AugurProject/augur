import { SDKConfiguration } from '@augurproject/utils';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { disableZeroX, makeProvider } from '../../libs';

let john: TestContractAPI;
let mary: TestContractAPI;
let config: SDKConfiguration;

beforeAll(async () => {
  const seed = await loadSeed(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);
  config = disableZeroX(provider.getConfig());

  john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);
  mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);
  await john.approve();
  await mary.approve();
});

test('Trade :: placeTrade', async () => {
  const market1 = await john.createReasonableYesNoMarket();

  await john.placeBasicYesNoTrade(
    0,
    market1,
    1,
    new BigNumber(1),
    new BigNumber(0.4),
    new BigNumber(0)
  );

  const orderId = await john.getBestOrderId(
    new BigNumber(0),
    market1.address,
    new BigNumber(1)
  );

  let amountInOrder = await john.augur.contracts.orders.getAmount_(orderId);
  await expect(amountInOrder.toNumber()).toEqual(10 ** 15);

  await mary.placeBasicYesNoTrade(
    1,
    market1,
    1,
    new BigNumber(0.5),
    new BigNumber(0.4),
    new BigNumber(0)
  );

  amountInOrder = await john.augur.contracts.orders.getAmount_(orderId);
  await expect(amountInOrder.toNumber()).toEqual(10 ** 15 / 2);
});

test('Trade :: simulateTrade', async () => {
  const market1 = await john.createReasonableYesNoMarket();

  const orderAmount = new BigNumber(1);
  const orderPrice = new BigNumber(0.4);
  await john.placeBasicYesNoTrade(
    0,
    market1,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );

  const fillAmount = new BigNumber(0.5);
  const fillPrice = new BigNumber(0.6);
  let simulationData = await mary.simulateBasicYesNoTrade(
    1,
    market1,
    1,
    fillAmount,
    orderPrice,
    new BigNumber(0)
  );

  await expect(simulationData.tokensDepleted).toEqual(
    fillAmount.multipliedBy(fillPrice)
  );
  await expect(simulationData.sharesFilled).toEqual(fillAmount);

  await mary.placeBasicYesNoTrade(
    1,
    market1,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );
  await john.placeBasicYesNoTrade(
    1,
    market1,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );

  simulationData = await mary.simulateBasicYesNoTrade(
    0,
    market1,
    1,
    orderAmount,
    orderPrice,
    new BigNumber(0)
  );

  const expectedFees = orderAmount.multipliedBy(fillPrice).multipliedBy(0.0101); // 2% combined market & reporter fees
  await expect(simulationData.sharesDepleted).toEqual(orderAmount);
  await expect(simulationData.sharesFilled).toEqual(orderAmount);
  await expect(simulationData.settlementFees).toEqual(expectedFees);
});

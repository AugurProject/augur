import {
  ACCOUNTS,
  deployContracts,
  ContractAPI,
} from "../../libs";
import { BigNumber } from "bignumber.js";
import { Contracts as compilerOutput } from "@augurproject/artifacts";

let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const {provider, addresses} = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
}, 120000);

test("Trade :: placeTrade", async () => {
  const market1 = await john.createReasonableYesNoMarket();

  await john.placeBasicYesNoTrade(0, market1, 1, new BigNumber(1), new BigNumber(0.4), new BigNumber(0));

  const orderId = await john.getBestOrderId(new BigNumber(0), market1.address, new BigNumber(1));

  let amountInOrder = await john.augur.contracts.orders.getAmount_(orderId);
  await expect(amountInOrder.toNumber()).toEqual(10**16);

  await mary.placeBasicYesNoTrade(1, market1, 1, new BigNumber(0.5), new BigNumber(0.4), new BigNumber(0));

  amountInOrder = await john.augur.contracts.orders.getAmount_(orderId);
  await expect(amountInOrder.toNumber()).toEqual(10**16 / 2);

}, 15000);

test("Trade :: simulateTrade", async () => {
  const market1 = await john.createReasonableYesNoMarket();

  const orderAmount = new BigNumber(1);
  const orderPrice = new BigNumber(0.4)
  await john.placeBasicYesNoTrade(0, market1, 1, orderAmount, orderPrice, new BigNumber(0));

  const fillAmount = new BigNumber(0.5);
  const fillPrice = new BigNumber(0.6);
  let simulationData = await mary.simulateBasicYesNoTrade(1, market1, 1, fillAmount, orderPrice, new BigNumber(0));

  await expect(simulationData.tokensDepleted).toEqual(fillAmount.multipliedBy(fillPrice));
  await expect(simulationData.sharesFilled).toEqual(fillAmount);

  await mary.placeBasicYesNoTrade(1, market1, 1, orderAmount, orderPrice, new BigNumber(0));
  await john.placeBasicYesNoTrade(1, market1, 1, orderAmount, orderPrice, new BigNumber(0));

  simulationData = await mary.simulateBasicYesNoTrade(0, market1, 1, orderAmount, orderPrice, new BigNumber(0));

  const expectedFees = orderAmount.multipliedBy(fillPrice).dividedBy(50); // 2% combined market & reporter fees
  await expect(simulationData.sharesDepleted).toEqual(orderAmount);
  await expect(simulationData.sharesFilled).toEqual(orderAmount);
  await expect(simulationData.settlementFees).toEqual(expectedFees);

}, 15000);

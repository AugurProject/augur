import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeProvider, MockGnosisRelayAPI } from "../../libs";

let john: ContractAPI;
let mockGnosisRelay: MockGnosisRelayAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  mockGnosisRelay = new MockGnosisRelayAPI();
  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, undefined, mockGnosisRelay);
}, 120000);

test('GnosisSafe :: Create and Use Gnosis Safe for Transactions', async () => {

  // Compute the address
  const estimatedGnosisSafeAddress = await john.getGnosisSafeAddress("0x0000000000000000000000000000000000000000", new BigNumber(0));

  // Make the Safe directly using ETH
  const gnosisSafe = await john.createGnosisSafeDirectlyWithETH("0x0000000000000000000000000000000000000000", new BigNumber(0));
  const owners = await gnosisSafe.getOwners_();

  await expect(estimatedGnosisSafeAddress).toEqual(gnosisSafe.address.toLowerCase());
  await expect(owners).toEqual([john.account.publicKey]);

  // Lets specify our safe to the contract dependencies now and flip the flag to use it for contracts
  john.setGnosisSafeAddress(gnosisSafe.address);
  john.setUseGnosisSafe(true);
  john.setUseGnosisRelay(false);

  // Get some REP to make a market
  console.log(`Minting REP`);
  await john.repFaucet((new BigNumber(10)).pow(24));
  await john.approveCentralAuthority();

  // Now lets make a market and do a trade
  console.log(`Making Market`);
  const market1 = await john.createReasonableYesNoMarket();

  console.log(`Placing trade`);
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
  await expect(amountInOrder.toNumber()).toEqual(10 ** 16);

}, 150000);

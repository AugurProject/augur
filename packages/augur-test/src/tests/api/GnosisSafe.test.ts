import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeProvider, MockGnosisRelayAPI } from '../../libs';

let john: ContractAPI;
let mockGnosisRelay: MockGnosisRelayAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  const mary = await ContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    seed.addresses,
    undefined,
    undefined
  );

  mockGnosisRelay = new MockGnosisRelayAPI();
  mockGnosisRelay.initialize(mary);
  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, undefined, mockGnosisRelay);
});

test('GnosisSafe :: Create and Use Gnosis Safe for Transactions', async () => {

  // Make the Safe directly using ETH
  const gnosisSafe = await john.createGnosisSafeDirectlyWithETH();
  const owners = await gnosisSafe.getOwners_();

  await expect(owners).toEqual([john.account.publicKey]);

  // Lets specify our safe to the contract dependencies now and flip the flag to use it for contracts
  john.setGnosisSafeAddress(gnosisSafe.address);
  john.setUseGnosisSafe(true);
  john.setUseGnosisRelay(false);

  // Approving use of funds isnt needed as the gnosis registration takes care of that

  // Now lets make a market and do a trade
  console.log('Making Market');
  const market1 = await john.createReasonableYesNoMarket();

  console.log('Placing trade');
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

  const amountInOrder = await john.augur.contracts.orders.getAmount_(orderId);
  await expect(amountInOrder.toNumber()).toEqual(10 ** 16);

});

import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeProvider, MockGnosisRelayAPI } from "../../libs";

let john: ContractAPI;
let mockGnosisRelay: MockGnosisRelayAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  mockGnosisRelay = new MockGnosisRelayAPI();
  // TODO use Gnosis contract deps
  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, mockGnosisRelay);
}, 120000);

test('Gnosis :: make safe directly', async () => {

  // Compute the address
  const estimatedGnosisSafeAddress = await john.getGnosisSafeAddress("0x0000000000000000000000000000000000000000", new BigNumber(0));

  // Make the Safe directly using ETH
  const gnosisSafe = await john.createGnosisSafeDirectlyWithETH("0x0000000000000000000000000000000000000000", new BigNumber(0));
  const owners = await gnosisSafe.getOwners_();

  await expect(estimatedGnosisSafeAddress).toEqual(gnosisSafe.address.toLowerCase());
  await expect(owners).toEqual([john.account.publicKey]);

}, 150000);

test('Gnosis :: make safe through relay', async () => {

  const safeAddress = "0xDEADBEEF";

  mockGnosisRelay.setSafeResponse({
    safe: safeAddress,
    payment: "0x4242"
  });

  // Get the safe address
  const gnosisSafeAddress = await john.createGnosisSafeViaRelay("0x0000000000000000000000000000000000000000", new BigNumber(0));

  await expect(gnosisSafeAddress).toEqual(safeAddress);

  // Get the safe deployment status
  let deployed = await john.getGnosisSafeDeploymentStatusViaRelay(gnosisSafeAddress);

  await expect(deployed).toEqual(false);

  mockGnosisRelay.setCheckSafeResponse({
    blockNumber: 42,
    txHash: "0xDEADBEEF"
  })

  deployed = await john.getGnosisSafeDeploymentStatusViaRelay(gnosisSafeAddress);

  await expect(deployed).toEqual(true);

}, 150000);
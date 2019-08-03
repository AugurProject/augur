import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeProvider } from "../../libs";

let john: ContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
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

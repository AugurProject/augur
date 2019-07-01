import { makeProvider, seedPath } from "../../libs";
import { ContractAPI, deployContracts, ACCOUNTS } from "@augurproject/tools";
import { formatBytes32String } from "ethers/utils";

let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const provider = await makeProvider(ACCOUNTS);
  const { addresses } = await deployContracts(provider, seedPath, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
}, 120000);

test("market :: createYesNoMarket", async () => {
  const market = await john.createReasonableYesNoMarket();
  await expect(market).toBeDefined();
}, 15000);

test("market :: createCategoricalMarket", async () => {
  const market = await john.createReasonableMarket(
    [formatBytes32String("yay"), formatBytes32String("nay"), formatBytes32String("bay")]);
  await expect(market).toBeDefined();
}, 15000);

test("market :: createScalarMarket", async () => {
  const market = await john.createReasonableScalarMarket();
  await expect(market).toBeDefined();
}, 15000);


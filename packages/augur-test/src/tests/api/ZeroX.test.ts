import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeDbMock, makeProvider } from "../../libs";
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { MockMeshServer, SERVER_PORT, stopServer } from '../../libs/MockMeshServer';
import { WSClient } from '@0x/mesh-rpc-client';
import { Connectors } from '@augurproject/sdk';

let john: ContractAPI;
let mary: ContractAPI;
let meshClient: WSClient;
let db: DB;
const mock = makeDbMock();

afterAll(() => {
  meshClient.destroy();
  stopServer();
});

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  await MockMeshServer.create();
  meshClient = new WSClient(`ws://localhost:${SERVER_PORT}`);

  const connector = new Connectors.DirectConnector();

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, connector, undefined, meshClient);
  mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses, connector, undefined, meshClient);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  connector.initialize(john.augur, db);
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
}, 120000);

test('Trade :: placeTrade', async () => {
  const market1 = await john.createReasonableYesNoMarket();

  const outcome = 1;

  await john.placeBasicYesNoZeroXTrade(
    0,
    market1,
    outcome,
    new BigNumber(1),
    new BigNumber(0.4),
    new BigNumber(0),
    new BigNumber(1000000000000000)
  );

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  await mary.placeBasicYesNoZeroXTrade(
    1,
    market1,
    outcome,
    new BigNumber(0.5),
    new BigNumber(0.4),
    new BigNumber(0),
    new BigNumber(1000000000000000)
  );

  const johnShares = await john.getNumSharesInMarket(market1, new BigNumber(outcome));
  const maryShares = await mary.getNumSharesInMarket(market1, new BigNumber(0));

  await expect(johnShares.toNumber()).toEqual(10 ** 16 / 2);
  await expect(maryShares.toNumber()).toEqual(10 ** 16 / 2);
}, 150000);

/*
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

  const expectedFees = orderAmount.multipliedBy(fillPrice).dividedBy(50); // 2% combined market & reporter fees
  await expect(simulationData.sharesDepleted).toEqual(orderAmount);
  await expect(simulationData.sharesFilled).toEqual(orderAmount);
  await expect(simulationData.settlementFees).toEqual(expectedFees);
}, 150000);
*/

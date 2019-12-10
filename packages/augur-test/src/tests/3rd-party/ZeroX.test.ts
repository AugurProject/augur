import { ContractAPI, ACCOUNTS } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeDbMock } from '../../libs';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { WSClient } from '@0x/mesh-rpc-client';
import { Connectors } from '@augurproject/sdk';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { stringTo32ByteHex } from '../../libs/Utils';
import { ZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { JsonRpcProvider } from 'ethers/providers';
import { Addresses } from '@augurproject/artifacts';
import { GnosisRelayAPI, GnosisSafeState } from '@augurproject/gnosis-relay-api';

async function calculateSafeAddress(person: ContractAPI, initialPayment=new BigNumber(1e21)) {
  return person.augur.gnosis.calculateGnosisSafeAddress(person.account.publicKey, '0x0');
}

async function getOrCreateSafe(person: ContractAPI, initialPayment=new BigNumber(1e21)): Promise<string> {
  try {
    const safeResponse = await person.createGnosisSafeViaRelay(person.augur.addresses.Cash);
    return safeResponse.safe
  } catch (e) {
    return calculateSafeAddress(person, initialPayment);
  }
}

async function getSafeStatus(person: ContractAPI, safe: string) {
  const status = await person.augur.checkSafe(person.account.publicKey, safe);
  if (typeof status === 'string') {
    return status;
  } else if (typeof status === 'object' && typeof status.status === 'string') {
    return status.status
  } else {
    throw Error(`Received erroneous response when deploying safe via relay: "${status}"`);
  }
}

async function fundSafe(person: ContractAPI, safe=undefined, amount=new BigNumber(1e21)) {
  safe = safe || await getOrCreateSafe(person, amount);

  await person.faucet(new BigNumber(1e21));
  await person.transferCash(safe, new BigNumber(1e21));

  let status: string;
  for (let i = 0; i < 10; i++) {
    status = await getSafeStatus(person, safe);
    if (status !== GnosisSafeState.WAITING_FOR_FUNDS) {
      break;
    }
    await sleep(2000);
  }

  await sleep(10000);

  return safe;
}

describe('3rd Party :: ZeroX :: ', () => {
  let john: ContractAPI;
  let mary: ContractAPI;
  let meshClientJohn: WSClient;
  let meshClientMary: WSClient;
  let db: DB;
  let api: API;
  const mock = makeDbMock();

  beforeAll(async () => {
    const providerJohn = new EthersProvider(new JsonRpcProvider('http://localhost:8545'), 5, 0, 40);
    const providerMary = new EthersProvider(new JsonRpcProvider('http://localhost:8545'), 5, 0, 40);
    const networkId = await providerJohn.getNetworkId();
    const addresses = Addresses[networkId];

    meshClientJohn = new WSClient('ws://localhost:60557');
    meshClientMary = new WSClient('ws://localhost:60557');
    const meshBrowser = undefined;

    const connectorJohn = new Connectors.DirectConnector();
    const connectorMary = new Connectors.DirectConnector();

    john = await ContractAPI.userWrapper(ACCOUNTS[0], providerJohn, addresses, connectorJohn, new GnosisRelayAPI('http://localhost:8000/api/'), meshClientJohn, meshBrowser);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], providerMary, addresses, connectorMary, new GnosisRelayAPI('http://localhost:8000/api/'), meshClientMary, meshBrowser);
    const dbPromise = mock.makeDB(john.augur, ACCOUNTS);
    db = await dbPromise;
    connectorJohn.initialize(john.augur, db);
    connectorMary.initialize(john.augur, db);
    api = new API(john.augur, dbPromise);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();

    // setup gnosis
    const safe = await fundSafe(john);
    const safeStatus = await getSafeStatus(john, safe);
    console.log(`Safe ${safe}: ${safeStatus}`);
    expect(safeStatus).toBe(GnosisSafeState.AVAILABLE);

    await john.augur.setGasPrice(new BigNumber(90000));
    john.setGnosisSafeAddress(safe);
    john.setUseGnosisSafe(true);
    john.setUseGnosisRelay(true);
  }, 120000);

  afterAll(() => {
    meshClientJohn.destroy();
    meshClientMary.destroy();
  });

  test('State API :: ZeroX :: getOrders', async () => {
    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);
    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Give John enough cash to pay for the 0x order.
    await john.faucet(new BigNumber(1e22));

    // Place an order
    const direction = 0;
    const outcome = 0;
    const displayPrice = new BigNumber(.22);
    const kycToken = '0x000000000000000000000000000000000000000C';
    const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000);
    await john.placeZeroXOrder({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: 3,
      outcome,
      tradeGroupId: '42',
      fingerprint: formatBytes32String('11'),
      kycToken,
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount: new BigNumber(1),
      displayPrice,
      displayShares: new BigNumber(0),
      expirationTime,
    });

    // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
    await sleep(300);

    // Get orders for the market
    const orders: ZeroXOrders = await api.route('getZeroXOrders', {
      marketId: market.address,
    });
    const order = _.values(orders[market.address][0]['0'])[0];
    await expect(order).not.toBeUndefined();
    await expect(order.price).toEqual('0.22');
    await expect(order.amount).toEqual('1');
    await expect(order.kycToken).toEqual(kycToken);
    await expect(order.expirationTimeSeconds).
      toEqual(expirationTime.toString());
  }, 120000);

  test('ZeroX Trade :: placeTrade', async () => {
    // Give John enough cash to pay for the 0x order.
    await john.faucet(new BigNumber(1e22));

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
  });

  test('Trade :: simulateTrade', async () => {
    // Give John enough cash to pay for the 0x order.
    await john.faucet(new BigNumber(1e22));

    const market1 = await john.createReasonableYesNoMarket();

    const outcome = 1;
    const price = new BigNumber(0.4);
    const amount = new BigNumber(1);
    const zero = new BigNumber(0);

    // No orders and a do not create orders param means nothing happens
    let simulationData = await john.simulateBasicZeroXYesNoTrade(
      0,
      market1,
      outcome,
      amount,
      price,
      new BigNumber(0),
      true
    );

    await expect(simulationData.tokensDepleted).toEqual(zero);
    await expect(simulationData.sharesDepleted).toEqual(zero);
    await expect(simulationData.sharesFilled).toEqual(zero);
    await expect(simulationData.numFills).toEqual(zero);

    // Simulate making an order
    simulationData = await john.simulateBasicZeroXYesNoTrade(
      0,
      market1,
      outcome,
      amount,
      price,
      new BigNumber(0),
      false
    );

    await expect(simulationData.tokensDepleted).toEqual(amount.multipliedBy(price));
    await expect(simulationData.sharesDepleted).toEqual(zero);
    await expect(simulationData.sharesFilled).toEqual(zero);
    await expect(simulationData.numFills).toEqual(zero);

    await john.placeBasicYesNoZeroXTrade(
      0,
      market1,
      outcome,
      amount,
      price,
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

    await db.sync(john.augur, mock.constants.chunkSize, 0);

    const fillAmount = new BigNumber(0.5);
    const fillPrice = new BigNumber(0.6);

    simulationData = await mary.simulateBasicZeroXYesNoTrade(
      1,
      market1,
      outcome,
      fillAmount,
      price,
      new BigNumber(0),
      true
    );

    await expect(simulationData.tokensDepleted).toEqual(fillAmount.multipliedBy(fillPrice));
    await expect(simulationData.sharesFilled).toEqual(fillAmount);
    await expect(simulationData.numFills).toEqual(new BigNumber(1));
  });
});

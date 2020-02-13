import {
  Addresses,
  ContractAddresses,
  NetworkId,
} from '@augurproject/artifacts';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  GnosisRelayAPI,
  GnosisSafeState,
} from '@augurproject/gnosis-relay-api';
import { Connectors } from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  AllOrders,
  Order,
} from '@augurproject/sdk/build/state/getter/OnChainTrading';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { ACCOUNTS, ContractAPI } from '@augurproject/tools';
import {
  NULL_ADDRESS,
  stringTo32ByteHex,
} from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import * as _ from 'lodash';
import { makeDbMock } from '../../libs';

async function getSafe(person: ContractAPI): Promise<string> {
  return person.augur.contracts.gnosisSafeRegistry.getSafe_(person.account.publicKey);
}

async function getOrCreateSafe(person: ContractAPI, initialPayment=new BigNumber(1e21)): Promise<string> {
  const safeFromRegistry = await getSafe(person);
  if(safeFromRegistry !== NULL_ADDRESS) {
    console.log(`Found safe: ${safeFromRegistry}`);
    return safeFromRegistry;
  }

  console.log('Attempting to create safe via relay');
  const safeResponse = await person.createGnosisSafeViaRelay(person.augur.addresses.Cash);
  return safeResponse.safe
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

describe('3rd Party :: Gnosis :: ', () => {
  let john: ContractAPI;
  let providerJohn: EthersProvider;
  let networkId: NetworkId;
  let addresses: ContractAddresses;
  let db: Promise<DB>;
  let api: API;
  let bulkSyncStrategy: BulkSyncStrategy;
  const mock = makeDbMock();

  beforeAll(async () => {
    providerJohn = new EthersProvider(new JsonRpcProvider('http://localhost:8545'), 5, 0, 40);
    networkId = await providerJohn.getNetworkId();
    addresses = Addresses[networkId];

    const connectorJohn = new Connectors.DirectConnector();
    john = await ContractAPI.userWrapper(ACCOUNTS[0], providerJohn, addresses, connectorJohn, new GnosisRelayAPI('http://localhost:8888/api/'), undefined, undefined);
    db = mock.makeDB(john.augur, ACCOUNTS);

    bulkSyncStrategy = new BulkSyncStrategy(
      john.provider.getLogs,
      (await db).logFilters.buildFilter,
      (await db).logFilters.onLogsAdded,
      john.augur.contractEvents.parseLogs,
    );


    connectorJohn.initialize(john.augur, await db);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();

    const funderCash = (new BigNumber(10)).pow(26);
    await john.faucet(funderCash)
    await john.transferCash(ACCOUNTS[7].publicKey, funderCash);

    // setup gnosis
    await john.faucet(funderCash)
    const safe = await fundSafe(john);
    const safeStatus = await getSafeStatus(john, safe);
    console.log(`Safe ${safe}: ${safeStatus}`);
    expect(safeStatus).toBe(GnosisSafeState.AVAILABLE);

    await john.augur.setGasPrice(new BigNumber(9));
    john.setGnosisSafeAddress(safe);
    john.setUseGnosisSafe(true);
    john.setUseGnosisRelay(true);
  }, 120000);

  test('State API :: Gnosis :: getOrders', async () => {
    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B')
    ]);
    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());;

    // Give John enough cash to pay for the 0x order.

    await john.faucet(new BigNumber(1e22));

    // Place an order
    const bid = new BigNumber(0);
    const outcome = new BigNumber(0);
    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await john.placeOrder(
      market.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Get orders for the market
    const orders: AllOrders = await api.route('getOpenOnChainOrders', {
      marketId: market.address
    });
    console.log('orders:', JSON.stringify(orders, null, 2));
    const order: Order = _.values(orders[market.address][0][0])[0];
    expect(order).toBeDefined();
    expect(order.price).toBe('0.22');
    expect(order.owner.toLowerCase()).toBe((await getSafe(john)).toLowerCase());
  }, 120000);
});

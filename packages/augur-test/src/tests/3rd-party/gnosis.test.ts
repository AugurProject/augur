import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import * as _ from 'lodash';
import { Addresses, ContractAddresses, NetworkId } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { GnosisRelayAPI, GnosisSafeState, } from '@augurproject/gnosis-relay-api';
import { Connectors } from '@augurproject/sdk';
import { ACCOUNTS, TestContractAPI } from '@augurproject/tools';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { AllOrders, Order, } from '@augurproject/sdk/build/state/getter/OnChainTrading';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { stringTo32ByteHex, } from '@augurproject/tools/build/libs/Utils';
import { makeDbMock } from '../../libs';

async function getSafe(person: TestContractAPI): Promise<string> {
  return person.augur.contracts.gnosisSafeRegistry.getSafe_(
    person.account.publicKey
  );
}

describe('3rd Party :: Gnosis :: ', () => {
  let john: TestContractAPI;
  let providerJohn: EthersProvider;
  let networkId: NetworkId;
  let addresses: ContractAddresses;

  beforeAll(async () => {
    providerJohn = new EthersProvider(
      new JsonRpcProvider('http://localhost:8545'),
      5,
      0,
      40
    );
    networkId = await providerJohn.getNetworkId();
    addresses = Addresses[networkId];

    const connectorJohn = new Connectors.DirectConnector();
    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      providerJohn,
      addresses,
      connectorJohn,
      new GnosisRelayAPI('http://localhost:8888/api/'),
      undefined,
      undefined
    );

    connectorJohn.initialize(john.augur, john.db);
    await john.approveCentralAuthority();

    const funderCash = new BigNumber(10).pow(26);
    await john.faucet(funderCash);
    await john.transferCash(ACCOUNTS[7].publicKey, funderCash);

    // setup gnosis
    await john.faucet(funderCash);
    const safe = await john.fundSafe();
    const safeStatus = await john.getSafeStatus(safe);
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
      stringTo32ByteHex('B'),
    ]);
    await john.sync();

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

    await john.sync();

    // Get orders for the market
    const orders: AllOrders = await john.api.route('getOpenOnChainOrders', {
      marketId: market.address,
    });
    console.log('orders:', JSON.stringify(orders, null, 2));
    const order: Order = _.values(orders[market.address][0][0])[0];
    expect(order).toBeDefined();
    expect(order.price).toBe('0.22');
    expect(order.owner.toLowerCase()).toBe((await getSafe(john)).toLowerCase());
  }, 120000);
});

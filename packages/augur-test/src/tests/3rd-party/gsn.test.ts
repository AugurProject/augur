import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import * as _ from 'lodash';
import { Addresses, ContractAddresses, NetworkId } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Connectors } from '@augurproject/sdk';
import { ACCOUNTS, TestContractAPI } from '@augurproject/tools';
import { AllOrders, Order, } from '@augurproject/sdk/build/state/getter/OnChainTrading';
import { stringTo32ByteHex, } from '@augurproject/tools/build/libs/Utils';

describe('3rd Party :: GSN :: ', () => {
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
      ACCOUNTS[7],
      providerJohn,
      addresses,
      connectorJohn,
      undefined,
      undefined
    );

    connectorJohn.initialize(john.augur, john.db);
    await john.approveCentralAuthority();
    const walletCash = new BigNumber(10).pow(24);
    const walletAddress = await john.getWalletAddress(john.account.publicKey);
    await john.faucet(walletCash);
    await john.transferCash(walletAddress, walletCash);

    john.setUseWallet(true);
    john.setUseRelay(true);

    await john.augur.setGasPrice(new BigNumber(20 * 10**9));
  }, 120000);

  test('State API :: GSN :: getOrders', async () => {
    const walletAddress = await john.getWalletAddress(john.account.publicKey);

    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);
    await john.sync();

    // Faucet some REP asnd confirm the wallet recieves it
    const repAmount = new BigNumber(1e10);
    const repBalance = await john.getRepBalance(walletAddress);
    await john.repFaucet(repAmount);
    const newRepBalance = await john.getRepBalance(walletAddress);
    await expect(newRepBalance.toFixed()).toBe(repBalance.plus(repAmount).toFixed());

    // Give John enough cash to pay for the 0x order.

    const cashAmount = new BigNumber(1e22);
    await john.faucetOnce(cashAmount, john.account.publicKey);

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
    expect(order.owner.toLowerCase()).toBe(walletAddress.toLowerCase());
  }, 120000);
});

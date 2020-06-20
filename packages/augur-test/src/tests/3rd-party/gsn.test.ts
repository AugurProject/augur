import { buildConfig } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Connectors } from '@augurproject/sdk';
import {
  AllOrders,
  Order,
} from '@augurproject/sdk-lite';
import { ACCOUNTS, TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { SDKConfiguration } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import * as _ from 'lodash';

describe('3rd Party :: GSN :: ', () => {
  let john: TestContractAPI;
  let providerJohn: EthersProvider;
  let config: SDKConfiguration;

  beforeAll(async () => {
    config = buildConfig('local');
    providerJohn = new EthersProvider(
      new JsonRpcProvider(config.ethereum.http),
      config.ethereum.rpcRetryCount,
      config.ethereum.rpcRetryInterval,
      config.ethereum.rpcConcurrency
    );

    const connectorJohn = new Connectors.DirectConnector();
    john = await TestContractAPI.userWrapper(
      ACCOUNTS[7],
      providerJohn,
      config,
      connectorJohn,
      undefined,
      undefined
    );

    connectorJohn.initialize(john.augur, john.db);
    await john.approve();
    const walletCash = new BigNumber(10).pow(24);
    const walletAddress = await john.getWalletAddress(john.account.address);
    await john.faucetCash(walletCash);
    await john.transferCash(walletAddress, walletCash);

    john.setUseWallet(true);
    john.setUseRelay(true);

  }, 120000);

  test('State API :: GSN :: getOrders', async () => {
    const walletAddress = await john.getWalletAddress(john.account.address);

    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);
    await expect(market.address).not.toEqual("");
    await john.sync();

    // Faucet some REP and confirm the wallet recieves it
    const repAmount = new BigNumber(1e10);
    const repBalance = await john.getRepBalance(walletAddress);
    await john.faucetRep(repAmount);
    const newRepBalance = await john.getRepBalance(walletAddress);
    await expect(newRepBalance.toFixed()).toBe(repBalance.plus(repAmount).toFixed());

    // Give John enough cash to pay for the 0x order.

    const cashAmount = new BigNumber(1e22);
    await john.faucetCash(cashAmount);

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

  test('State API :: GSN :: sendEth', async () => {
    john.setUseWallet(false);
    john.setUseRelay(false);

    // Give the wallet some eth
    const walletAddress = await john.getWalletAddress(john.account.address);
    const initialWalletBalance = await john.getEthBalance(walletAddress);
    const ethAmount = new BigNumber(100);
    await john.sendEther(walletAddress, ethAmount);

    const walletBalance = await john.getEthBalance(walletAddress);
    const expectedWalletBalance = initialWalletBalance.plus(ethAmount);
    await expect(walletBalance.toString()).toEqual(expectedWalletBalance.toString());

    // Have the wallet send its ETH to another account
    john.setUseWallet(true);
    john.setUseRelay(true);

    const recipient = ACCOUNTS[3].address;
    const initialBalance = await john.getEthBalance(recipient);

    await john.sendEther(recipient, ethAmount);

    const newBalance = await john.getEthBalance(recipient);
    const expectedBalance = initialBalance.plus(ethAmount);

    await expect(newBalance.toString()).toEqual(expectedBalance.toString());
  }, 120000);
});

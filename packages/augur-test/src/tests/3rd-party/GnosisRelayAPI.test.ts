import { abi, Addresses } from '@augurproject/artifacts';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { GnosisRelayAPI, GnosisSafeState, RelayTransaction } from '@augurproject/gnosis-relay-api';
import { NULL_ADDRESS } from '@augurproject/tools/build/libs/Utils';
import { Cash } from '@augurproject/core/build/libraries/ContractInterfaces';
import { ACCOUNTS, makeDependencies, makeSigner } from '@augurproject/tools/build';
import { EthersProvider } from '@augurproject/ethersjs-provider/build';

type TestingEnv = 'local' | 'kovan';
const ENV: TestingEnv = 'local' || process.env.TEST_ENV as TestingEnv;

const {
  RELAY_API,
  SAFE_FUNDER_PRIVATE_KEY,
  SAFE_FUNDER_PUBLIC_KEY,
  URL,
} = {
  'local': {
    RELAY_API: 'http://localhost:8888/api/',
    SAFE_FUNDER_PRIVATE_KEY: 'fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a',
    SAFE_FUNDER_PUBLIC_KEY: '0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb',
    URL: 'http://localhost:8545',
  },
  'kovan': {
    RELAY_API: 'https://gnosis.kovan.augur.net/api/',
    SAFE_FUNDER_PRIVATE_KEY: process.env.SAFE_FUNDER_PRIVATE_KEY,
    SAFE_FUNDER_PUBLIC_KEY: process.env.SAFE_FUNDER_PUBLIC_KEY,
    URL: 'https://eth-kovan.alchemyapi.io/jsonrpc/1FomA6seLdWDvpIRvL9J5NhwPHLIGbWA',
  },
}[ENV];

const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000003';

export async function sleep(milliseconds: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

describe('Gnosis Relay API', () => {
  let api: GnosisRelayAPI;
  let provider = new ethers.providers.JsonRpcProvider(URL);
  let wallet = new ethers.Wallet(SAFE_FUNDER_PRIVATE_KEY, provider);
  let signingKey = new ethers.utils.SigningKey(SAFE_FUNDER_PRIVATE_KEY);

  beforeAll(async () => {
    api = new GnosisRelayAPI(RELAY_API);
    provider = new ethers.providers.JsonRpcProvider(URL);
    wallet = new ethers.Wallet(SAFE_FUNDER_PRIVATE_KEY, provider);
    signingKey = new ethers.utils.SigningKey(SAFE_FUNDER_PRIVATE_KEY);
  }, 1000);

  describe('Make safe and transact', () => {
    test('ETH (null address)', async () => {
      const gnosisSafeData = {
        saltNonce: Number((Math.random() * 10000000).toFixed()),
        threshold: 1,
        owners: [SAFE_FUNDER_PUBLIC_KEY],
        paymentToken: NULL_ADDRESS,
        setupData: '',
        to: NULL_ADDRESS,
      };

      // Get safe creation data
      console.log('Getting Safe Creation Data');
      const safeResponse = await api.createSafe(gnosisSafeData);
      const safeAddress = safeResponse.safe;
      const payment = safeResponse.payment;
      await expect(safeAddress).not.toEqual(NULL_ADDRESS);
      console.log(`Expected Safe Address: ${safeAddress}`);

      // The safe is not yet funded (or deployed)
      let safeStatus = await api.checkSafe(safeAddress);
      await expect(safeStatus).toEqual({
        status: GnosisSafeState.WAITING_FOR_FUNDS
      });

      // Fund the safe
      console.log('Funding Safe');
      const fundingTransaction: ethers.providers.TransactionRequest = {
        nonce: await wallet.getTransactionCount(),
        to: safeAddress,
        value: new ethers.utils.BigNumber(payment),
      };
      await wallet.sendTransaction(fundingTransaction);

      safeStatus = await api.checkSafe(safeAddress);

      // Wait till the relay service has deployed the safe
      console.log('Waiting for Safe Deployment');
      // Originally checked the blockNumber but it doesn't seem to be available in ganache.
      while (safeStatus.status === GnosisSafeState.WAITING_FOR_FUNDS) {
        await sleep(2000);
        safeStatus = await api.checkSafe(safeAddress);
        console.log(safeStatus);
      }

      if (safeStatus.status === GnosisSafeState.CREATED) {
        // Wait for safeCreate tx to confirm.
        await provider.waitForTransaction(safeStatus.txHash);
      }

      console.log('Depositing Additional Funds');
      const depositTransaction = {
        to: safeAddress,
        value: new ethers.utils.BigNumber(10).pow(16),
      };
      const txResponse = await wallet.sendTransaction(depositTransaction);
      console.log(`Waiting on TX: ${txResponse.hash}`);
      await provider.waitForTransaction(txResponse.hash);

      // Lets send a transaction through the safe using the relay service
      const gnosisSafe = new ethers.Contract(safeAddress, abi['GnosisSafe'], provider);

      const to = DUMMY_ADDRESS;
      const data = '0x';
      const value = 1;
      const operation = 0;
      const gasToken = NULL_ADDRESS;
      const safeTxGas = '100000';
      const dataGas = '300000';
      const gasPrice = 5 * 10**9;
      const refundReceiver = NULL_ADDRESS;
      const nonce = (await gnosisSafe.nonce()).toNumber();

      const relayTransaction: RelayTransaction = {
        safe: safeAddress,
        to,
        data,
        value: new BigNumber(value),
        operation,
        gasToken,
        safeTxGas,
        dataGas,
        gasPrice: new BigNumber(gasPrice),
        refundReceiver,
        nonce,
        signatures: [{
          s: '',
          r: '',
          v: 0,
        }],
      };

      console.log('Getting TX Hash and Signing for a relay TX Execution');
      const txHashBytes = await gnosisSafe.getTransactionHash(to, value, data, operation, safeTxGas, dataGas, gasPrice, gasToken, refundReceiver, nonce);
      await expect(txHashBytes).not.toEqual(undefined);

      const sig = signingKey.signDigest(ethers.utils.arrayify(txHashBytes));

      const address = ethers.utils.recoverAddress(txHashBytes, sig);
      await expect(address).toEqual(wallet.address);

      relayTransaction.signatures[0].s = new BigNumber(sig.s, 16).toFixed();
      relayTransaction.signatures[0].r = new BigNumber(sig.r, 16).toFixed();
      relayTransaction.signatures[0].v = sig.v!;

      console.log(`Executing TX: ${JSON.stringify(relayTransaction)}`);
      const txHash = await api.execTransaction(relayTransaction);
      await expect(txHash).not.toEqual(undefined);

      console.log(`Waiting on TX: ${txHash}`);
      const receipt = await provider.waitForTransaction(txHash);

      expect(receipt).toMatchObject({
        to: safeAddress,
        status: 1,
        contractAddress: null,
      });
      expect(receipt.blockNumber).not.toBeNull();

    }, 600000);

    test('ERC20 (Cash)', async () => {
      const account = ACCOUNTS[0];
      const ethersProvider = new EthersProvider(provider, 5, 0, 40);
      const signer = await makeSigner(ACCOUNTS[0], ethersProvider);
      const addresses = Addresses[102];
      const cash = new Cash(
        makeDependencies(account, ethersProvider, signer),
        addresses.Cash);
      // const cash = new ethers.Contract(addresses.Cash, abi['Cash'], provider);

      const gnosisSafeData = {
        saltNonce: Number((Math.random() * 10000000).toFixed()),
        threshold: 1,
        owners: [SAFE_FUNDER_PUBLIC_KEY],
        paymentToken: cash.address,
        setupData: '',
        to: NULL_ADDRESS,
      };

      // Get safe creation data
      console.log('Getting Safe Creation Data');
      const safeResponse = await api.createSafe(gnosisSafeData);
      const safeAddress = safeResponse.safe;
      await expect(safeAddress).not.toEqual(NULL_ADDRESS);
      console.log(`Expected Safe Address: ${safeAddress}`);

      // The safe is not yet funded (or deployed)
      let safeStatus = await api.checkSafe(safeAddress);
      await expect(safeStatus).toEqual({
        status: GnosisSafeState.WAITING_FOR_FUNDS
      });

      // Fund the safe
      console.log('Funding Safe');
      await cash.faucet(new BigNumber(1e21));
      await cash.transfer(safeAddress, new BigNumber(1e21));

      safeStatus = await api.checkSafe(safeAddress);

      // Wait till the relay service has deployed the safe
      console.log('Waiting for Safe Deployment');
      // Originally checked the blockNumber but it doesn't seem to be available in ganache.
      while (safeStatus.status === GnosisSafeState.WAITING_FOR_FUNDS) {
        await sleep(2000);
        safeStatus = await api.checkSafe(safeAddress);
        console.log(safeStatus);
      }

      if (safeStatus.status === GnosisSafeState.CREATED) {
        // Wait for safeCreate tx to confirm.
        await provider.waitForTransaction(safeStatus.txHash);
      }

      console.log('Depositing Additional Funds');
      const depositTransaction = {
        to: safeAddress,
        value: new ethers.utils.BigNumber(10).pow(16),
      };
      const txResponse = await wallet.sendTransaction(depositTransaction);
      console.log(`Waiting on TX: ${txResponse.hash}`);
      await provider.waitForTransaction(txResponse.hash);

      // Lets send a transaction through the safe using the relay service
      const gnosisSafe = new ethers.Contract(safeAddress, abi['GnosisSafe'], provider);

      const to = DUMMY_ADDRESS;
      const data = '0x';
      const value = 1;
      const operation = 0;
      const gasToken = NULL_ADDRESS;
      const safeTxGas = '100000';
      const dataGas = '300000';
      const gasPrice = 5 * 10**9;
      const refundReceiver = NULL_ADDRESS;
      const nonce = (await gnosisSafe.nonce()).toNumber();

      const relayTransaction: RelayTransaction = {
        safe: safeAddress,
        to,
        data,
        value: new BigNumber(value),
        operation,
        gasToken,
        safeTxGas,
        dataGas,
        gasPrice: new BigNumber(gasPrice),
        refundReceiver,
        nonce,
        signatures: [{
          s: '',
          r: '',
          v: 0,
        }],
      };

      console.log('Getting TX Hash and Signing for a relay TX Execution');
      const txHashBytes = await gnosisSafe.getTransactionHash(to, value, data, operation, safeTxGas, dataGas, gasPrice, gasToken, refundReceiver, nonce);
      await expect(txHashBytes).not.toEqual(undefined);

      const sig = signingKey.signDigest(ethers.utils.arrayify(txHashBytes));

      const address = ethers.utils.recoverAddress(txHashBytes, sig);
      await expect(address).toEqual(wallet.address);

      relayTransaction.signatures[0].s = new BigNumber(sig.s, 16).toFixed();
      relayTransaction.signatures[0].r = new BigNumber(sig.r, 16).toFixed();
      relayTransaction.signatures[0].v = sig.v!;

      console.log(`Executing TX: ${JSON.stringify(relayTransaction)}`);
      const txHash = await api.execTransaction(relayTransaction);
      await expect(txHash).not.toEqual(undefined);

      console.log(`Waiting on TX: ${txHash}`);
      const receipt = await provider.waitForTransaction(txHash);

      expect(receipt).toMatchObject({
        to: safeAddress,
        status: 1,
        contractAddress: null,
      });
      expect(receipt.blockNumber).not.toBeNull();

    }, 600000);
  });
});

import { abi } from '@augurproject/artifacts';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { GnosisRelayAPI, GnosisSafeState, RelayTransaction } from '../index';

// Local testing
const RELAY_API = 'http://localhost:8000/api/';
const SAFE_FUNDER_PRIVATE_KEY = '0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd';
const SAFE_FUNDER_PUBLIC_KEY = '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC';
const URL = 'http://localhost:8545';
// Rinkeby testing
// const RELAY_API = 'https://safe-relay.rinkeby.gnosis.pm/api/';
// const SAFE_FUNDER_PRIVATE_KEY = "fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a";
// const SAFE_FUNDER_PUBLIC_KEY = "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb";
// const URL = "https://eth-rinkeby.alchemyapi.io/jsonrpc/xWkVwAbM7Qr-p8j-Zu_PPwldZJKmaKjx";

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000003';

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

let api: GnosisRelayAPI;

beforeAll(async () => {
    api = new GnosisRelayAPI(RELAY_API);
  }, 1000);

test('Gnosis Relay API:: Make safe and do transactions', async () => {
    const provider = new ethers.providers.JsonRpcProvider(URL);
    const wallet = new ethers.Wallet(SAFE_FUNDER_PRIVATE_KEY, provider);
    const signingKey = new ethers.utils.SigningKey(SAFE_FUNDER_PRIVATE_KEY);

    const gnosisSafeData = {
        saltNonce: Number((Math.random() * 10000000).toFixed()),
        threshold: 1,
        owners: [SAFE_FUNDER_PUBLIC_KEY],
        paymentToken: NULL_ADDRESS,
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
    const fundingTransaction = {
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
    }

    console.log('Depositing Additional Funds');
    const depositTransaction = {
        nonce: await wallet.getTransactionCount(),
        to: safeAddress,
        value: new ethers.utils.BigNumber(10).pow(16),
    };
    const txResponse = await wallet.sendTransaction(depositTransaction);
    console.log(`Waiting on TX: ${txResponse.hash}`);
    await provider.getTransactionReceipt(txResponse.hash);

    // Lets send a transaction through the safe using the relay service
    const gnosisSafe = new ethers.Contract(safeAddress, abi['GnosisSafe'], provider);

    const to = DUMMY_ADDRESS;
    const data = '0x';
    const value = 1;
    const operation = 0;
    const gasToken = NULL_ADDRESS;
    const safeTxGas = 100000;
    const dataGas = 300000;
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
        safeTxGas: new BigNumber(safeTxGas),
        dataGas: new BigNumber(dataGas),
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
    const receipt = await provider.getTransactionReceipt(txHash);
    expect(receipt).toMatchObject({
      to: safeAddress,
      status: 1,
      contractAddress: null,
    });
    expect(receipt.blockNumber).not.toBeNull();

}, 600000);

import { BigNumber } from 'bignumber.js';
import { GnosisRelayAPI, RelayTransaction, Signatures } from "../index";
import { ethers } from "ethers";
import { abi } from "@augurproject/artifacts";

const SAFE_FUNDER_PRIVATE_KEY = "fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a";
const SAFE_FUNDER_PUBLIC_KEY = "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const DUMMY_ADDRESS = "0x0000000000000000000000000000000000000003";

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

let api: GnosisRelayAPI;

beforeAll(async () => {
    api = new GnosisRelayAPI("https://safe-relay.rinkeby.gnosis.pm/api/");
  }, 1000);

test('Gnosis Relay API:: Make safe and do transactions', async () => {

    const url = "https://eth-rinkeby.alchemyapi.io/jsonrpc/xWkVwAbM7Qr-p8j-Zu_PPwldZJKmaKjx";
    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(SAFE_FUNDER_PRIVATE_KEY, provider);

    let signingKey = new ethers.utils.SigningKey(SAFE_FUNDER_PRIVATE_KEY);

    // TODO provide more params and confirm a pre-computed address is equal to the address generated

    const gnosisSafeData = {
        saltNonce: Number((Math.random() * 10000000).toFixed()),
        threshold: 1,
        owners: [SAFE_FUNDER_PUBLIC_KEY],
        paymentToken: NULL_ADDRESS,
    };

    // Get safe creation data
    console.log(`Getting Safe Creation Data`);
    const safeResponse = await api.createSafe(gnosisSafeData);
    const safeAddress = safeResponse.safe;
    const payment = safeResponse.payment;
    await expect(safeAddress).not.toEqual(NULL_ADDRESS);
    console.log(`Expected Safe Address: ${safeAddress}`);

    // The safe is not yet funded (or deployed)
    let safeStatus = await api.checkSafe(safeAddress);
    await expect(safeStatus.blockNumber).toEqual(null);
    await expect(safeStatus.txHash).toEqual(null);

    // Fund the safe
    console.log(`Funding Safe`);
    const fundingTransaction = {
        nonce: await wallet.getTransactionCount(),
        to: safeAddress,
        value: new ethers.utils.BigNumber(payment),
    };
    await wallet.sendTransaction(fundingTransaction);
    safeStatus = await api.checkSafe(safeAddress);

    // Wait till the relay service has deployed the safe
    console.log(`Waiting for Safe Deployment`);
    while (safeStatus.blockNumber === null) {
        await sleep(2000);
        safeStatus = await api.checkSafe(safeAddress);
    }

    console.log(`Depositing Additional Funds`);
    const depositTransaction = {
        nonce: await wallet.getTransactionCount(),
        to: safeAddress,
        value: new ethers.utils.BigNumber(10).pow(16),
    };
    const txResponse = await wallet.sendTransaction(depositTransaction);
    console.log(`Waiting on TX: ${txResponse.hash}`);
    await provider.getTransactionReceipt(txResponse.hash);

    // Lets send a transaction through the safe using the relay service
    const gnosisSafe = new ethers.Contract(safeAddress, abi["GnosisSafe"], provider);
  
    const to = DUMMY_ADDRESS;
    const data = "0x";
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
            s: "",
            r: "",
            v: 0
        }]
    };

    console.log(`Getting TX Hash and Signing for a relay TX Execution`);
    let txHashBytes = await gnosisSafe.getTransactionHash(to, value, data, operation, safeTxGas, dataGas, gasPrice, gasToken, refundReceiver, nonce);
    await expect(txHashBytes).not.toEqual(undefined);

    let sig = signingKey.signDigest(ethers.utils.arrayify(txHashBytes));

    const address = ethers.utils.recoverAddress(txHashBytes, sig);
    await expect(address).toEqual(wallet.address);

    relayTransaction.signatures[0].s = new BigNumber(sig.s, 16).toFixed();
    relayTransaction.signatures[0].r = new BigNumber(sig.r, 16).toFixed();
    relayTransaction.signatures[0].v = sig.v!;

    console.log(`Executing TX: ${JSON.stringify(relayTransaction)}`);
    const txHash = await api.execTransaction(relayTransaction);
    await expect(txHash).not.toEqual(undefined);

    console.log(`Waiting on TX: ${txHash}`);
    await provider.getTransactionReceipt(txHash);
  
}, 600000);

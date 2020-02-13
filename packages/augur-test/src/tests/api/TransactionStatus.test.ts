import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import {
  TransactionMetadata,
  TransactionStatus,
} from 'contract-dependencies-ethers';
import { makeProvider } from '../../libs';

let john: ContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  await john.approveCentralAuthority();
});

test("TransactionStatus :: transaction status updates", async () => {
  const transactions: Array<TransactionMetadata> = [];
  const statuses: Array<TransactionStatus> = [];
  const hashes: Array<string | undefined> = [];
  john.augur.registerTransactionStatusCallback("Test", (transaction, status, hash) => {
    if (transaction.name != "createYesNoMarket") return;
    transactions.push(transaction);
    statuses.push(status);
    hashes.push(hash);
  });

  await john.createReasonableYesNoMarket();

  await expect(statuses[0]).toEqual(TransactionStatus.AWAITING_SIGNING);
  await expect(statuses[1]).toEqual(TransactionStatus.PENDING);
  await expect(statuses[2]).toEqual(TransactionStatus.SUCCESS);

  await expect(hashes[0]).toEqual(undefined);
  await expect(hashes[1]).not.toBe(undefined);
  await expect(hashes[1]).toEqual(hashes[2]);

  await expect(transactions[0]).toEqual(transactions[1]);
  await expect(transactions[1]).toEqual(transactions[2]);

  const tx = transactions[0];
  await expect(tx.name).toEqual("createYesNoMarket");
  await expect(tx.params._affiliateFeeDivisor).toEqual(new BigNumber(25));

});

/*
test("TransactionStatus :: transaction status events", async () => {
  const success = jest.fn();
  const awaitingSigning = jest.fn();
  const pending = jest.fn();

  john.augur.on(TXEventName.Success, success);
  john.augur.on(TXEventName.Pending, pending);
  john.augur.on(TXEventName.AwaitingSigning, awaitingSigning);

  await john.createReasonableYesNoMarket();

  expect(success).toHaveBeenCalled();
  expect(pending).toHaveBeenCalled();
  expect(awaitingSigning).toHaveBeenCalled();

}, 15000);

test("TransactionStatus :: transaction status events failure", async (done) => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  const awaitingSigning = jest.fn();
  const pending = jest.fn();
  const failure = jest.fn().mockImplementation(() => {
    done();
  });

  const myMock = jest.fn();
  myMock
    .mockReturnValueOnce({
      status: 1, logs: [{
        transactionIndex: 0,
        blockNumber: 90,
        transactionHash: "0x8f54c46f32718f605fe8954e2fcee9ca1ac65e32f5b37cae7e3ab2925eaf9c96",
        address: "0x4e61185d7f125B84ac4A1837a0688d2BB58e8491",
        topics:
          ["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
            "0x000000000000000000000000913da4198e6be1d5f5e4a40d0667f70c0b5430eb",
            "0x000000000000000000000000fcaf25bf38e7c86612a25ff18cb8e09ab07c9885"],
        data: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        logIndex: 0,
        blockHash: "0x691568428d9171d2d3d415fc816944b3324d47635c1f3f5ea7e0a7e78f045c75",
        transactionLogIndex: 0,
      }],
    })
    .mockReturnValueOnce({ status: 2, logs: [] });

  const spy = jest.spyOn(blockchain, 'makeSigner').mockImplementation(async (account: Account, provider: EthersProvider): Promise<EthersFastSubmitWallet> => {
    const wallet = await EthersFastSubmitWallet.create("c6cbd7d76bc5baca530c875663711b947efa6a86a900a9e8645ce32e5821484e", provider);
    wallet.sendTransaction = (): Promise<any> => {
      return {
        hash: "0x0000",
        wait: (): Promise<any> => {
          return myMock() as any;
        },
      } as any;
    };

    return wallet;
  });

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  await john.approveCentralAuthority();

  john.augur.on(TXEventName.Failure, failure);
  john.augur.on(TXEventName.Pending, pending);
  john.augur.on(TXEventName.AwaitingSigning, awaitingSigning);

  await john.createYesNoMarket({
    endTime: (await john.getTimestamp()).minus(Getters.Markets.SECONDS_IN_A_DAY),
    feePerCashInAttoCash: new BigNumber(10).pow(18).div(20), // 5% creator fee
    affiliateFeeDivisor: new BigNumber(0),
    designatedReporter: john.account.publicKey,
    extraInfo:
      '{"categories": ["yesNo category 1"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1", "tags": ["yesNo tag1-1", "yesNo tag1-2", "yesNo tag1-3"]}',
  }).catch((e) => { });

  // expect(failure).toHaveBeenCalled();
  expect(pending).toHaveBeenCalled();
  expect(awaitingSigning).toHaveBeenCalled();

  spy.mockRestore();
}, 15000);
*/

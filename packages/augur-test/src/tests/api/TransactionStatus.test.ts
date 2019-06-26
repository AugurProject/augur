import {
    ACCOUNTS,
    deployContracts,
    ContractAPI,
  } from "../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { BigNumber } from "bignumber.js";
import { TransactionStatus, TransactionMetadata } from "contract-dependencies-ethers";
  
  let john: ContractAPI;
  
  beforeAll(async () => {
    const {provider, addresses} = await deployContracts(ACCOUNTS, compilerOutput);
  
    john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
    await john.approveCentralAuthority();
  }, 120000);
  
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

  }, 15000);

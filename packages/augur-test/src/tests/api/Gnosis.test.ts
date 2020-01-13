import { GnosisSafeState } from '@augurproject/gnosis-relay-api';
import { SubscriptionEventName } from '@augurproject/sdk';
// tslint:disable-next-line:import-blacklist
import { CalculateGnosisSafeAddressParams } from '@augurproject/sdk/build/api/Gnosis';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
  Seed,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeProvider, MockGnosisRelayAPI } from '../../libs';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';

describe('Gnosis :: ', () => {
  let john: ContractAPI;
  let mockGnosisRelay: MockGnosisRelayAPI;
  let seed: Seed;
  let provider: TestEthersProvider;

  beforeAll(async () => {
    seed = await loadSeedFile(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
  });

  beforeEach(async () => {
    const providerFork = await provider.fork();

    mockGnosisRelay = new MockGnosisRelayAPI();
    john = await ContractAPI.userWrapper(
      ACCOUNTS[0],
      providerFork,
      seed.addresses,
      undefined,
      mockGnosisRelay
    );
    mockGnosisRelay.initialize(john);
  });

  test('make safe directly', async () => {
    // Make the Safe directly using ETH
    const gnosisSafe = await john.createGnosisSafeDirectlyWithETH();
    const owners = await gnosisSafe.getOwners_();

    await expect(owners).toEqual([john.account.publicKey]);

    const gnosisSafeResponse = await john.getGnosisSafeAddress(
      john.account.publicKey
    );
    await expect(gnosisSafeResponse).toEqual(gnosisSafe.address);
  });

  describe('getOrCreateGnosisSafe method', () => {
    test('should return wallet address if it exists', async done => {
      john.augur
        .events
        .on(SubscriptionEventName.GnosisSafeStatus, payload => {
          expect(payload).toEqual(
            expect.objectContaining({
              status: GnosisSafeState.AVAILABLE,
              safe: gnosisSafe.address,
              owner: john.account.publicKey,
            })
          );
          done();
        });

      const gnosisSafe = await john.createGnosisSafeDirectlyWithETH();

      const result = await john.augur.gnosis.getOrCreateGnosisSafe(
        john.account.publicKey
      );
      expect(result).toEqual(gnosisSafe.address);
    });

    test('should emit event with status if relay request was created', async done => {
      john.augur
        .events
        .on(SubscriptionEventName.GnosisSafeStatus, payload => {
          expect(payload).toEqual(
            expect.objectContaining({
              status: GnosisSafeState.WAITING_FOR_FUNDS,
              safe: expect.stringContaining('0x'),
              owner: john.account.publicKey,
            })
          );
          done();
        });

      await john.augur.gnosis.getOrCreateGnosisSafe(
        john.account.publicKey
      );
    });

    test('should return creation params if relay request was created', async () => {
      const result = await john.augur.gnosis.getOrCreateGnosisSafe(
        john.account.publicKey
      );

      expect(result).toEqual(
        expect.objectContaining({
          safe: expect.stringContaining('0x'),
          owner: john.account.publicKey,
          payment: expect.stringContaining('0x'),
        })
      );
    });
  });

  test('calculating safe address from creation params', async () => {
    const safe = await john.createGnosisSafeViaRelay(
      john.augur.contracts.cash.address
    );

    const calculateGnosisSafeAddressParams: CalculateGnosisSafeAddressParams = {
      owner: john.account.publicKey,
      paymentToken: safe.paymentToken,
      payment: safe.payment,
      safe: safe.safe,
    };

    const calculatedAddress = await john.augur.gnosis.calculateGnosisSafeAddress(
      calculateGnosisSafeAddressParams.owner, safe.payment
    );

    expect(calculatedAddress).toEqual(safe.safe);
  });

  test('should throw error when malicious relay', async () => {
    const fakeResponse = {
      safe: '0x91a47e8aa8DBFb3BdceE4C852fCDC194A0337E2A',
      setupData:
        '0xb63e800d000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006e968fe21894a35ba59ee8ec6f60ea0ddc3a59e500000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000575f3c652894360f4b7655379ea1eae53381e01200000000000000000000000000000000000000000000000000000000007270e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000913da4198e6be1d5f5e4a40d0667f70c0b5430eb000000000000000000000000000000000000000000000000000000000000012403d434a40000000000000000000000006e968fe21894a35ba59ee8ec6f60ea0ddc3a59e5000000000000000000000000fcaf25bf38e7c86612a25ff18cb8e09ab07c98850000000000000000000000008470f1aac60a08d2282616f19a4c52718847b847000000000000000000000000e60c9fe85aee7b4848a97271da8c86323cdfb897000000000000000000000000575f3c652894360f4b7655379ea1eae53381e012000000000000000000000000e78a332d0f96aa9a56b876c20125ba8a88619d07000000000000000000000000f265d8d30a1a2cdb9857e124010b02765c9a7c700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      paymentToken: '0x575F3c652894360F4b7655379EA1eae53381e012',
      proxyFactory: '0xdFeF677BF5f66f3EEFf481A587c04CB58e95b92a',
      paymentReceiver: '0xbd355a7e5a7adb23b51f54027e624bfe0e238df6',
      masterCopy: '0x9dA930a2ca12C197e687DB22dB3fA318FD8AA60a',
      gasPriceEstimated: '0x1',
      gasEstimated: '0x7270e0',
      payment: '0x7270e0',
      callback: '0x0000000000000000000000000000000000000000'
    };

    jest.spyOn(mockGnosisRelay, 'createSafe').mockResolvedValue(fakeResponse);
    await expect(
      john.createGnosisSafeViaRelay(john.augur.contracts.cash.address)
    ).rejects.toThrowError(new RegExp('Potential malicious relay'));
  });

  describe('make safe through relay', () => {
    test.skip('polling for status', async done => {
      const gnosisSafeResponse = await john.createGnosisSafeViaRelay(
        john.augur.contracts.cash.address
      );

      // Get the safe deployment status
      await expect(
        john.getGnosisSafeDeploymentStatusViaRelay(
          john.account.publicKey,
          gnosisSafeResponse.safe
        )
      ).resolves.toEqual({
        status: GnosisSafeState.WAITING_FOR_FUNDS,
      });

      const amount = new BigNumber(gnosisSafeResponse.payment).multipliedBy(2);

      await john.faucet(amount);
      await john.augur.contracts.cash.transfer(gnosisSafeResponse.safe, amount);

      const resp = await john.getGnosisSafeDeploymentStatusViaRelay(
        john.account.publicKey,
        gnosisSafeResponse.safe
      );

      expect(resp).toEqual({
        status: GnosisSafeState.CREATED,
        txHash: expect.stringContaining('0x'),
      });

      // This is here to make TS happy.
      if (resp.status !== GnosisSafeState.CREATED) return;

      john.augur
        .events
        .on(SubscriptionEventName.GnosisSafeStatus, async payload => {
          await expect(payload).toMatchObject({
            status: GnosisSafeState.AVAILABLE,
          });

          // The registry returns addresses in all upper case.
          await expect(
            john.augur.contracts.gnosisSafeRegistry.getSafe_(
              john.account.publicKey
            )
          ).resolves.toMatch(new RegExp(gnosisSafeResponse.safe, 'i'));
          done();
        });

      const receipt = await john.provider.waitForTransaction(resp.txHash);
      await expect(receipt).not.toBeNull();
    });
  });
});

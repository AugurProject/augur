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
import { TestEthersProvider } from '../../libs/TestEthersProvider';

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
    const mary = await ContractAPI.userWrapper(
      ACCOUNTS[1],
      providerFork,
      seed.addresses,
      undefined,
      undefined
    );

    mockGnosisRelay = new MockGnosisRelayAPI(mary);
    john = await ContractAPI.userWrapper(
      ACCOUNTS[0],
      providerFork,
      seed.addresses,
      undefined,
      mockGnosisRelay
    );
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
    const safe = '0xDEADBEEF';

    test('should return wallet address if it exists', async done => {
      john.augur
        .getAugurEventEmitter()
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
        .getAugurEventEmitter()
        .on(SubscriptionEventName.GnosisSafeStatus, payload => {
          expect(payload).toEqual(
            expect.objectContaining({
              status: {
                status: GnosisSafeState.WAITING_FOR_FUNDS,
              },
              safe: expect.stringContaining('0x'),
              owner: john.account.publicKey,
            })
          );
          done();
        });

      const result = await john.augur.gnosis.getOrCreateGnosisSafe(
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

    // This are random values used to create a relay request on the mainnet relay.
    const calculateGnosisSafeAddressParams: CalculateGnosisSafeAddressParams = {
      owner: john.account.publicKey,
      paymentToken: safe.paymentToken,
      payment: safe.payment,
      safe: safe.safe,
    };

    const calculatedAddress = await john.augur.gnosis.calculateGnosisSafeAddress(
      calculateGnosisSafeAddressParams
    );

    expect(calculatedAddress).toEqual(safe.safe);
  });

  describe('make safe through relay', () => {
    test('polling for status', async done => {
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

      const receipt = await john.provider.waitForTransaction(resp.txHash);
      expect(receipt).not.toBeNull();

      john.augur.getAugurEventEmitter().emit(SubscriptionEventName.NewBlock);

      john.augur
        .getAugurEventEmitter()
        .on(SubscriptionEventName.GnosisSafeStatus, async payload => {
          expect(payload).toMatchObject({
            status: expect.objectContaining({
              status: GnosisSafeState.AVAILABLE,
            }),
          });

          // The registry returns addresses in all upper case.
          await expect(
            john.augur.contracts.gnosisSafeRegistry.getSafe_(
              john.account.publicKey
            )
          ).resolves.toMatch(new RegExp(gnosisSafeResponse.safe, 'i'));
          done();
        });

      // Cause checkSafe to fire.
      john.augur
        .getAugurEventEmitter()
        .emit(SubscriptionEventName.NewBlock, {});
    });
  });
});

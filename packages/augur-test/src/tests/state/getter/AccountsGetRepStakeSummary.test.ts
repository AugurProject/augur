import { SECONDS_IN_A_DAY } from '@augurproject/sdk-lite';
import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../libs';

describe('State API :: Accounts :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const config = provider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      config
    );

    await john.approve();
    await mary.approve();
  });

  test(':getAccountTransactionHistory', async () => {
    // Create markets with multiple users
    const yesNoMarket1 = await john.createReasonableYesNoMarket();

    // Move time to open reporting
    let newTime = (await yesNoMarket1.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(1000),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(1000),
    ];
    await john.doInitialReport(yesNoMarket1, noPayoutSet);

    await john.sync();

    let accountRepStakeSummary = await john.api.route(
      'getAccountRepStakeSummary',
      {
        universe: john.augur.contracts.universe.address,
        account: ACCOUNTS[0].address,
      }
    );
    expect(accountRepStakeSummary.repWinnings).toEqual('0');
    expect(accountRepStakeSummary.reporting.contracts.length).toEqual(1);
    expect(accountRepStakeSummary.reporting.contracts[0].isClaimable).toEqual(
      false
    );

    // Move time to dispute window start time
    const marketDisputeWindowAddress = await yesNoMarket1.getDisputeWindow_();
    const marketDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      marketDisputeWindowAddress
    );
    newTime = new BigNumber(await marketDisputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    const disputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(
      false
    );
    const disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    await john.faucetRep(new BigNumber(1e25));
    await mary.faucetRep(new BigNumber(1e25));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(yesNoMarket1.address);
        await mary.contribute(market, yesPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket1,
          yesPayoutSet
        );
        if (remainingToFill.gte(0)) {
          await mary.contribute(market, yesPayoutSet, remainingToFill);
        }
      } else {
        await john.contribute(yesNoMarket1, noPayoutSet, new BigNumber(25000));
        const remainingToFill = await john.getRemainingToFill(
          yesNoMarket1,
          noPayoutSet
        );
        if (remainingToFill.gte(0)) {
          await john.contribute(yesNoMarket1, noPayoutSet, remainingToFill);
        }
      }
    }

    await john.sync();

    accountRepStakeSummary = await john.api.route('getAccountRepStakeSummary', {
      universe: john.augur.contracts.universe.address,
      account: ACCOUNTS[0].address,
    });
    expect(accountRepStakeSummary.repWinnings).toEqual('0');
    expect(accountRepStakeSummary.reporting.contracts.length).toEqual(1);
    expect(accountRepStakeSummary.reporting.contracts[0].isClaimable).toEqual(
      false
    );
    expect(accountRepStakeSummary.disputing.contracts.length).toEqual(1);
    expect(accountRepStakeSummary.disputing.contracts[0].isClaimable).toEqual(
      false
    );
    expect(accountRepStakeSummary.participationTokens.contracts.length).toEqual(
      1
    );
    expect(
      accountRepStakeSummary.participationTokens.contracts[0].isClaimable
    ).toEqual(false);

    accountRepStakeSummary = await john.api.route('getAccountRepStakeSummary', {
      universe: john.augur.contracts.universe.address,
      account: ACCOUNTS[1].address,
    });
    expect(accountRepStakeSummary.repWinnings).toEqual('0');
    expect(accountRepStakeSummary.reporting.contracts.length).toEqual(0);
    expect(accountRepStakeSummary.disputing.contracts.length).toEqual(2);
    expect(accountRepStakeSummary.disputing.contracts[0].isClaimable).toEqual(
      false
    );
    expect(accountRepStakeSummary.disputing.contracts[1].isClaimable).toEqual(
      false
    );

    // Move time forward by 2 weeks
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    // Finalize markets & redeem crowdsourcer funds
    await yesNoMarket1.finalize();

    // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    await john.augur.contracts.cash.transfer(
      disputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(
      disputeWindow.address,
      john.account.address
    );

    // Claim initial reporter
    const initialReporter = await john.getInitialReporter(yesNoMarket1);
    await initialReporter.redeem(john.account.address);

    // Claim winning crowdsourcers
    const winningReportingParticipant = await john.getWinningReportingParticipant(
      yesNoMarket1
    );
    await winningReportingParticipant.redeem(john.account.address);
    await winningReportingParticipant.redeem(mary.account.address);

    await john.sync();

    accountRepStakeSummary = await john.api.route('getAccountRepStakeSummary', {
      universe: john.augur.contracts.universe.address,
      account: ACCOUNTS[0].address,
    });
    expect(accountRepStakeSummary.repWinnings).toEqual('0');
    expect(accountRepStakeSummary.reporting.contracts.length).toEqual(0);
    expect(accountRepStakeSummary.disputing.contracts.length).toEqual(0);
    expect(accountRepStakeSummary.participationTokens.contracts.length).toEqual(
      0
    );

    accountRepStakeSummary = await john.api.route('getAccountRepStakeSummary', {
      universe: john.augur.contracts.universe.address,
      account: ACCOUNTS[1].address,
    });
    expect(accountRepStakeSummary.repWinnings).toEqual('839233398437500002');
    expect(accountRepStakeSummary.reporting.contracts.length).toEqual(0);
    expect(accountRepStakeSummary.disputing.contracts.length).toEqual(1);
    expect(accountRepStakeSummary.disputing.contracts[0].isClaimable).toEqual(
      true
    );
  });
});

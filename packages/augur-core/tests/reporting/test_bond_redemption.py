from ethereum.tools import tester
from eth_tester.exceptions import TransactionFailed, ABIContract
from pytest import fixture, mark, raises
from utils import longTo32Bytes, bytesToHexString, TokenDelta, EtherDelta, longToHexString, PrintGasUsed, AssertLog
from reporting_utils import proceedToNextRound, finalize, proceedToDesignatedReporting

def test_initial_report(localFixture, universe, market, categoricalMarket, scalarMarket, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    constants = localFixture.contracts["Constants"]

    # Now end the window and finalize
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    assert market.finalize()
    assert categoricalMarket.finalize()
    assert scalarMarket.finalize()

    marketInitialReport = localFixture.applySignature('InitialReporter', market.getInitialReporter())
    categoricalInitialReport = localFixture.applySignature('InitialReporter', categoricalMarket.getInitialReporter())

    marketStake = marketInitialReport.getStake()
    initialReporterRedeemedLog = {
        "reporter": bytesToHexString(tester.a0),
        "amountRedeemed": marketStake,
        "repReceived": marketStake,
        "payoutNumerators": [0, market.getNumTicks(), 0],
        "universe": universe.address,
        "market": market.address
    }
    with AssertLog(localFixture, "InitialReporterRedeemed", initialReporterRedeemedLog):
        with TokenDelta(reputationToken, marketStake, tester.a0, "Redeeming didn't refund REP"):
            assert marketInitialReport.redeem(tester.a0)

    categoricalMarketStake = categoricalInitialReport.getStake()
    with TokenDelta(reputationToken, categoricalMarketStake, tester.a0, "Redeeming didn't refund REP"):
        assert categoricalInitialReport.redeem(tester.a0)

@mark.parametrize('finalize', [
    True,
    False,
])
def test_failed_crowdsourcer(finalize, localFixture, universe, market, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # We'll make the window active
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers contribute to a dispute but not reach the target
    bondSize = market.getParticipantStake() * 2
    partialFill = bondSize / 6

    # confirm we can contribute 0
    assert market.contribute([0, 1, market.getNumTicks()-1], 0, "", sender=tester.k1)

    with TokenDelta(reputationToken, -partialFill, tester.a1, "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 1, market.getNumTicks()-1], partialFill, "", sender=tester.k1)

    with TokenDelta(reputationToken, -partialFill, tester.a2, "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 1, market.getNumTicks()-1], partialFill, "", sender=tester.k2)

    assert market.getDisputeWindow() == disputeWindow.address

    payoutDistributionHash = market.derivePayoutDistributionHash([0, 1, market.getNumTicks()-1])
    failedCrowdsourcer = localFixture.applySignature("DisputeCrowdsourcer", market.getCrowdsourcer(payoutDistributionHash))

    # confirm we cannot contribute directly to a crowdsourcer without going through the market
    with raises(TransactionFailed):
        failedCrowdsourcer.contribute(tester.a0, 1)

    if finalize:
        # Fast forward time until the dispute window is over and we can redeem to recieve the REP back
        localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    else:
        # Continue to the next round which will disavow failed crowdsourcers and let us redeem once the window is over
        market.contribute([0, 0, market.getNumTicks()], bondSize, "")
        assert market.getDisputeWindow() != disputeWindow.address
        localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    with TokenDelta(reputationToken, partialFill, tester.a1, "Redeeming did not refund REP"):
        assert failedCrowdsourcer.redeem(tester.a1)

    with TokenDelta(reputationToken, partialFill, tester.a2, "Redeeming did not refund REP"):
        assert failedCrowdsourcer.redeem(tester.a2)

def test_one_round_crowdsourcer(localFixture, universe, market, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    constants = localFixture.contracts["Constants"]

    # We'll make the window active
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers push markets into the next round by funding dispute crowdsourcers
    amount = 2 * market.getParticipantStake()
    with TokenDelta(reputationToken, -amount, tester.a1, "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=tester.k1)

    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow.address

    # fast forward time to the fee new window
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # Fast forward time until the new dispute window is over and we can redeem our winning stake, and dispute bond tokens
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    initialReporter = localFixture.applySignature('InitialReporter', market.getReportingParticipant(0))
    marketDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(1))

    expectedRep = reputationToken.balanceOf(marketDisputeCrowdsourcer.address)
    disputeCrowdsourcerRedeemedLog = {
        "reporter": bytesToHexString(tester.a1),
        "disputeCrowdsourcer": marketDisputeCrowdsourcer.address,
        "amountRedeemed": marketDisputeCrowdsourcer.getStake(),
        "repReceived": expectedRep,
        "payoutNumerators": [0, 0, market.getNumTicks()],
        "universe": universe.address,
        "market": market.address
    }
    with AssertLog(localFixture, "DisputeCrowdsourcerRedeemed", disputeCrowdsourcerRedeemedLog):
        with TokenDelta(reputationToken, expectedRep, tester.a1, "Redeeming didn't refund REP"):
            assert marketDisputeCrowdsourcer.redeem(tester.a1, sender=tester.k1)

    # The initial reporter does not get their REP back
    with TokenDelta(reputationToken, 0, tester.a0, "Redeeming didn't refund REP"):
        assert initialReporter.redeem(tester.a0)

def test_multiple_round_crowdsourcer(localFixture, universe, market, cash, reputationToken):
    constants = localFixture.contracts["Constants"]

    # Initial Report disputed
    proceedToNextRound(localFixture, market, tester.k1, True)
    # Initial Report winning
    proceedToNextRound(localFixture, market, tester.k2, True)
    # Initial Report disputed
    proceedToNextRound(localFixture, market, tester.k1, True, randomPayoutNumerators=True)
    # Initial Report winning
    proceedToNextRound(localFixture, market, tester.k3, True)

    # Get all the winning Reporting Participants
    initialReporter = localFixture.applySignature('InitialReporter', market.getReportingParticipant(0))
    winningDisputeCrowdsourcer1 = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(2))
    winningDisputeCrowdsourcer2 = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(4))

    # Get losing Reporting Participants
    losingDisputeCrowdsourcer1 = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(1))
    losingDisputeCrowdsourcer2 = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(3))

    # We can't redeem yet as the market isn't finalized
    with raises(TransactionFailed):
        initialReporter.redeem(tester.a0)

    with raises(TransactionFailed):
        winningDisputeCrowdsourcer1.redeem(tester.a2)

    # Fast forward time until the new dispute window is over
    disputeWindow = localFixture.applySignature("DisputeWindow", market.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    expectedRep = initialReporter.getStake() + initialReporter.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, tester.a0, "Redeeming didn't refund REP"):
        assert initialReporter.redeem(tester.a0)

    expectedRep = winningDisputeCrowdsourcer1.getStake() + winningDisputeCrowdsourcer1.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, tester.a2, "Redeeming didn't refund REP"):
        assert winningDisputeCrowdsourcer1.redeem(tester.a2)

    expectedRep = winningDisputeCrowdsourcer2.getStake() + winningDisputeCrowdsourcer2.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, tester.a3, "Redeeming didn't refund REP"):
        assert winningDisputeCrowdsourcer2.redeem(tester.a3)

    # The losing reports get no REP
    with TokenDelta(reputationToken, 0, tester.a1, "Redeeming refunded REP"):
        assert losingDisputeCrowdsourcer1.redeem(tester.a1)

    with TokenDelta(reputationToken, 0, tester.a1, "Redeeming refunded REP"):
        assert losingDisputeCrowdsourcer2.redeem(tester.a1)

def test_multiple_contributors_crowdsourcer(localFixture, universe, market, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # We'll make the window active
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers push markets into the next round by funding dispute crowdsourcers
    amount = market.getParticipantStake()
    with TokenDelta(reputationToken, -amount, tester.a1, "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=tester.k1)
    with TokenDelta(reputationToken, -amount, tester.a2, "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=tester.k2)

    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow.address

    # fast forward time to the fee new window
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # Fast forward time until the new dispute window is over and we can redeem our winning stake, and dispute bond tokens
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    marketDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.getReportingParticipant(1))

    expectedRep = amount + amount * 2 / 5
    with TokenDelta(reputationToken, expectedRep, tester.a1, "Redeeming didn't refund REP"):
        assert marketDisputeCrowdsourcer.redeem(tester.a1)

    with TokenDelta(reputationToken, expectedRep, tester.a2, "Redeeming didn't refund REP"):
        assert marketDisputeCrowdsourcer.redeem(tester.a2)

def test_forkAndRedeem(localFixture, universe, market, categoricalMarket, cash, reputationToken):
    # Let's do some initial disputes for the categorical market
    proceedToNextRound(localFixture, categoricalMarket, tester.k1, moveTimeForward = False)

    # Get to a fork
    testers = [tester.k0, tester.k1, tester.k2, tester.k3]
    testerIndex = 1
    while (market.getForkingMarket() == longToHexString(0)):
        proceedToNextRound(localFixture, market, testers[testerIndex], True)
        testerIndex += 1
        testerIndex = testerIndex % len(testers)

    # Have the participants fork and create new child universes
    for i in range(market.getNumParticipants()):
        reportingParticipant = localFixture.applySignature("DisputeCrowdsourcer", market.getReportingParticipant(i))

    # Finalize the fork
    finalize(localFixture, market, universe)

    categoricalDisputeCrowdsourcer = localFixture.applySignature("DisputeCrowdsourcer", categoricalMarket.getReportingParticipant(1))

    # Migrate the categorical market into the winning universe. This will disavow the dispute crowdsourcer on it, letting us redeem for original universe rep
    assert categoricalMarket.migrateThroughOneFork([0,0,0,categoricalMarket.getNumTicks()], "")

    expectedRep = categoricalDisputeCrowdsourcer.getStake()
    with TokenDelta(reputationToken, expectedRep, tester.a1, "Redeeming didn't increase REP correctly"):
        categoricalDisputeCrowdsourcer.redeem(tester.a1)

    noPayoutNumerators = [0] * market.getNumberOfOutcomes()
    noPayoutNumerators[1] = market.getNumTicks()
    yesPayoutNumerators = [0] * market.getNumberOfOutcomes()
    yesPayoutNumerators[2] = market.getNumTicks()
    noUniverse =  localFixture.applySignature('Universe', universe.createChildUniverse(noPayoutNumerators))
    yesUniverse =  localFixture.applySignature('Universe', universe.createChildUniverse(yesPayoutNumerators))
    noUniverseReputationToken = localFixture.applySignature('ReputationToken', noUniverse.getReputationToken())
    yesUniverseReputationToken = localFixture.applySignature('ReputationToken', yesUniverse.getReputationToken())

    # Now we'll fork and redeem the reporting participants
    for i in range(market.getNumParticipants()):
        account = localFixture.testerAddress[i % 4]
        key = localFixture.testerKey[i % 4]
        reportingParticipant = localFixture.applySignature("DisputeCrowdsourcer", market.getReportingParticipant(i))
        expectedRep = reputationToken.balanceOf(reportingParticipant.address) * 7 / 5 # * 1.4 to account for the minting reward of 40%
        repToken = noUniverseReputationToken if i % 2 == 0 else yesUniverseReputationToken
        with TokenDelta(repToken, expectedRep, account, "Redeeming didn't increase REP correctly for " + str(i)):
            assert reportingParticipant.forkAndRedeem(sender=key)

def test_preemptive_crowdsourcer_contributions_never_used(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 200 * 10 ** 18
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize, "")

    # Now let the market resolve with the initial report
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # The premptive bond can be redeemed for the REP staked
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    with TokenDelta(reputationToken, preemptiveBondSize, tester.a0, "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(tester.a0)


def test_preemptive_crowdsourcer_contributions_disputed_wins(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 200 * 10 ** 18

    # We'll have one user buy all the stake that will award an ROI and another user buy the remaining stake which will not
    initialStake = market.getParticipantStake()
    realBondSize = initialStake * 3
    assert market.contributeToTentative([0, market.getNumTicks(), 0], realBondSize, "")
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize - realBondSize, "", sender = tester.k1)
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    # Now we'll dispute the intial report
    proceedToNextRound(localFixture, market)

    # By disputing we actually cause the preemptive bond to get placed.
    assert market.getParticipantStake() == preemptiveBondSize + initialStake * 3

    # We'll simply move time forward and let this bond placed on the initial report outcome win
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # The account which placed stake first and got normal tokens will make the normal 40% ROI
    expectedWinnings = realBondSize * .4
    with TokenDelta(reputationToken, realBondSize + expectedWinnings, tester.a0, "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(tester.a0)

    # The account which placed stake later and got overload tokens will not make any ROI
    with TokenDelta(reputationToken, preemptiveBondSize - realBondSize, tester.a1, "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(tester.a1)

def test_preemptive_crowdsourcer_contributions_disputed_loses(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 200 * 10 ** 18
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize, "")

    initialStake = market.getParticipantStake()
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    # Now we'll dispute the intial report
    proceedToNextRound(localFixture, market)

    # By disputing we actually cause the preemptive bond to get placed.
    assert market.getParticipantStake() == preemptiveBondSize + initialStake * 3

    # We'll dispute this newly placed bond made from the preemptive contributions
    proceedToNextRound(localFixture, market)

    # And now we'll let the dispute win
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # The preemptive bond has been liquidated
    assert reputationToken.balanceOf(preemptiveDisputeCrowdsourcer.address) == 0

def test_preemptive_crowdsourcer_contributions_disputed_twice_wins(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 200 * 10 ** 18

    # We'll have one user buy all the stake that will award an ROI and another user buy the remaining stake which will not
    initialStake = market.getParticipantStake()
    realBondSize = initialStake * 3
    assert market.contributeToTentative([0, market.getNumTicks(), 0], realBondSize, "")
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize - realBondSize, "", sender = tester.k1)
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    # Now we'll dispute the intial report
    proceedToNextRound(localFixture, market)

    # By disputing we actually cause the preemptive bond to get placed.
    assert market.getParticipantStake() == preemptiveBondSize + initialStake * 3

    # We'll dispute this newly placed bond made from the preemptive contributions
    proceedToNextRound(localFixture, market)

    # And now we'll do one more dispute in favor of the initial report
    proceedToNextRound(localFixture, market)

    # Now we finalize the market
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Because the overloaded bond was disputed there is now sufficient REP to award the overload tokens with ROI as well so both users will receive a 40% ROI
    expectedWinnings = realBondSize * .4
    with TokenDelta(reputationToken, realBondSize + expectedWinnings, tester.a0, "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(tester.a0)

    overloadStake = preemptiveBondSize - realBondSize
    expectedWinnings = overloadStake * .4
    with TokenDelta(reputationToken, overloadStake + expectedWinnings, tester.a1, "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(tester.a1)

@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    universe = ABIContract(fixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)
    market = ABIContract(fixture.chain, kitchenSinkSnapshot['yesNoMarket'].translator, kitchenSinkSnapshot['yesNoMarket'].address)
    categoricalMarket = ABIContract(fixture.chain, kitchenSinkSnapshot['categoricalMarket'].translator, kitchenSinkSnapshot['categoricalMarket'].address)
    scalarMarket = ABIContract(fixture.chain, kitchenSinkSnapshot['scalarMarket'].translator, kitchenSinkSnapshot['scalarMarket'].address)

    # Skip to Designated Reporting
    fixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

    # Distribute REP
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
    for testAccount in [tester.a1, tester.a2, tester.a3]:
        reputationToken.transfer(testAccount, 1 * 10**6 * 10**18)

    # Designated Report on the markets
    designatedReportCost = universe.getOrCacheDesignatedReportStake()
    with TokenDelta(reputationToken, 0, tester.a0, "Doing the designated report didn't deduct REP correctly or didn't award the no show bond"):
        market.doInitialReport([0, market.getNumTicks(), 0], "")
        categoricalMarket.doInitialReport([0, categoricalMarket.getNumTicks(), 0, 0], "")
        scalarMarket.doInitialReport([0, scalarMarket.getNumTicks(), 0], "")

    return fixture.createSnapshot()

@fixture
def localFixture(fixture, localSnapshot):
    fixture.resetToSnapshot(localSnapshot)
    return fixture

@fixture
def reputationToken(localFixture, kitchenSinkSnapshot, universe):
    return localFixture.applySignature('ReputationToken', universe.getReputationToken())

@fixture
def universe(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)

@fixture
def market(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['yesNoMarket'].translator, kitchenSinkSnapshot['yesNoMarket'].address)

@fixture
def categoricalMarket(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['categoricalMarket'].translator, kitchenSinkSnapshot['categoricalMarket'].address)

@fixture
def scalarMarket(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['scalarMarket'].translator, kitchenSinkSnapshot['scalarMarket'].address)

@fixture
def cash(localFixture, kitchenSinkSnapshot):
    return ABIContract(localFixture.chain, kitchenSinkSnapshot['cash'].translator, kitchenSinkSnapshot['cash'].address)

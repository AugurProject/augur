from eth_tester.exceptions import TransactionFailed
from pytest import fixture, mark, raises
from utils import longTo32Bytes, TokenDelta, EtherDelta, longToHexString, PrintGasUsed, AssertLog
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
        "reporter": localFixture.accounts[0],
        "amountRedeemed": marketStake,
        "repReceived": marketStake,
        "payoutNumerators": [0, market.getNumTicks(), 0],
        "universe": universe.address,
        "market": market.address
    }
    with AssertLog(localFixture, "InitialReporterRedeemed", initialReporterRedeemedLog):
        with TokenDelta(reputationToken, marketStake, localFixture.accounts[0], "Redeeming didn't refund REP"):
            assert marketInitialReport.redeem(localFixture.accounts[0])

    categoricalMarketStake = categoricalInitialReport.getStake()
    with TokenDelta(reputationToken, categoricalMarketStake, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert categoricalInitialReport.redeem(localFixture.accounts[0])

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
    assert market.contribute([0, 1, market.getNumTicks()-1], 0, "", sender=localFixture.accounts[1])

    with TokenDelta(reputationToken, -partialFill, localFixture.accounts[1], "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 1, market.getNumTicks()-1], partialFill, "", sender=localFixture.accounts[1])

    with TokenDelta(reputationToken, -partialFill, localFixture.accounts[2], "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 1, market.getNumTicks()-1], partialFill, "", sender=localFixture.accounts[2])

    assert market.getDisputeWindow() == disputeWindow.address

    payoutDistributionHash = market.derivePayoutDistributionHash([0, 1, market.getNumTicks()-1])
    failedCrowdsourcer = localFixture.applySignature("DisputeCrowdsourcer", market.getCrowdsourcer(payoutDistributionHash))

    # confirm we cannot contribute directly to a crowdsourcer without going through the market
    with raises(TransactionFailed):
        failedCrowdsourcer.contribute(localFixture.accounts[0], 1, False)

    if finalize:
        # Fast forward time until the dispute window is over and we can redeem to recieve the REP back
        localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    else:
        # Continue to the next round which will disavow failed crowdsourcers and let us redeem once the window is over
        market.contribute([0, 0, market.getNumTicks()], bondSize, "")
        assert market.getDisputeWindow() != disputeWindow.address
        localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    with TokenDelta(reputationToken, partialFill, localFixture.accounts[1], "Redeeming did not refund REP"):
        assert failedCrowdsourcer.redeem(localFixture.accounts[1])

    with TokenDelta(reputationToken, partialFill, localFixture.accounts[2], "Redeeming did not refund REP"):
        assert failedCrowdsourcer.redeem(localFixture.accounts[2])

@mark.parametrize('finalize', [
    True,
    False,
])
def test_one_round_crowdsourcer(finalize, localFixture, universe, market, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    constants = localFixture.contracts["Constants"]

    # We'll make the window active
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers push markets into the next round by funding dispute crowdsourcers
    amount = 2 * market.getParticipantStake()
    with TokenDelta(reputationToken, -amount, localFixture.accounts[1], "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=localFixture.accounts[1])

    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow.address

    # fast forward time to the fee new window
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # Fast forward time until the new dispute window is over and we can redeem our winning stake, and dispute bond tokens
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    if finalize:
        assert market.finalize()

    initialReporter = localFixture.applySignature('InitialReporter', market.participants(0))
    marketDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.participants(1))

    # The initial reporter does not get their REP back
    with TokenDelta(reputationToken, 0, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert initialReporter.redeem(localFixture.accounts[0])

    expectedRep = reputationToken.balanceOf(marketDisputeCrowdsourcer.address)
    disputeCrowdsourcerRedeemedLog = {
        "reporter": localFixture.accounts[1],
        "disputeCrowdsourcer": marketDisputeCrowdsourcer.address,
        "amountRedeemed": marketDisputeCrowdsourcer.getStake(),
        "repReceived": expectedRep,
        "payoutNumerators": [0, 0, market.getNumTicks()],
        "universe": universe.address,
        "market": market.address
    }
    with AssertLog(localFixture, "DisputeCrowdsourcerRedeemed", disputeCrowdsourcerRedeemedLog):
        with TokenDelta(reputationToken, expectedRep, localFixture.accounts[1], "Redeeming didn't refund REP"):
            assert marketDisputeCrowdsourcer.redeem(localFixture.accounts[1], sender=localFixture.accounts[1])

def test_multiple_round_crowdsourcer(localFixture, universe, market, cash, reputationToken):
    constants = localFixture.contracts["Constants"]

    # Initial Report disputed
    proceedToNextRound(localFixture, market, localFixture.accounts[1], True)
    # Initial Report winning
    proceedToNextRound(localFixture, market, localFixture.accounts[2], True)
    # Initial Report disputed
    proceedToNextRound(localFixture, market, localFixture.accounts[1], True, randomPayoutNumerators=True)
    # Initial Report winning
    proceedToNextRound(localFixture, market, localFixture.accounts[3], True)

    # Get all the winning Reporting Participants
    initialReporter = localFixture.applySignature('InitialReporter', market.participants(0))
    winningDisputeCrowdsourcer1 = localFixture.applySignature('DisputeCrowdsourcer', market.participants(2))
    winningDisputeCrowdsourcer2 = localFixture.applySignature('DisputeCrowdsourcer', market.participants(4))

    # Get losing Reporting Participants
    losingDisputeCrowdsourcer1 = localFixture.applySignature('DisputeCrowdsourcer', market.participants(1))
    losingDisputeCrowdsourcer2 = localFixture.applySignature('DisputeCrowdsourcer', market.participants(3))

    # We can't redeem yet as the market isn't finalized
    with raises(TransactionFailed):
        initialReporter.redeem(localFixture.accounts[0])

    with raises(TransactionFailed):
        winningDisputeCrowdsourcer1.redeem(localFixture.accounts[2])

    # Fast forward time until the new dispute window is over
    disputeWindow = localFixture.applySignature("DisputeWindow", market.getDisputeWindow())
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    expectedRep = initialReporter.getStake() + initialReporter.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert initialReporter.redeem(localFixture.accounts[0])

    expectedRep = winningDisputeCrowdsourcer1.getStake() + winningDisputeCrowdsourcer1.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[2], "Redeeming didn't refund REP"):
        assert winningDisputeCrowdsourcer1.redeem(localFixture.accounts[2])

    expectedRep = winningDisputeCrowdsourcer2.getStake() + winningDisputeCrowdsourcer2.getStake() * 2 / 5
    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[3], "Redeeming didn't refund REP"):
        assert winningDisputeCrowdsourcer2.redeem(localFixture.accounts[3])

    # The losing reports get no REP
    with TokenDelta(reputationToken, 0, localFixture.accounts[1], "Redeeming refunded REP"):
        assert losingDisputeCrowdsourcer1.redeem(localFixture.accounts[1])

    with TokenDelta(reputationToken, 0, localFixture.accounts[1], "Redeeming refunded REP"):
        assert losingDisputeCrowdsourcer2.redeem(localFixture.accounts[1])

def test_multiple_contributors_crowdsourcer(localFixture, universe, market, cash, reputationToken):
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # We'll make the window active
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # We'll have testers push markets into the next round by funding dispute crowdsourcers
    amount = market.getParticipantStake()
    with TokenDelta(reputationToken, -amount, localFixture.accounts[1], "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=localFixture.accounts[1])
    with TokenDelta(reputationToken, -amount, localFixture.accounts[2], "Disputing did not reduce REP balance correctly"):
        assert market.contribute([0, 0, market.getNumTicks()], amount, "", sender=localFixture.accounts[2])

    newDisputeWindowAddress = market.getDisputeWindow()
    assert newDisputeWindowAddress != disputeWindow.address

    # fast forward time to the fee new window
    disputeWindow = localFixture.applySignature('DisputeWindow', newDisputeWindowAddress)
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # Fast forward time until the new dispute window is over and we can redeem our winning stake, and dispute bond tokens
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    marketDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.participants(1))

    expectedRep = amount + amount * 2 / 5
    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[1], "Redeeming didn't refund REP"):
        assert marketDisputeCrowdsourcer.redeem(localFixture.accounts[1])

    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[2], "Redeeming didn't refund REP"):
        assert marketDisputeCrowdsourcer.redeem(localFixture.accounts[2])

def test_forkAndRedeem(localFixture, universe, market, categoricalMarket, cash, reputationToken):
    # Let's do some initial disputes for the categorical market
    proceedToNextRound(localFixture, categoricalMarket, localFixture.accounts[1], moveTimeForward = False)

    # Get to a fork
    testers = [localFixture.accounts[0], localFixture.accounts[1], localFixture.accounts[2], localFixture.accounts[3]]
    testerIndex = 1
    while (market.getForkingMarket() == longToHexString(0)):
        proceedToNextRound(localFixture, market, testers[testerIndex], True)
        testerIndex += 1
        testerIndex = testerIndex % len(testers)

    # Have the participants fork and create new child universes
    for i in range(market.getNumParticipants()):
        reportingParticipant = localFixture.applySignature("DisputeCrowdsourcer", market.participants(i))

    # Finalize the fork
    finalize(localFixture, market, universe)

    categoricalDisputeCrowdsourcer = localFixture.applySignature("DisputeCrowdsourcer", categoricalMarket.participants(1))

    # Migrate the categorical market into the winning universe. This will disavow the dispute crowdsourcer on it, letting us redeem for original universe rep
    assert categoricalMarket.migrateThroughOneFork([0,0,0,categoricalMarket.getNumTicks()], "")

    expectedRep = categoricalDisputeCrowdsourcer.getStake()
    with TokenDelta(reputationToken, expectedRep, localFixture.accounts[1], "Redeeming didn't increase REP correctly"):
        categoricalDisputeCrowdsourcer.redeem(localFixture.accounts[1])

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
        account = localFixture.accounts[i % 4]
        reportingParticipant = localFixture.applySignature("DisputeCrowdsourcer", market.participants(i))
        expectedRep = reputationToken.balanceOf(reportingParticipant.address) * 7 / 5 # * 1.4 to account for the minting reward of 40%
        repToken = noUniverseReputationToken if i % 2 == 0 else yesUniverseReputationToken
        with TokenDelta(repToken, expectedRep, account, "Redeeming didn't increase REP correctly for " + str(i)):
            assert reportingParticipant.forkAndRedeem(sender=account)

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

    with TokenDelta(reputationToken, preemptiveBondSize, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[0])


def test_preemptive_crowdsourcer_contributions_disputed_wins(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 200 * 10 ** 18

    # We'll have one user buy all the stake that will award an ROI and another user buy the remaining stake which will not
    initialStake = market.getParticipantStake()
    realBondSize = initialStake * 3
    assert market.contributeToTentative([0, market.getNumTicks(), 0], realBondSize, "")
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize - realBondSize, "", sender = localFixture.accounts[1])
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

    # Both accounts will get a lower than 40% ROI for their contributions to the tentative outcome
    expectedReturn = reputationToken.balanceOf(preemptiveDisputeCrowdsourcer.address) * realBondSize / preemptiveDisputeCrowdsourcer.totalSupply()
    with TokenDelta(reputationToken, expectedReturn, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[0])

    expectedReturn = reputationToken.balanceOf(preemptiveDisputeCrowdsourcer.address) * (preemptiveBondSize - realBondSize) / preemptiveDisputeCrowdsourcer.totalSupply()
    with TokenDelta(reputationToken, expectedReturn, localFixture.accounts[1], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[1])

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

    # We'll have two users buy stake in varying amounts
    initialStake = market.getParticipantStake()
    realBondSize = initialStake * 3
    assert market.contributeToTentative([0, market.getNumTicks(), 0], realBondSize, "")
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize - realBondSize, "", sender = localFixture.accounts[1])
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
    with TokenDelta(reputationToken, realBondSize + expectedWinnings, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[0])

    overloadStake = preemptiveBondSize - realBondSize
    expectedWinnings = overloadStake * .4
    with TokenDelta(reputationToken, overloadStake + expectedWinnings, localFixture.accounts[1], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[1])

def test_preemptive_crowdsourcer_contributions_dont_fill_bonds(localFixture, universe, market, reputationToken):
    # We can pre-emptively stake REP in case someone disputes our initial report
    preemptiveBondSize = 1

    initialStake = market.getParticipantStake()
    realBondSize = initialStake * 3
    assert market.contributeToTentative([0, market.getNumTicks(), 0], preemptiveBondSize, "")
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    # Now we'll dispute the initial report
    proceedToNextRound(localFixture, market)

    # We can see that the tentative winning outcome is the one suggested in the dispute still since not enouhg pre-emptive REP was placed to fill the bond
    assert market.getWinningReportingParticipant() != preemptiveDisputeCrowdsourcer.address
    assert market.getCrowdsourcer(preemptiveDisputeCrowdsourcer.getPayoutDistributionHash()) == preemptiveDisputeCrowdsourcer.address

def test_preemptive_crowdsourcer_after_initial(localFixture, universe, market, reputationToken):
    initialStake = market.getParticipantStake()
    # First we'll dispute the intial report
    proceedToNextRound(localFixture, market)

    # Now we'll place a large pre-emptive bond
    largeBond = initialStake * 50
    assert market.contributeToTentative([0, 0, market.getNumTicks()], largeBond, "")
    preemptiveDisputeCrowdsourcer = localFixture.applySignature('DisputeCrowdsourcer', market.preemptiveDisputeCrowdsourcer())

    # Now we'll dispute the dispute
    proceedToNextRound(localFixture, market)

    # By disputing we actually cause the preemptive bond to get placed.
    assert market.getParticipantStake() == largeBond + initialStake * 6

    # We'll dispute this newly placed bond made from the preemptive contributions
    proceedToNextRound(localFixture, market)

    # And now we'll do one more dispute in favor of the initial dispute
    proceedToNextRound(localFixture, market)

    # Now we finalize the market
    disputeWindow = localFixture.applySignature('DisputeWindow', market.getDisputeWindow())

    # Time marches on and the market can be finalized
    localFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Because the overloaded bond was disputed there is now sufficient REP to award the overload tokens with ROI as well
    with TokenDelta(reputationToken, largeBond * 1.4, localFixture.accounts[0], "Redeeming didn't refund REP"):
        assert preemptiveDisputeCrowdsourcer.redeem(localFixture.accounts[0])

@fixture(scope="session")
def localSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)

    universe = kitchenSinkSnapshot['universe']
    market = kitchenSinkSnapshot['yesNoMarket']
    categoricalMarket = kitchenSinkSnapshot['categoricalMarket']
    scalarMarket = kitchenSinkSnapshot['scalarMarket']

    # Skip to Designated Reporting
    fixture.contracts["Time"].setTimestamp(market.getEndTime() + 1)

    # Distribute REP
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
    for testAccount in [fixture.accounts[1], fixture.accounts[2], fixture.accounts[3]]:
        reputationToken.transfer(testAccount, 1 * 10**6 * 10**18)

    # Designated Report on the markets
    designatedReportCost = universe.getOrCacheDesignatedReportStake()
    with TokenDelta(reputationToken, 0, fixture.accounts[0], "Doing the designated report didn't deduct REP correctly or didn't award the no show bond"):
        market.doInitialReport([0, market.getNumTicks(), 0], "", 0)
        categoricalMarket.doInitialReport([0, categoricalMarket.getNumTicks(), 0, 0], "", 0)
        scalarMarket.doInitialReport([0, scalarMarket.getNumTicks(), 0], "", 0)

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
    return localFixture.applySignature(None, kitchenSinkSnapshot['universe'].address, kitchenSinkSnapshot['universe'].abi)

@fixture
def market(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['yesNoMarket'].address, kitchenSinkSnapshot['yesNoMarket'].abi)

@fixture
def categoricalMarket(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['categoricalMarket'].address, kitchenSinkSnapshot['categoricalMarket'].abi)

@fixture
def scalarMarket(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['scalarMarket'].address, kitchenSinkSnapshot['scalarMarket'].abi)

@fixture
def cash(localFixture, kitchenSinkSnapshot):
    return localFixture.applySignature(None, kitchenSinkSnapshot['cash'].address, kitchenSinkSnapshot['cash'].abi)

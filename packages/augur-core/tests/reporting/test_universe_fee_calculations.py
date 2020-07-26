from pytest import fixture, mark
from reporting_utils import proceedToInitialReporting, proceedToNextRound, proceedToDesignatedReporting
from utils import BuyWithCash, AssertLog
from decimal import Decimal

ONE = 10 ** 18

@mark.parametrize('numWithCondition, targetWithConditionPerHundred, previousAmount, expectedValue', [
    # No change
    (1, 1, ONE, ONE),
    (5, 5, ONE, ONE),
    (1, 1, 5 * ONE, 5 * ONE),

    # Maximum Decrease
    (0, 1, ONE, .9 * ONE),
    (0, 50, ONE, .9 * ONE),
    (0, 1, 10 * ONE, 9 * ONE),

    # Maximum Increase
    (100, 1, ONE, 2 * ONE),
    (100, 50, ONE, 2 * ONE),
    (100, 1, 10 * ONE, 20 * ONE),

    # Decrease
    (1, 10, 10 * ONE, 9.1 * ONE),
    (2, 10, 10 * ONE, 9200000000000000000), # Python rounding requires this be directly specified
    (4, 10, 10 * ONE, 9.4 * ONE),
    (8, 10, 10 * ONE, 9.8 * ONE),
    (9, 10, 10 * ONE, 9.9 * ONE),

    # Increase
    (51, 50, 10 * ONE, 10.2 * ONE),
    (55, 50, 10 * ONE, 11 * ONE),
    (60, 50, 10 * ONE, 12 * ONE),
    (80, 50, 10 * ONE, 16 * ONE),
    (90, 50, 10 * ONE, 18 * ONE),

    #Floor test
    (0, 1, ONE / 100, ONE / 100),
])
def test_floating_amount_calculation(numWithCondition, targetWithConditionPerHundred, previousAmount, expectedValue, contractsFixture):
    formulas = contractsFixture.contracts["Formulas"]
    targetDivisor = 100 / targetWithConditionPerHundred
    newAmount = formulas.calculateFloatingValue(numWithCondition, 100, targetDivisor, previousAmount, ONE / 100)
    assert newAmount == expectedValue

def test_reporter_fees(contractsFixture, universe, market, cash):
    defaultValue = 10000
    shareToken = contractsFixture.contracts['ShareToken']

    assert universe.getOrCacheReportingFeeDivisor() == defaultValue

    # Generate an enormous amount of OI
    assert universe.getOpenInterestInAttoCash() == 0
    cost = market.getNumTicks() * 10**30
    with BuyWithCash(cash, cost, contractsFixture.accounts[1], "buy complete set"):
        shareToken.publicBuyCompleteSets(market.address, 10**30, sender = contractsFixture.accounts[1])
    assert universe.getOpenInterestInAttoCash() > 0

    # Move dispute window forward
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    reportingFeeChangedLog = {
        "universe": universe.address,
    }
    with AssertLog(contractsFixture, "ReportingFeeChanged", reportingFeeChangedLog):
        assert universe.getOrCacheReportingFeeDivisor() < defaultValue

def test_validity_bond_up(contractsFixture, universe, market):
    initialValidityBond = universe.getOrCacheValidityBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will admit the market is invalid
    payoutNumerators = [1000, 0, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the validity bond is now doubled in the next dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    expectedValidityBond = initialValidityBond * 2
    validityBondChangedLog = {
        "universe": universe.address,
        "validityBond": expectedValidityBond,
    }
    with AssertLog(contractsFixture, "ValidityBondChanged", validityBondChangedLog):
        newValidityBond = universe.getOrCacheValidityBond()
    assert newValidityBond == expectedValidityBond

def test_validity_bond_min(contractsFixture, universe, market):
    initialValidityBond = universe.getOrCacheValidityBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will report the market had a normal resolution
    payoutNumerators = [0, 0, 1000]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the validity bond stayed the same since it is at the minimum value
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newValidityBond = universe.getOrCacheValidityBond()
    assert newValidityBond == initialValidityBond

def test_validity_bond_down(contractsFixture, universe, market, scalarMarket, cash):
    initialValidityBond = universe.getOrCacheValidityBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will admit the market is invalid
    payoutNumerators = [1000, 0, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Move time forward into the dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)

    # And then move time forward further and finalize the first market
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the validity bond is now doubled
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newValidityBond = universe.getOrCacheValidityBond()
    assert newValidityBond == initialValidityBond * 2

    # Move time forward to finalize the other market
    payoutNumerators = [0, 200000, 200000]
    assert scalarMarket.doInitialReport(payoutNumerators, "", 0)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', scalarMarket.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert scalarMarket.finalize()

    # The validity bond only decreases by 10%
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    finalValidityBond = universe.getOrCacheValidityBond()
    assert finalValidityBond == int(Decimal(newValidityBond) * 9 / 10)

def test_dr_report_stake_up(contractsFixture, universe, market):
    designatedReportStake = universe.getOrCacheDesignatedReportStake()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will report
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Proceed to the next round so we can dispute the DR
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)
    payoutNumerators = [0, 0, numTicks]
    chosenPayoutHash = market.derivePayoutDistributionHash(payoutNumerators)
    amount = 2 * market.getParticipantStake() - 3 * market.getStakeInOutcome(chosenPayoutHash)
    assert market.contribute(payoutNumerators, amount, "")

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond is now doubled in the next dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    expectedDesignatedReportStake = designatedReportStake * 2
    designatedReportStakeChangedLog = {
        "universe": universe.address,
        "designatedReportStake": expectedDesignatedReportStake,
    }
    with AssertLog(contractsFixture, "DesignatedReportStakeChanged", designatedReportStakeChangedLog):
        newDesignatedReportStake = universe.getOrCacheDesignatedReportStake()
    assert newDesignatedReportStake == expectedDesignatedReportStake

def test_dr_report_stake_min(contractsFixture, universe, market):
    designatedReportStake = universe.getOrCacheDesignatedReportStake()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will report
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond doesn't change since it is at the minimum value
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newDesignatedReportStake = universe.getOrCacheDesignatedReportStake()
    assert newDesignatedReportStake >= designatedReportStake

def test_dr_report_stake_down(contractsFixture, universe, market, categoricalMarket, cash):
    designatedReportStake = universe.getOrCacheDesignatedReportStake()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will report
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Proceed to the next round so we can dispute the DR
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getStartTime() + 1)
    payoutNumerators = [0, 0, numTicks]
    chosenPayoutHash = market.derivePayoutDistributionHash(payoutNumerators)
    amount = 2 * market.getParticipantStake() - 3 * market.getStakeInOutcome(chosenPayoutHash)
    assert market.contribute(payoutNumerators, amount, "")

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond is now doubled in the next dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newDesignatedReportStake = universe.getOrCacheDesignatedReportStake()
    assert newDesignatedReportStake == designatedReportStake * 2

    # Now we'll allow a window to pass with no markets and see the bond stay the same
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert universe.getOrCacheDesignatedReportStake() == newDesignatedReportStake

    # Now if there is another window with all correct we see the bond decrease
    # The DR will report
    numTicks = categoricalMarket.getNumTicks()
    payoutNumerators = [0, numTicks, 0, 0]
    assert categoricalMarket.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[0])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert categoricalMarket.finalize()

    expectedBond = int(Decimal(newDesignatedReportStake) * 9 / 10)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert universe.getOrCacheDesignatedReportStake() == expectedBond

def test_no_show_bond_up(contractsFixture, universe, market):
    noShowBond = universe.getOrCacheDesignatedReportNoShowBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will be absent and we'll do an initial report as another user
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond is now doubled in the next dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    expectedNoShowBond = noShowBond * 2
    noShowBondChangedLog = {
        "universe": universe.address,
        "noShowBond": expectedNoShowBond,
    }
    with AssertLog(contractsFixture, "NoShowBondChanged", noShowBondChangedLog):
        newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == expectedNoShowBond

def test_no_show_bond_min(contractsFixture, universe, market):
    noShowBond = universe.getOrCacheDesignatedReportNoShowBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will show up
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0)

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond does not reduce below the original value
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond >= noShowBond

def test_no_show_bond_down(contractsFixture, universe, market, categoricalMarket, cash):
    noShowBond = universe.getOrCacheDesignatedReportNoShowBond()

    # We'll have the markets go to initial reporting
    proceedToInitialReporting(contractsFixture, market)

    # The DR will be absent and we'll do an initial report as another user
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()

    # Confirm that the report stake bond is now doubled in the next dispute window
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == noShowBond * 2

    # If there is a dispute window with no markets we'll just see the bond remain the same
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert universe.getOrCacheDesignatedReportNoShowBond() == newNoShowBond

    # Now if there is another window with all shows we see the bond decrease
    # The DR will report
    numTicks = categoricalMarket.getNumTicks()
    payoutNumerators = [0, numTicks, 0, 0]
    assert categoricalMarket.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[0])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert categoricalMarket.finalize()

    expectedBond = int(Decimal(newNoShowBond) * 9 / 10)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', categoricalMarket.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert universe.getOrCacheDesignatedReportNoShowBond() == expectedBond

def test_market_rep_bond(contractsFixture, universe, market, cash):
    noShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    designatedReportStake = universe.getOrCacheDesignatedReportStake()

    assert universe.getOrCacheMarketRepBond() == max(noShowBond, designatedReportStake)

    # Increase the no show bond:
    numTicks = market.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    proceedToInitialReporting(contractsFixture, market)
    assert market.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market.finalize()
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == noShowBond * 2

    # The market REP bond is now equal to this higher bond:
    assert universe.getOrCacheMarketRepBond() == newNoShowBond

def test_bond_weight(contractsFixture, universe, cash):
    initialNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    currentTime = contractsFixture.contracts["Time"].getTimestamp()
    day = 24 * 60 * 60
    finalTime = currentTime + 60 * day

    # create first. ends at final time
    market1 = contractsFixture.createYesNoMarket(universe, finalTime, 10**16, 4, contractsFixture.accounts[0])

    # create second and end as no show
    market2EndTime = contractsFixture.contracts["Time"].getTimestamp() + 1
    market2 = contractsFixture.createYesNoMarket(universe, market2EndTime, 10**16, 4, contractsFixture.accounts[0])
    proceedToInitialReporting(contractsFixture, market2)

    # The DR will be absent and we'll do an initial report as another user
    numTicks = market2.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market2.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market2.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market2.finalize()
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == initialNoShowBond * 2

    # create third. ends at final time
    market3 = contractsFixture.createYesNoMarket(universe, finalTime, 10**16, 4, contractsFixture.accounts[0])

    # create fourth and end as no show
    market4EndTime = contractsFixture.contracts["Time"].getTimestamp() + 1
    market4 = contractsFixture.createYesNoMarket(universe, market4EndTime, 10**16, 4, contractsFixture.accounts[0])
    proceedToInitialReporting(contractsFixture, market4)

    # The DR will be absent and we'll do an initial report as another user
    numTicks = market4.getNumTicks()
    payoutNumerators = [0, numTicks, 0]
    assert market4.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])

    # Move time forward to finalize the market
    disputeWindow = contractsFixture.applySignature('DisputeWindow', market4.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market4.finalize()
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == initialNoShowBond * 4

    # create fifth.
    market5 = contractsFixture.createYesNoMarket(universe, finalTime, 10**16, 4, contractsFixture.accounts[0])

    # move to final time and finalize market 1, 3, and 5 with 1 as no show, 3 as no show, and 5 as show
    contractsFixture.contracts["Time"].setTimestamp(finalTime + 2 * day)
    assert market1.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])
    assert market3.doInitialReport(payoutNumerators, "", 0, sender=contractsFixture.accounts[1])
    assert market5.doInitialReport(payoutNumerators, "", 0)

    disputeWindow = contractsFixture.applySignature('DisputeWindow', market5.getDisputeWindow())
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)
    assert market1.finalize()
    assert market3.finalize()
    assert market5.finalize()

    # bond should move with 1/3 bad as input to floating formula
    disputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreateCurrentDisputeWindow(False))
    contractsFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

    previousDisputeWindow = contractsFixture.applySignature('DisputeWindow', universe.getOrCreatePreviousPreviousDisputeWindow(False))
    totalNoShowBondsInPreviousWindow = previousDisputeWindow.designatedReporterNoShowBondTotal()
    designatedReportNoShowBondsInPreviousWindow = previousDisputeWindow.designatedReportNoShowsTotal()

    formulas = contractsFixture.contracts["Formulas"]

    oldNoShowBond = newNoShowBond
    newNoShowBond = universe.getOrCacheDesignatedReportNoShowBond()
    assert newNoShowBond == formulas.calculateFloatingValue(1, 3, 20, oldNoShowBond, 0)

@fixture(scope="session")
def reportingSnapshot(fixture, kitchenSinkSnapshot):
    fixture.resetToSnapshot(kitchenSinkSnapshot)
    # Give some REP to testers to make things interesting
    universe = ABIContract(fixture.chain, kitchenSinkSnapshot['universe'].translator, kitchenSinkSnapshot['universe'].address)
    reputationToken = fixture.applySignature('ReputationToken', universe.getReputationToken())
    for testAccount in [contractsFixture.accounts[1], contractsFixture.accounts[2], contractsFixture.accounts[3]]:
        reputationToken.transfer(testAccount, 1 * 10**6 * 10**18)

    return fixture.createSnapshot()

@fixture
def reportingFixture(fixture, reportingSnapshot):
    fixture.resetToSnapshot(reportingSnapshot)
    return fixture

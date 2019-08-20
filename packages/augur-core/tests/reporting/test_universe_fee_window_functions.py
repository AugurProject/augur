from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises
from utils import nullAddress

def test_dispute_window_functions(kitchenSinkFixture, universe):
    disputeWindowBuffferSeconds = kitchenSinkFixture.contracts["Constants"].DISPUTE_WINDOW_BUFFER_SECONDS()
    # We have many getters and getOrCreate method on the universe for retreiving and creating dispute windows. We'll confirm first that all the getters simply return 0 when the requested window does not yet exist
    assert universe.getDisputeWindowByTimestamp(disputeWindowBuffferSeconds, False) == nullAddress

    # Now lets use the getOrCreate variants to actually generate these windows
    assert universe.getOrCreateDisputeWindowByTimestamp(disputeWindowBuffferSeconds, False) != nullAddress
    assert universe.getOrCreatePreviousDisputeWindow(False) != nullAddress
    assert universe.getOrCreateCurrentDisputeWindow(False) != nullAddress
    assert universe.getOrCreateNextDisputeWindow(False) != nullAddress

    # And now confirm the getters return the correct windows
    assert universe.getDisputeWindowByTimestamp(disputeWindowBuffferSeconds, False) != nullAddress
    assert universe.getOrCreateCurrentDisputeWindow(False) != nullAddress
    assert universe.getOrCreateNextDisputeWindow(False) != nullAddress

def test_dispute_window_cadence(kitchenSinkFixture, universe):
    constants = kitchenSinkFixture.contracts["Constants"]
    disputeWindowBuffferSeconds = constants.DISPUTE_WINDOW_BUFFER_SECONDS()
    normalReportingDuration = constants.DISPUTE_ROUND_DURATION_SECONDS()
    initialReportingDuration = constants.INITIAL_DISPUTE_ROUND_DURATION_SECONDS()

    # Dispute window cadence time starts a buffer after epoch time. Requesting time before this will fail
    with raises(TransactionFailed):
        universe.getOrCreateDisputeWindowByTimestamp(0, False)

    # The first window is associated with the time right after the buffer
    window0Address = universe.getOrCreateDisputeWindowByTimestamp(disputeWindowBuffferSeconds, False)
    window0 = kitchenSinkFixture.applySignature("DisputeWindow", window0Address)
    assert window0.getStartTime() == disputeWindowBuffferSeconds
    assert window0.getEndTime() == disputeWindowBuffferSeconds + normalReportingDuration

    # The same logic applies to the initial reporting first window but with the reduced time duration
    initialWindow0Address = universe.getOrCreateDisputeWindowByTimestamp(disputeWindowBuffferSeconds, True)
    initialWindow0 = kitchenSinkFixture.applySignature("DisputeWindow", initialWindow0Address)
    assert initialWindow0.getStartTime() == disputeWindowBuffferSeconds
    assert initialWindow0.getEndTime() == disputeWindowBuffferSeconds + initialReportingDuration

    # We can see the same for proceeding windows
    window1Address = universe.getOrCreateDisputeWindowByTimestamp(normalReportingDuration + disputeWindowBuffferSeconds + 42, False)
    window1 = kitchenSinkFixture.applySignature("DisputeWindow", window1Address)
    assert window1.getStartTime() == normalReportingDuration + disputeWindowBuffferSeconds
    assert window1.getEndTime() == normalReportingDuration + disputeWindowBuffferSeconds + normalReportingDuration

def test_market_creation_fee(kitchenSinkFixture, universe):
    # Calling the normal function which creates these windows if they do not exist should return correctly
    marketCreationCost = universe.getOrCacheValidityBond()
    assert marketCreationCost > 0

def test_validity_bond(kitchenSinkFixture, universe):
    # Calling the normal function which creates these windows if they do not exist should return correctly
    bond = universe.getOrCacheValidityBond()
    assert bond > 0

def test_designated_report_stake(kitchenSinkFixture, universe):
    # Calling the normal function which creates these windows if they do not exist should return correctly
    stake = universe.getOrCacheDesignatedReportStake()
    assert stake > 0

    assert universe.getOrCacheMarketRepBond() == stake

def test_designated_report_no_show_bond(kitchenSinkFixture, universe):
    # Calling the normal function which creates these windows if they do not exist should return correctly
    bond = universe.getOrCacheDesignatedReportNoShowBond()
    assert bond > 0

def test_reporting_fee_divisor(kitchenSinkFixture, universe):
    # Calling the normal function which creates these windows if they do not exist should return correctly
    feeDivisor = universe.getOrCacheReportingFeeDivisor()
    assert feeDivisor > 0

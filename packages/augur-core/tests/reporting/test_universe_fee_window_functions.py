from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises
from utils import nullAddress

def test_reporting_window_functions(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # We have many getters and getOrCreate method on the universe for retreiving and creating dispute windows. We'll confirm first that all the getters simply return 0 when the requested window does not yet exist
    assert universe.getDisputeWindowByTimestamp(0, False) == nullAddress
    assert universe.getPreviousDisputeWindow(False) == nullAddress
    assert universe.getCurrentDisputeWindow(False) == nullAddress
    assert universe.getNextDisputeWindow(False) == nullAddress

    # Now lets use the getOrCreate variants to actually generate these windows
    assert universe.getOrCreateDisputeWindowByTimestamp(0, False) != nullAddress
    assert universe.getOrCreatePreviousDisputeWindow(False) != nullAddress
    assert universe.getOrCreateCurrentDisputeWindow(False) != nullAddress
    assert universe.getOrCreateNextDisputeWindow(False) != nullAddress

    # And now confirm the getters return the correct windows
    assert universe.getDisputeWindowByTimestamp(0, False) != nullAddress
    assert universe.getPreviousDisputeWindow(False) != nullAddress
    assert universe.getCurrentDisputeWindow(False) != nullAddress
    assert universe.getNextDisputeWindow(False) != nullAddress

def test_market_creation_fee(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # Calling the normal function which creates these windows if they do not exist should return correctly
    marketCreationCost = universe.getOrCacheMarketCreationCost()
    assert marketCreationCost > 0

def test_validity_bond(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # Calling the normal function which creates these windows if they do not exist should return correctly
    bond = universe.getOrCacheValidityBond()
    assert bond > 0

def test_designated_report_stake(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # Calling the normal function which creates these windows if they do not exist should return correctly
    stake = universe.getOrCacheDesignatedReportStake()
    assert stake > 0

    assert universe.getInitialReportStakeSize() == stake

def test_designated_report_no_show_bond(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # Calling the normal function which creates these windows if they do not exist should return correctly
    bond = universe.getOrCacheDesignatedReportNoShowBond()
    assert bond > 0

def test_reporting_fee_divisor(kitchenSinkFixture):
    universe = kitchenSinkFixture.createUniverse()

    # Calling the normal function which creates these windows if they do not exist should return correctly
    feeDivisor = universe.getOrCacheReportingFeeDivisor()
    assert feeDivisor > 0

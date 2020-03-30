from eth_tester.exceptions import TransactionFailed
from pytest import fixture, raises, mark
from utils import longToHexString, EtherDelta, TokenDelta, PrintGasUsed
from reporting_utils import proceedToNextRound, proceedToFork, finalize

def test_periodicals(kitchenSinkFixture, market, universe, cash, reputationToken):
    shareToken = kitchenSinkFixture.contracts['ShareToken']
    repOracle = kitchenSinkFixture.contracts["RepOracle"]

    # Move time forward
    day = 24 * 60 * 60
    timeTravel(kitchenSinkFixture, day)

    # Sweep interest
    lastSweep = universe.lastSweep()
    assert universe.runPeriodicals()
    assert universe.lastSweep() > lastSweep

    # Now that interest has swept the next call will poke the rep oracle
    lastOraclePoke = repOracle.getLastUpdateTimestamp(reputationToken.address)
    assert universe.runPeriodicals()
    assert repOracle.getLastUpdateTimestamp(reputationToken.address) > lastOraclePoke

    # The next call will no-op as we have both swept interest and poke the oracle recently
    lastOraclePoke = repOracle.getLastUpdateTimestamp(reputationToken.address)
    lastSweep = universe.lastSweep()
    assert universe.runPeriodicals()
    assert universe.lastSweep() == lastSweep
    assert repOracle.getLastUpdateTimestamp(reputationToken.address) == lastOraclePoke

    # Move time forward
    timeTravel(kitchenSinkFixture, day)

    # Sweep interest
    lastSweep = universe.lastSweep()
    assert universe.runPeriodicals()
    assert universe.lastSweep() > lastSweep

    # Now that interest has swept the next call will poke the rep oracle
    lastOraclePoke = repOracle.getLastUpdateTimestamp(reputationToken.address)
    assert universe.runPeriodicals()
    assert repOracle.getLastUpdateTimestamp(reputationToken.address) > lastOraclePoke

    # The next call will no-op as we have both swept interest and poke the oracle recently
    lastOraclePoke = repOracle.getLastUpdateTimestamp(reputationToken.address)
    lastSweep = universe.lastSweep()
    assert universe.runPeriodicals()
    assert universe.lastSweep() == lastSweep
    assert repOracle.getLastUpdateTimestamp(reputationToken.address) == lastOraclePoke

def timeTravel(contractsFixture, timePassed):
    timestamp = contractsFixture.eth_tester.backend.chain.header.timestamp
    contractsFixture.eth_tester.time_travel(int(timestamp + timePassed))

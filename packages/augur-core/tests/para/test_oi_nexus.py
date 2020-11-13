
from eth_tester.exceptions import TransactionFailed
from utils import captureFilteredLogs, AssertLog, nullAddress, TokenDelta
from pytest import raises, mark

pytestmark = mark.skip(reason="Hack no longer viable without further hacks. To test manually remove the 'onlyOwner' modifier from the OINexus:addParaAugur function and run with --paraAugur")

def test_oi_nexus(contractsFixture, universe):
    if not contractsFixture.paraAugur:
        return

    nexus = contractsFixture.contracts["OINexus"]

    account = contractsFixture.accounts[0]
    universeAddress = universe.address
    paraUniverse1 = contractsFixture.accounts[1]
    paraUniverse2 = contractsFixture.accounts[2]
    paraUniverse3 = contractsFixture.accounts[3]

    # We'll do a hack to unit test the contract and make ourselves an ParaAugur instance
    nexus.addParaAugur(account)

    # Now we'll add a universe and a "paraUniverse" which will just be an account key so that we can send from it to do updates
    nexus.registerParaUniverse(universeAddress, paraUniverse1)

    # Lets provide some test data and get / store a new reporting fee. In this paraUniverse lets say we're at exactly the target OI. This will give us the default reporting fee back
    targetRepMarketCapInAttoCash = 100
    repMarketCapInAttoCash = 100
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 10000

    # We can provide a new ratio to update accordingly. If the target is 10x the mcap we should see the divisor go to 1000
    targetRepMarketCapInAttoCash = 1000
    repMarketCapInAttoCash = 100
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 1000

    # If the target is 1/10 the mcap we should see it go back to 10000
    targetRepMarketCapInAttoCash = 100
    repMarketCapInAttoCash = 1000
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 10000

    # Now lets add another paraUniverse
    nexus.registerParaUniverse(universe.address, paraUniverse2)

    # We can modify the reporting feeDivisor accordingly with this new universe. Here the denom of this universe is implied to be 10x that of paraUniverse 1. That means that the OI from this universe is also 10x that of the other. This gives us a total OI in the current universe of 1.1x desired which means the divisor should increase (the fee gets higher)
    # market cap = 100. target MCAP = 110 = .909 * previous fee == 9090
    targetRepMarketCapInAttoCash = 100
    repMarketCapInAttoCash = 100
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse2)
    assert reportingFee == 9090

    # If we update the first universe again it will adjust accordingly.
    # market cap = 100. target MCAP = 120 = .833 * previous fee == 7575
    targetRepMarketCapInAttoCash = 200
    repMarketCapInAttoCash = 1000
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 7575

    # Lets throw a third universe into the mix now with a denom that is worth more than universe 2 by a factor of 10
    nexus.registerParaUniverse(universe.address, paraUniverse3)

    # market cap = 100. target MCAP = 170 = .588 * previous fee == 7575
    targetRepMarketCapInAttoCash = 5
    repMarketCapInAttoCash = 10
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse3)
    assert reportingFee == 4455

def test_oi_nexus_core_influence(contractsFixture, universe, cash):
    if not contractsFixture.paraAugur:
        return

    nexus = contractsFixture.contracts["OINexus"]
    openInterestCashAddress = universe.openInterestCash()
    openInterestCash = contractsFixture.applySignature("OICash", openInterestCashAddress)

    account = contractsFixture.accounts[0]
    universeAddress = universe.address
    paraUniverse1 = contractsFixture.accounts[1]

    # We'll do a hack to unit test the contract and make ourselves a ParaAugur instance
    nexus.addParaAugur(account)

    # Now we'll add a universe and a "paraUniverse" which will just be an account key so that we can send from it to do updates
    nexus.registerParaUniverse(universeAddress, paraUniverse1)

    # In this test we're accounting for the "core universe" so we'll need to use some more realistic values. We'll get the total rep market cap in the core universe first to base our numbers off of
    coreRepMarketCapInAttoCash = universe.pokeRepMarketCapInAttoCash()

    # Lets add enough OI that we're at exactly the target
    desiredOI = coreRepMarketCapInAttoCash / 5
    coreCashAddress = universe.cash()
    coreCash = contractsFixture.applySignature("Cash", coreCashAddress)
    assert coreCash.faucet(desiredOI)
    assert openInterestCash.deposit(desiredOI)
    coreTargetRepMarketCapInAttoCash = universe.getTargetRepMarketCapInAttoCash()
    assert roughlyEqual(coreTargetRepMarketCapInAttoCash, coreRepMarketCapInAttoCash)

    # Lets provide some test data and get / store a new reporting fee. In this paraUniverse lets say we're at exactly the target OI. This will set the total MCAP to be double the desired OI and thus decrease the divisor by half
    targetRepMarketCapInAttoCash = coreTargetRepMarketCapInAttoCash * 10
    repMarketCapInAttoCash = coreRepMarketCapInAttoCash * 10
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 4999

    # We can provide a new ratio to update accordingly. If the target is 4x the mcap we will see the disivor decrease by 4/5 as the total OI is now 5x target
    targetRepMarketCapInAttoCash = coreTargetRepMarketCapInAttoCash * 40
    repMarketCapInAttoCash = coreRepMarketCapInAttoCash * 10
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 999

    # Lets increase the core universe OI such that the total OI is 10x the target and see the divisor decrease accordingly
    assert coreCash.faucet(desiredOI * 5)
    assert openInterestCash.deposit(desiredOI * 5)
    reportingFee = nexus.recordParaUniverseValuesAndUpdateReportingFee(universeAddress, targetRepMarketCapInAttoCash, repMarketCapInAttoCash, sender=paraUniverse1)
    assert reportingFee == 99


def roughlyEqual(amount1, amount2, tolerance=10**12):
    return abs(amount1 - amount2) < tolerance
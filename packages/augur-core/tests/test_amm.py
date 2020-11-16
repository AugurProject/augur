#!/usr/bin/env python

from math import ceil

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark, skip
from utils import nullAddress


FEE = 3 # 3/1000
ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2


@fixture
def factory(sessionFixture):
    return sessionFixture.contracts['AMMFactory']

@fixture
def amm(sessionFixture, factory, market, shareToken):
    ammAddress = factory.addAMM(market.address, shareToken.address, FEE)
    return sessionFixture.applySignature("AMMExchange", ammAddress)

@fixture
def account0(sessionFixture):
    return sessionFixture.accounts[0]

def test_amm_calc_addr(contractsFixture, factory, cash, shareToken, market):
    address = factory.calculateAMMAddress(market.address, shareToken.address, FEE)
    assert address != nullAddress

def test_amm_add_with_liquidity(contractsFixture, market, cash, shareToken, factory, account0):
    setsToBuy = 10 * ATTO
    keepYes = True
    ratioFactor = 10**18

    cost = setsToBuy * 10000
    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, ratioFactor, keepYes)


def test_amm_add_with_liquidity2(contractsFixture, market, cash, shareToken, factory, account0):
    cost = 10**18
    keepYes = False
    ratioFactor = 10**18

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, ratioFactor, keepYes)

def test_amm_initial_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = sets * 1000

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    amm.addInitialLiquidity(cost, 10**18, True, account0)

    # all cash was used to buy complete sets
    assert cash.balanceOf(account0) == 0
    assert cash.balanceOf(amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 100 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets

    assert amm.balanceOf(account0) > 0

    removedSets = 10 * ATTO
    remainingSets = sets - removedSets
    amm.removeLiquidity(removedSets, 0)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears

    # user receives 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == removedSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == removedSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == removedSets
    # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == remainingSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == remainingSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == remainingSets

def test_amm_subsequent_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.approve(factory.address, 10 ** 48)

    initialSets = 100 * ATTO
    initialCost = initialSets * 1000
    cash.faucet(initialCost)
    amm.addInitialLiquidity(initialCost, 10**18, True, account0)

    subsequentSets = 100 * ATTO
    subsequentCost = subsequentSets * 1000
    cash.faucet(subsequentCost)
    amm.addLiquidity(subsequentCost, account0)

    totalSets = initialSets + subsequentSets

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears

    # user receives no shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    # AMM has initial and subsequent liquidity shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == totalSets

    # Now test adding liquidity after entering position

    cost = 1000 * 10 * ATTO
    sharesReceived = amm.rateEnterPosition(cost, True)
    cash.faucet(cost)
    amm.enterPosition(cost, True, sharesReceived)

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    cash.faucet(finalCost)
    lpTokens = amm.addLiquidity(finalCost, account0)
    assert lpTokens > 0


def test_amm_60_40_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = sets * 1000

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    yesPercent = 0.4
    noPercent = 1 - yesPercent
    ratio = 10**18 * yesPercent / noPercent
    yesShares = 66666666666666675200 # approximately 2/3 aka 60%
    keptYesShares = sets - yesShares

    lpTokens = amm.addInitialLiquidity(cost, ratio, True, account0)

    assert lpTokens == 81649658092772608498 # skewed ratio means fewer shares which means fewer LP tokens

    # all cash was used to buy complete sets
    assert cash.balanceOf(account0) == 0
    assert cash.balanceOf(amm.address) == 0
    # user did not get any shares themselves: they go to the AMM
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == keptYesShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    # AMM has 60 Yes shares and 40 No shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == yesShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets

    assert amm.balanceOf(account0) > 0

    removedLPTokens = 8164965809277260850 # remove 1/10th of liquidity (rounded up)
    recoveredInvalidShares = sets // 10
    recoveredNoShares = sets // 10
    recoveredYesShares = yesShares // 10
    remainingInvalidShares = sets - recoveredInvalidShares
    remainingNoShares = sets - recoveredNoShares
    remainingYesShares = yesShares - recoveredYesShares
    amm.removeLiquidity(removedLPTokens, 0)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears

    # user receives 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == recoveredInvalidShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == recoveredNoShares
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == recoveredYesShares + keptYesShares
    # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == remainingInvalidShares
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == remainingNoShares
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == remainingYesShares

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    cash.faucet(finalCost)
    lpTokens = amm.addLiquidity(finalCost, account0)
    assert lpTokens > 0

def test_amm_yes_position(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.faucet(100000 * ATTO)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(amm.address, True)
    amm.addInitialLiquidity(100000 * ATTO, 10**18, True, account0)

    cost = 10000 * ATTO
    sets = cost // market.getNumTicks()

    # Enter position
    sharesReceived = amm.rateEnterPosition(cost, True)
    assert sharesReceived > 10 * ATTO
    cash.faucet(cost)
    amm.enterPosition(cost, True, sharesReceived)

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == sharesReceived

    (payoutAll, inv, no, yes) = amm.rateExitAll()
    assert inv == sets
    assert no == -10135101402160364982
    assert yes == 19107898597839635018
    applyFeeForEntryAndExit = (cost * (1000 - FEE) // 1000)
    assert payoutAll == applyFeeForEntryAndExit

    shareToken.setApprovalForAll(factory.address, True)

    amm.exitAll(payoutAll)

    assert cash.balanceOf(account0) == payoutAll

def test_amm_no_position(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.faucet(100000 * ATTO)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(amm.address, True)
    amm.addInitialLiquidity(100000 * ATTO, 10**18, True, account0)

    cost = 10000 * ATTO
    sets = cost // market.getNumTicks()

    # Enter NO position
    sharesReceived = amm.rateEnterPosition(cost, False)
    assert sharesReceived > 10 * ATTO
    cash.faucet(cost)
    amm.enterPosition(cost, False, sharesReceived)

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == sharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0

def test_amm_swap(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.faucet(100000 * ATTO)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(amm.address, True)
    amm.addInitialLiquidity(100000 * ATTO, 10**18, True, account0)

    cost = 10000 * ATTO
    sets = cost // market.getNumTicks()

    yesShares = amm.rateEnterPosition(cost, True)
    cash.faucet(cost)
    amm.enterPosition(cost, True, yesShares)

    noSharesReceived = amm.rateSwap(1 * ATTO, True) # trade away 1 Yes share

    # Entered Yes position earlier, which spent Cash for Yes shares, raising their value and therefore lowering the value of No shares.
    # Then sold 1e18 Yes shares for No shares, which are worth less than Yes shares.
    assert noSharesReceived == 1519467446212556723

    amm.swap(1 * ATTO, True, noSharesReceived)

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == noSharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares - ATTO # spent one Yes share to buy some No shares

def test_amm_fees(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cost = 100000 * ATTO
    sets = cost // market.getNumTicks()
    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(amm.address, True)

    lpTokens = amm.rateAddLiquidity(sets, sets)
    assert lpTokens == amm.addInitialLiquidity(cost, 10**18, True, account0)
    assert lpTokens == sets

    addedCash = 10000 * ATTO
    invalidFromPosition = addedCash // market.getNumTicks()
    cash.faucet(addedCash)
    yesShares = amm.rateEnterPosition(addedCash, True)
    amm.enterPosition(addedCash, True, yesShares)

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == invalidFromPosition
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares

    (invalidRemoved, noRemoved, yesRemoved, cashRemoved) = amm.removeLiquidity(lpTokens, 0)
    assert invalidRemoved == sets - invalidFromPosition
    assert noRemoved == sets
    assert yesRemoved == sets - yesShares
    assert cashRemoved == addedCash

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 0
    assert cash.balanceOf(amm.address) == 0

# TODO: Figure out if the returns are correct when selling LP tokens minted _after_ fees were generated.
#       Right now it looks incorrect but it's possible (likely even) that the combined value of returned shares+cash are equal to the value put in when adding liquidity.
#       I tried adding cash to the average of the shares. It ended up with ~10.07 avg shares and ~1003 cash.
#           Need to calculate the actual value of the shares, not just their average quantities.
@mark.skip("TODO")
def test_amm_lp_fee_lp_withdraw(contractsFixture, market, shareToken, cash, factory, amm):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cost = 100000 * ATTO
    sets = cost // market.getNumTicks()
    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(amm.address, True)
    lpTokens = amm.addInitialLiquidity(cost, 10**18, True, account0)

    addedCash = 10000 * ATTO
    invalidFromPosition = addedCash // market.getNumTicks()
    cash.faucet(addedCash)
    yesShares = amm.rateEnterPosition(addedCash, True)
    amm.enterPosition(addedCash, True, yesShares)

    moreSets = 10 * ATTO
    moreCost = moreSets * market.getNumTicks()
    cash.faucet(moreCost)
    moreLPTokens = amm.addLiquidity(moreSets)
    # TODO sell sets when removing liquidity OR perform a rateExitAll (or just exitAll) and compare
    (invalidRemoved, noRemoved, yesRemoved, cashRemoved) = amm.removeLiquidity(moreLPTokens, 0)

    print(moreSets)
    print(invalidRemoved)
    print(noRemoved)
    print(yesRemoved)
    print(cashRemoved)

    # These LP tokens should not have generated any fees because no trading occurred after they were minted.
    # assert invalidRemoved == moreSets
    # assert noRemoved == moreSets
    # assert yesRemoved == moreSets
    # assert cashRemoved == 0

    # TODO need to calculate this by value, not totals, because individual values can differ.
    # Now remove the rest of the LP tokens. The ones that are owed fees.
    (invalidRemoved, noRemoved, yesRemoved, cashRemoved) = amm.removeLiquidity(lpTokens, 0)
    assert invalidRemoved == sets - invalidFromPosition
    assert noRemoved == sets
    assert yesRemoved == sets - yesShares
    assert cashRemoved == addedCash

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 0
    assert cash.balanceOf(amm.address) == 0


# TODO tests
# 1. Two users add and remove liquidity, without trading occuring.
# 2. Two users add liquidity, then other users trade, then the users remove liquidity.
#    The worry is that our reward function doesn't work quite right so users won't get back what they put in.
# 3. User adds liqudity. Then there's trading. Then another user adds liquidity. They should get the right number of LP tokens.
#    And when the users remove liquidity, they get the number of shares and cash that makes sense.
# 4. Users swap and enter and exit positions.
# 5. The sqrt functions for safemath int and uint work as expected. Alex wrote them but there just aren't any tests yet.
# 6. Verify specific enterPosition costs.

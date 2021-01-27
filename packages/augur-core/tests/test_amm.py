#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from tests.reporting_utils import proceedToInitialReporting
from pytest import raises, fixture, mark, skip
from utils import nullAddress, stringToBytes

def calc_ratio(yesPercent):
    noPercent = 1 - yesPercent
    return 10**18 * yesPercent / noPercent


FEE = 10 # 10/1000 aka 1%
ATTO = 10 ** 18
INVALID = 0
NO = 1
YES = 2
RATIO_50_50 = calc_ratio(0.5)
RATIO_60_40 = calc_ratio(0.4)


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

@fixture
def account1(sessionFixture):
    return sessionFixture.accounts[1]

def test_amm_calc_addr(contractsFixture, factory, shareToken, market):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    address = factory.calculateAMMAddress(market.address, shareToken.address, FEE)
    assert address != nullAddress

def test_amm_add_with_liquidity(contractsFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    setsToBuy = 10 * ATTO
    keepYes = True

    cost = setsToBuy * 10000
    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, RATIO_50_50, keepYes, account0)
    amm = contractsFixture.applySignature("AMMExchange", ammAddress[0])

    addLiquidityEvent = amm.getLogs('AddLiquidity')
    assert addLiquidityEvent[0].args.sender == account0

    assert ammAddress != nullAddress

def test_amm_add_with_liquidity2(contractsFixture, market, cash, shareToken, factory, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cost = 10**18
    keepYes = False

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    ammAddress = factory.addAMMWithLiquidity(market.address, shareToken.address, FEE, cost, RATIO_50_50, keepYes, account0)
    assert ammAddress != nullAddress

def test_amm_initial_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = sets * 1000

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    lpTokens = amm.addInitialLiquidity(cost, 10**18, True, account0)

    addLiquidityEvent = amm.getLogs('AddLiquidity')
    assert addLiquidityEvent[0].args.sender == account0

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

    assert amm.balanceOf(account0) == sets # liquidity provider tokens should match the sets minted, when no fees in 50:50
    assert lpTokens == sets # returned LP tokens should match actual LP tokens

    removedLPTokens = lpTokens // 10
    amm.removeLiquidity(removedLPTokens)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears
    assert amm.balanceOf(account0) == lpTokens - removedLPTokens
    # user receives 10 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sets * 0.1
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == sets * 0.1
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == sets * 0.1
    # AMM still has 90 of each share
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets * 0.9
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets * 0.9
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets * 0.9

def test_amm_subsequent_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0):
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
    assert amm.balanceOf(account0) == totalSets  # LP tokens

    # user receives no shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0
    # AMM has initial and subsequent liquidity shares
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == totalSets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == totalSets

    # Now enter a position, causing fees to be collected and therefore the value of an LP token to rise

    cost = 1000 * 10 * ATTO
    sharesReceived = amm.rateEnterPosition(cost, True)
    cash.faucet(cost)
    amm.enterPosition(cost, True, sharesReceived)

    # Now test adding liquidity after entering position

    finalSets = 100 * ATTO
    finalCost = finalSets * 1000
    cash.faucet(finalCost)
    lpTokens = amm.addLiquidity(finalCost, account0)
    assert lpTokens == 94996448049187125706 # less than finalSets due to captured fees raising the value of an LP token

def test_amm_60_40_liquidity(contractsFixture, market, cash, shareToken, factory, amm, account0, kitchenSinkSnapshot):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    sets = 100 * ATTO
    cost = sets * 1000

    cash.faucet(cost)
    cash.approve(factory.address, 10 ** 48)

    yesShares = 66666666666666675200 # approximately 2/3 aka 60%
    keptYesShares = sets - yesShares

    lpTokens = amm.addInitialLiquidity(cost, RATIO_60_40, True, account0)

    assert lpTokens == 80000000000000006143 # skewed ratio means fewer shares which means fewer LP tokens
    assert amm.balanceOf(account0) == lpTokens

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

    removedLPTokens = 8000000000000000615 # remove 1/10th of liquidity (rounded up)
    recoveredInvalidShares = sets // 10
    recoveredNoShares = sets // 10
    recoveredYesShares = yesShares // 10
    remainingInvalidShares = sets - recoveredInvalidShares
    remainingNoShares = sets - recoveredNoShares
    remainingYesShares = yesShares - recoveredYesShares
    amm.removeLiquidity(removedLPTokens)

    assert cash.balanceOf(account0) == 0  # user did not receive cash, just shares
    assert cash.balanceOf(amm.address) == 0  # shares are just passed along to user; no cash suddenly appears
    assert amm.balanceOf(account0) == lpTokens - removedLPTokens  # LP tokens

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
    assert lpTokens == 80000000000000006141 # 2 atto off from initial, probably due to rounding

def test_amm_yes_position(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    liquidityCost = sets * numticks

    cash.faucet(liquidityCost)
    cash.approve(factory.address, 10 ** 48)

    amm.addInitialLiquidity(liquidityCost, RATIO_50_50, True, account0)

    yesPositionSets = 10 * ATTO
    yesPositionCost = yesPositionSets * numticks

    # Enter position
    sharesReceived = amm.rateEnterPosition(yesPositionCost, True)
    assert sharesReceived > yesPositionSets
    assert sharesReceived < 2 * yesPositionSets
    cash.faucet(yesPositionCost)
    amm.enterPosition(yesPositionCost, True, sharesReceived)

    assert cash.balanceOf(account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == sharesReceived

    assert cash.balanceOf(amm.address) == yesPositionCost
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == sets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == sets - sharesReceived

    # Exiting requires you to send shares.
    shareToken.setApprovalForAll(amm.address, True)

    payoutAll = amm.rateExitAll()
    assert payoutAll == 9795561209096775126300

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
    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == sharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == sharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == 0

def test_amm_swap(contractsFixture, market, shareToken, cash, factory, amm, account0):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    cash.faucet(100000 * ATTO)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(factory.address, True)
    amm.addInitialLiquidity(100000 * ATTO, 10**18, True, account0)

    cost = 10000 * ATTO
    sets = cost // market.getNumTicks()

    yesShares = amm.rateEnterPosition(cost, True)
    cash.faucet(cost)
    amm.enterPosition(cost, True, yesShares)

    noSharesReceived = amm.rateSwap(1 * ATTO, True) # trade away 1 Yes share

    # Entered Yes position earlier, which spent Cash for Yes shares, raising their value and therefore lowering the value of No shares.
    # Then sold 1e18 Yes shares for No shares, which are worth less than Yes shares.
    assert noSharesReceived == 1204526098065458085

    amm.swap(1 * ATTO, True, noSharesReceived)

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == noSharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == noSharesReceived
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares - ATTO # spent one Yes share to buy some No shares

def test_amm_fees_work(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    fee = 3 # 3/1000 aka 0.3%
    ammAddress = factory.addAMM(market.address, shareToken.address, fee)
    amm = sessionFixture.applySignature("AMMExchange", ammAddress)

    liquiditySets = 100 * ATTO
    liquidityCash = liquiditySets * market.getNumTicks()
    cash.faucet(liquidityCash)
    cash.approve(factory.address, 10 ** 48)
    shareToken.setApprovalForAll(factory.address, True)

    liquidityRatio = 10**18 # 50:50
    lpTokens = amm.rateAddLiquidity(liquiditySets, liquiditySets)
    assert lpTokens == liquiditySets
    assert lpTokens == amm.addInitialLiquidity(liquidityCash, liquidityRatio, True, account0)

    tradeCash = 10000 * ATTO
    cash.faucet(tradeCash)
    yesShares = amm.rateEnterPosition(tradeCash, True)
    amm.enterPosition(tradeCash, True, yesShares)
    assert yesShares == 18943000000000000000

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == yesShares
    assert cash.balanceOf(account0) == 0

    # Now remove liquidity and verify that LP tokens yield what they should.
    (noRemoved, yesRemoved, cashRemoved) = amm.removeLiquidity(lpTokens)

    assert noRemoved == liquiditySets
    assert yesRemoved == liquiditySets - yesShares
    assert cashRemoved == tradeCash

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, YES, amm.address) == 0
    assert shareToken.balanceOfMarketOutcome(market.address, NO, amm.address) == 0
    assert cash.balanceOf(amm.address) == 0

    assert shareToken.balanceOfMarketOutcome(market.address, INVALID, account0) == liquiditySets
    assert shareToken.balanceOfMarketOutcome(market.address, YES, account0) == liquiditySets
    assert shareToken.balanceOfMarketOutcome(market.address, NO, account0) == liquiditySets
    assert cash.balanceOf(account0) == tradeCash

def test_amm_fee_calc_0(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()

    fee = 0  # 0/1000 aka 0.0%
    liquiditySets = 100
    amm = make_amm(sessionFixture, factory, market, shareToken, cash, account0, fee, liquiditySets)

    cash.faucet(10 ** 48) # just need enough to avoid reverts

    YES = True
    NO = False
    def trade(tradeCash, yes):
        tradeCash *= ATTO
        shares = amm.rateEnterPosition(tradeCash, yes)
        target = 2 * tradeCash // numticks
        slippage = (target - shares) / target
        return shares, slippage

    print(trade(1, YES))
    print(trade(10, YES))
    print(trade(100, YES))
    print(trade(1000, YES))
    print(trade(10000, YES))
    print(trade(20000, YES))
    print(trade(30000, YES))
    print(trade(40000, YES))
    print(trade(50000, YES))
    print(trade(60000, YES))
    print(trade(70000, YES))
    print(trade(80000, YES))
    print(trade(90000, YES))
    print(trade(100000, YES))

    # Each cash is worth 1/numticks shares, but you get almost double per cash because you sell the side you don't want.
    # There's some slippage however, so you don't quite get double.
    #             cash   type             shares         slippage
    assert trade(     1, YES) == (     1999990000000000, 0.000005)
    assert trade(    10, YES) == (    19999000000000000, 0.00005 )
    assert trade(   100, YES) == (   199900000000000000, 0.0005  )
    assert trade(  1000, YES) == (  1990000000000000000, 0.005   ) # numticks is 1000 so this is 2 sets worth of shares, minus slippage
    assert trade( 10000, YES) == ( 19000000000000000000, 0.05    )
    assert trade( 20000, YES) == ( 36000000000000000000, 0.1     )
    assert trade( 30000, YES) == ( 51000000000000000000, 0.15    )
    assert trade( 40000, YES) == ( 64000000000000000000, 0.2     )
    assert trade( 50000, YES) == ( 75000000000000000000, 0.25    )
    assert trade( 60000, YES) == ( 84000000000000000000, 0.3     )
    assert trade( 70000, YES) == ( 91000000000000000000, 0.35    )
    assert trade( 80000, YES) == ( 96000000000000000000, 0.4     )
    assert trade( 90000, YES) == ( 99000000000000000000, 0.45    )
    assert trade(100000, YES) == (100000000000000000000, 0.5     ) # 100 sets were added so this is the max that can be extracted... strictly unprofitable

def test_amm_fee_calc_10(sessionFixture, market, shareToken, cash, factory, account0):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    cash.faucet(10 ** 48)  # just need enough to avoid reverts

    fee = 10  # 10/1000 aka 1.0%
    liquiditySets = 100
    amm = make_amm(sessionFixture, factory, market, shareToken, cash, account0, fee, liquiditySets)

    YES = True
    NO = False
    def trade(tradeCash, yes):
        tradeCash *= ATTO
        shares = amm.rateEnterPosition(tradeCash, yes)
        target = 2 * tradeCash // numticks
        slippage = (target - shares) / target
        return shares, slippage

    print(trade(1, YES))
    print(trade(10, YES))
    print(trade(100, YES))
    print(trade(1000, YES))
    print(trade(10000, YES))
    print(trade(20000, YES))
    print(trade(30000, YES))
    print(trade(40000, YES))
    print(trade(50000, YES))
    print(trade(60000, YES))
    print(trade(70000, YES))
    print(trade(80000, YES))
    print(trade(90000, YES))
    print(trade(100000, YES))

    # Each cash is worth 1/numticks shares, but you get almost double per cash because you sell the side you don't want.
    # There's some slippage however, so you don't quite get double.
    #             cash   type             shares               slippage
    assert trade(     1, YES) == (     1979990100000000, 0.01000495)
    assert trade(    10, YES) == (    19799010000000000, 0.0100495 )
    assert trade(   100, YES) == (   197901000000000000, 0.010495  )
    assert trade(  1000, YES) == (  1970100000000000000, 0.01495   ) # numticks is 1000 so this is 2 sets worth of shares, minus slippage
    assert trade( 10000, YES) == ( 18810000000000000000, 0.0595    )
    assert trade( 20000, YES) == ( 35640000000000000000, 0.109     )
    assert trade( 30000, YES) == ( 50490000000000000000, 0.1585    )
    assert trade( 40000, YES) == ( 63360000000000000000, 0.208     )
    assert trade( 50000, YES) == ( 74250000000000000000, 0.2575    )
    assert trade( 60000, YES) == ( 83160000000000000000, 0.307     )
    assert trade( 70000, YES) == ( 90090000000000000000, 0.3565    )
    assert trade( 80000, YES) == ( 95040000000000000000, 0.406     )
    assert trade( 90000, YES) == ( 98010000000000000000, 0.4555    )
    assert trade(100000, YES) == ( 99000000000000000000, 0.505     ) # 100 sets were added so this is the max that can be extracted... strictly unprofitable

def test_amm_multiuser_liquidity(contractsFixture, market, cash, factory, amm, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()

    cash.approve(factory.address, 10 ** 48)
    cash.approve(factory.address, 10 ** 48, sender=account1)

    cost0 = 10 * ATTO
    sets0 = cost0 // numticks
    cash.faucet(cost0)
    amm.addInitialLiquidity(cost0, RATIO_50_50, True, account0)

    cost1 = 5 * ATTO
    sets1 = cost1 // numticks
    cash.faucet(cost1, sender=account1)
    lpTokens1 = amm.addLiquidity(cost1, account1, sender=account1)

    assert amm.balanceOf(account1) == lpTokens1

    # Test is for verifying that this does not fail
    [short, long, cashShare] = amm.rateRemoveLiquidity(lpTokens1, sender=account1)
    assert short == sets1
    assert long == sets1
    assert cashShare == 0

    amm.removeLiquidity(lpTokens1, sender=account1, getReturnData=False)

def test_amm_villainous_fee_extraction(contractsFixture, market, cash, shareToken, factory, amm, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    numticks = market.getNumTicks()
    sets = 100 * ATTO
    initialLiquidityCost = sets * numticks

    cash.approve(factory.address, 10 ** 48, sender=account0)
    cash.approve(factory.address, 10 ** 48, sender=account1)

    cash.faucet(initialLiquidityCost)
    amm.addInitialLiquidity(initialLiquidityCost, RATIO_50_50, True, account0)

    # Enter long position
    longPositionSets = 10 * ATTO
    longPositionCost = longPositionSets * numticks
    longSharesReceived = amm.rateEnterPosition(longPositionCost, True)
    cash.faucet(longPositionCost)
    amm.enterPosition(longPositionCost, True, longSharesReceived)

    # Attacker creates and destroys LP tokens, trying to make a nefarious profit thereby
    attacker = account1
    attackSets = 100 * ATTO
    attackLiquidityCost = attackSets * numticks
    cash.faucet(attackLiquidityCost, sender=attacker)
    lpTokens = amm.addLiquidity(attackLiquidityCost, attacker, sender=attacker)
    totalLPSupply = amm.totalSupply()
    shareToken.setApprovalForAll(factory.address, True, sender=attacker)

    [shortFromLP, longFromLP] = amm.yesNoShareBalances(attacker)
    [shortShare, longShare, cashShare] = amm.removeLiquidity(lpTokens, sender=attacker)

    setsToKeep = min(shortFromLP + shortShare, longFromLP + longShare)
    shortsToExit = shortFromLP + shortShare - setsToKeep
    longsToExit = longFromLP + longShare - setsToKeep

    cashFromPosition = amm.exitPosition(shortsToExit, longsToExit, 0, sender=attacker)

    totalValue = cashShare + cashFromPosition + setsToKeep*numticks

    print('lpTokens:', lpTokens)
    print('totalLPSupply:', totalLPSupply)
    print('shortFromLP:', shortFromLP)
    print('longFromLP:', longFromLP)
    print('shortShare:', shortShare)
    print('longShare:', longShare)
    print('setsToKeep:', setsToKeep)
    print('shortsToExit:', shortsToExit)
    print('longsToExit:', longsToExit)
    print('cashShare:', cashShare)
    print('cashFromPosition:', cashFromPosition)
    print('totalValue:', totalValue)
    print('attackLiquidityCost:', attackLiquidityCost)

    assert lpTokens == 89961717239430689366
    assert totalLPSupply == 189961717239430689366
    assert shortFromLP == 0
    assert longFromLP == 18810000000000000000
    assert shortShare == 94715628545346900801
    assert longShare == 76899618815967148760
    assert cashShare == 4735781427267345040067
    assert cashFromPosition == 541835402148283495230
    assert attackLiquidityCost * 0.99 < totalValue <= attackLiquidityCost # no profit but little loss

def test_amm_add_liquidity_ratio(contractsFixture, market, cash, factory, amm, account0, account1):
    if not contractsFixture.paraAugur:
        return skip("Test is only for para augur")

    def calc_ratio():
        [short, long] = amm.yesNoShareBalances(amm.address)
        return short / long

    numticks = market.getNumTicks()
    sets = 100 * ATTO

    cash.approve(factory.address, 10 ** 48)

    initialLiquidityCost = sets * numticks
    cash.faucet(initialLiquidityCost)
    amm.addInitialLiquidity(initialLiquidityCost, RATIO_60_40, True, account0)
    priorRatio = calc_ratio()

    subsequentLiquidityCost = sets * numticks
    cash.faucet(subsequentLiquidityCost)
    amm.addLiquidity(subsequentLiquidityCost, account0)
    latterRatio = calc_ratio()

    assert priorRatio == latterRatio

def test_amm_claim_from_multiple_markets(sessionFixture, universe, factory, shareToken, cash, account0, account1):
    if not sessionFixture.paraAugur:
        return skip("Test is only for para augur")


    def do_it():
        market = sessionFixture.createReasonableYesNoMarket(universe)
        numticks = market.getNumTicks()

        amm = make_amm(sessionFixture, factory, market, shareToken, cash, account1, FEE, 100)

        yesPositionSets = 10 * ATTO
        yesPositionCost = yesPositionSets * numticks
        sharesReceived = amm.rateEnterPosition(yesPositionCost, True)

        cash.faucet(yesPositionCost)
        amm.enterPosition(yesPositionCost, True, sharesReceived)

        proceedToInitialReporting(sessionFixture, market)

        market.doInitialReport([0, 0, market.getNumTicks()], "", 0)

        disputeWindow = sessionFixture.applySignature('DisputeWindow', market.getDisputeWindow())
        sessionFixture.contracts["Time"].setTimestamp(disputeWindow.getEndTime() + 1)

        market.finalize()

        return market

    market1 = do_it()
    market2 = do_it()

    balanceBeforeFinalization = cash.balanceOf(account0)
    factory.claimMarketsProceeds([market1.address, market2.address], [shareToken.address, shareToken.address], account0, stringToBytes(""))

    # Should have more cash than before because both markets resolved in account0's favor.
    assert cash.balanceOf(account0) > balanceBeforeFinalization

# TODO tests
# 1. Two users add and remove liquidity, without trading occuring.
# 2. Two users add liquidity, then other users trade, then the users remove liquidity.
#    The worry is that our reward function doesn't work quite right so users won't get back what they put in.
# 3. User adds liqudity. Then there's trading. Then another user adds liquidity. They should get the right number of LP tokens.
#    And when the users remove liquidity, they get the number of shares and cash that makes sense.
# 4. Users swap and enter and exit positions.
# 5. The sqrt functions for safemath int and uint work as expected. Alex wrote them but there just aren't any tests yet.
# 6. Verify specific enterPosition costs.


def make_amm(sessionFixture, factory, market, shareToken, cash, account, fee=FEE, liquiditySets=0, liquidityRatio=RATIO_50_50):
    ammAddress = factory.addAMM(market.address, shareToken.address, fee)
    amm = sessionFixture.applySignature("AMMExchange", ammAddress)

    if liquiditySets:
        liquiditySets *= ATTO
        liquidityCash = liquiditySets * market.getNumTicks()
        cash.faucet(liquidityCash)
        cash.approve(factory.address, 10 ** 48)
        shareToken.setApprovalForAll(factory.address, True)

        amm.rateAddLiquidity(liquiditySets, liquiditySets)
        amm.addInitialLiquidity(liquidityCash, liquidityRatio, True, account)

    return amm

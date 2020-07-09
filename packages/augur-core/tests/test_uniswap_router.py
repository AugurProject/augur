#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from utils import longTo32Bytes, longToHexString, fix, AssertLog, stringToBytes, EtherDelta, PrintGasUsed, BuyWithCash, TokenDelta, EtherDelta, nullAddress
from pytest import raises, mark, fixture as pytest_fixture
from reporting_utils import proceedToNextRound
from decimal import Decimal
from math import floor

APPROVAL_AMOUNT = 2**255

def test_uniswap_router(contractsFixture, cash, reputationToken):
    weth = contractsFixture.contracts["WETH9"]
    uniswap = contractsFixture.contracts["UniswapV2Router02"]

    account = contractsFixture.accounts[0]
    deadline = contractsFixture.eth_tester.backend.chain.header.timestamp + 1000000

    # We'll provide some liquidity to the REP/DAI exchange
    cashAmount = 100 * 10**18
    repAmount = 10 * 10**18
    cash.faucet(cashAmount)
    reputationToken.faucet(repAmount)
    cash.approve(uniswap.address, APPROVAL_AMOUNT)
    reputationToken.approve(uniswap.address, APPROVAL_AMOUNT)
    uniswap.addLiquidity(reputationToken.address, cash.address, repAmount, cashAmount, 0, 0, account, deadline)

    # We'll provide liquidity to the ETH/DAI exchange now
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    cash.faucet(cashAmount)
    uniswap.addLiquidityETH(cash.address, cashAmount, cashAmount, ethAmount, account, deadline, value=ethAmount)

    # Now lets do some swaps. We'll pay some DAI get an exact amount of REP first
    exactRep = 10**17
    maxDAI = 1.1 * 10**18
    cash.faucet(maxDAI)
    with TokenDelta(reputationToken, exactRep, account, "REP token balance wrong"):
        uniswap.swapTokensForExactTokens(exactRep, maxDAI, [cash.address, reputationToken.address], account, deadline)

    # Now we'll pay an exact amount of DAI to get some REP
    exactDAI = 10**18
    minRep = .95 * 10**17
    cash.faucet(exactDAI)
    with TokenDelta(cash, -exactDAI, account, "Cash token balance wrong"):
        uniswap.swapExactTokensForTokens(exactDAI, minRep, [cash.address, reputationToken.address], account, deadline)

    # Now lets pay some DAI to get an exact amount of ETH. We pay gas to execute this so we subtract a dust value to account for that
    exactETH = 10**16
    cash.faucet(maxDAI)
    initialETHBalance = contractsFixture.eth_tester.get_balance(account)
    uniswap.swapTokensForExactETH(exactETH, maxDAI, [cash.address, weth.address], account, deadline)
    newETHBalance = contractsFixture.eth_tester.get_balance(account)
    dust = 10**7
    assert newETHBalance - initialETHBalance >  exactETH - dust

    # Now we pay an exact amount of DAI to get some ETH
    minETH = .95 * 10**16
    cash.faucet(exactDAI)
    with TokenDelta(cash, -exactDAI, account, "Cash token balance wrong"):
        uniswap.swapExactTokensForETH(exactDAI, minETH, [cash.address, weth.address], account, deadline)

    # Now lets pay some ETH to get an exact amount of DAI.
    maxETH = 1.1 * 10**16
    uniswap.swapETHForExactTokens(exactDAI, [weth.address, cash.address], account, deadline, value=maxETH)

    # Finally we pay an exact amount of ETH to get some DAI.
    minDAI = .95 * 10**18
    uniswap.swapExactETHForTokens(minDAI, [weth.address, cash.address], account, deadline, value=exactETH)
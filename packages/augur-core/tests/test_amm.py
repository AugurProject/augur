#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, PrintGasUsed


def test_amm(contractsFixture, market, cash):
    if not contractsFixture.paraAugur:
        return

    shareToken = contractsFixture.getShareToken()

    # Create AMM
    amm = contractsFixture.upload('../src/contracts/para/AMMExchange.sol', constructorArgs=[market.address, shareToken.address])

    # Add liquidity
    cash.faucet(10000 * 10**18)
    cash.approve(amm.address, 10**40)
    amm.addLiquidity(10 * 10**18)

    # Swap

    # Remove liquidity
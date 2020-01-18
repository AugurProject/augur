#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, longTo32Bytes, AssertLog


def test_gnosis_safe_registry(contractsFixture, augur, universe, cash, gnosisSafeRegistry, gnosisSafeMaster, proxyFactory):
    createOrder = contractsFixture.contracts["CreateOrder"]
    fillOrder = contractsFixture.contracts["FillOrder"]
    zeroXTrade = contractsFixture.contracts["ZeroXTrade"]
    shareToken = contractsFixture.contracts["ShareToken"]
    affiliates = contractsFixture.contracts["Affiliates"]
    account = contractsFixture.accounts[0]

    assert gnosisSafeRegistry.getSafe(account) == nullAddress

    assert gnosisSafeRegistry.address
    assert gnosisSafeMaster.address
    assert proxyFactory.address

    saltNonce = 42

    gnosisSafeRegistryData = gnosisSafeRegistry.setupForAugur_encode(augur.address, createOrder.address, fillOrder.address, zeroXTrade.address, cash.address, shareToken.address, affiliates.address, longTo32Bytes(11), nullAddress)

    gnosisSafeData = gnosisSafeMaster.setup_encode([account], 1, gnosisSafeRegistry.address, gnosisSafeRegistryData, nullAddress, nullAddress, 0, nullAddress)
    
    GnosisSafeRegisteredLog = {
        "owner": account,
    }
    with AssertLog(contractsFixture, "GnosisSafeRegistered", GnosisSafeRegisteredLog):
        gnosisSafeAddress = proxyFactory.createProxyWithCallback(gnosisSafeMaster.address, gnosisSafeData, saltNonce, gnosisSafeRegistry.address)

    gnosisSafe = contractsFixture.applySignature("GnosisSafe", gnosisSafeAddress)
    
    assert gnosisSafe.getOwners() == [account]
    assert gnosisSafe.getThreshold() == 1

    assert gnosisSafeRegistry.getSafe(account) == gnosisSafe.address

    assert cash.allowance(gnosisSafe.address, augur.address, 2 ** 256 - 1)


@pytest_fixture
def gnosisSafeRegistry(contractsFixture):
    return contractsFixture.contracts["GnosisSafeRegistry"]

@pytest_fixture
def gnosisSafeMaster(contractsFixture):
    return contractsFixture.contracts["GnosisSafe"]

@pytest_fixture
def proxyFactory(contractsFixture):
    return contractsFixture.contracts["ProxyFactory"]


#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress


def test_gnosis_safe_registry(contractsFixture, augur, universe, cash, gnosisSafeRegistry, gnosisSafeMaster, proxyFactory):
    account = contractsFixture.accounts[0]

    assert gnosisSafeRegistry.getSafe(account) == nullAddress

    assert gnosisSafeRegistry.address
    assert gnosisSafeMaster.address
    assert proxyFactory.address

    saltNonce = 42

    gnosisSafeRegistryData = gnosisSafeRegistry.callRegister_encode(gnosisSafeRegistry.address, augur.address, cash.address)

    gnosisSafeData = gnosisSafeMaster.setup_encode([account], 1, gnosisSafeRegistry.address, gnosisSafeRegistryData, nullAddress, 0, nullAddress)
    gnosisSafeAddress = proxyFactory.createProxyWithNonce(gnosisSafeMaster.address, gnosisSafeData, saltNonce)

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


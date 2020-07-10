#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, longTo32Bytes, AssertLog, PrintGasUsed
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad


def test_augur_wallet_registry(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistryV2"]
    stakeManager = contractsFixture.contracts["StakeManager"]
    relayHub = contractsFixture.contracts["RelayHubV2"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    stakeManager.stakeForAddress(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    stakeManager.authorizeHubByOwner(relayer, relayHub.address, sender=relayOwner)
    relayHub.addRelayWorkers([relayer], sender=relayer)
    relayHub.registerRelayServer(0, 10, "url", sender=relayer)

    initialRegistryHubBalance = relayHub.balanceOf(augurWalletRegistry.address)

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 1000 * 10**18
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress, cashAmount, sender=account)

    # We'll provide some liquidity to the eth exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    # We do this again in order to trigger a storage update that will make using the exchange cheaper
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    assert augurWalletRegistry.getWallet(account) == nullAddress

    maxDaiTxFee = 10**18
    fingerprint = longTo32Bytes(42)
    additionalFee = 10 # 10%
    gasPrice = 1
    gasLimit = 3000000
    nonce = 0
    approvalData = ""
    cashPayment = 10**16
    desiredSignerBalance = 0
    maxExchangeRate = 200 * 10**36

    # Now lets have the relayer send an actual tx for the user to faucet cash into their wallet
    repAmount = 10**18
    repFaucetData = reputationToken.faucet_encode(repAmount)
    augurWalletRepFaucetData = augurWalletRegistry.executeWalletTransaction_encode(reputationToken.address, repFaucetData, 0, cashPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
    nonce = 0
    baseFee = 0

    relayRequest = (
        (account,
        augurWalletRegistry.address,
        0,
        gasLimit,
        nonce,
        augurWalletRepFaucetData),
        (gasPrice,
        additionalFee,
        baseFee,
        relayer,
        augurWalletRegistry.address,
        "",
        0,
        augurWalletRegistry.address)
    )

    messageHash = augurWalletRegistry.getRelayMessageHash(relayRequest)

    signature = signMessage(messageHash, accountKey)

    maxPossibleGasLimit = 4000000

    success, failureReason, gasLimits = relayHub.canRelay(
        relayRequest,
        maxPossibleGasLimit,
        signature,
        approvalData)

    assert success, failureReason

    initialRep = reputationToken.balanceOf(walletAddress)

    TransactionRelayedLog = {
        "status": 0,
    }
    with AssertLog(contractsFixture, "TransactionRelayed", TransactionRelayedLog, contract=relayHub):
        relayHub.relayCall(
            relayRequest,
            signature,
            approvalData,
            maxPossibleGasLimit,
            sender=relayer,
            gas=4100000
        )

    assert augurWalletRegistry.getWallet(account) == walletAddress

    assert cash.allowance(walletAddress, augur.address, 2 ** 256 - 1)

    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

    # The relay hub balance for the registry is at least what it was initially
    newRegistryHubBalance = relayHub.balanceOf(augurWalletRegistry.address)
    assert newRegistryHubBalance >= initialRegistryHubBalance

    # Lets try making a market with the wallet
    endTime = augur.getTimestamp() + 10000
    feePerEthInWei = 10**16
    affiliateFeeDivisor = 100
    createMarketData = universe.createYesNoMarket_encode(endTime, feePerEthInWei, nullAddress, affiliateFeeDivisor, account, "")
    augurWalletCreateMarketData = augurWalletRegistry.executeWalletTransaction_encode(universe.address, createMarketData, 0, cashPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)

    nonce += 1

    relayRequest = (
        (account,
        augurWalletRegistry.address,
        0,
        gasLimit,
        nonce,
        augurWalletCreateMarketData),
        (gasPrice,
        additionalFee,
        baseFee,
        relayer,
        augurWalletRegistry.address,
        "",
        0,
        augurWalletRegistry.address)
    )

    messageHash = augurWalletRegistry.getRelayMessageHash(relayRequest)

    signature = signMessage(messageHash, accountKey)

    success, failureReason, gasLimits = relayHub.canRelay(
        relayRequest,
        maxPossibleGasLimit,
        signature,
        approvalData)

    assert success, failureReason

    MarketCreatedLog = {
        "marketCreator": walletAddress
    }

    TransactionRelayedLog = {
        "status": 0,
    }
    with AssertLog(contractsFixture, "MarketCreated", MarketCreatedLog):
        with AssertLog(contractsFixture, "TransactionRelayed", TransactionRelayedLog, contract=relayHub):
            relayHub.relayCall(
                relayRequest,
                signature,
                approvalData,
                maxPossibleGasLimit,
                sender=relayer,
                gas=4100000
            )

    # Lets try sending some eth with the wallet
    ethAmount = 100
    contractsFixture.sendEth(account, walletAddress, ethAmount)

    ethRecipient = contractsFixture.accounts[3]
    oldBalance = contractsFixture.ethBalance(ethRecipient)

    augurWalletSendEthData = augurWalletRegistry.executeWalletTransaction_encode(ethRecipient, "0x", ethAmount, cashPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)

    nonce += 1

    relayRequest = (
        (account,
        augurWalletRegistry.address,
        0,
        gasLimit,
        nonce,
        augurWalletSendEthData),
        (gasPrice,
        additionalFee,
        baseFee,
        relayer,
        augurWalletRegistry.address,
        "",
        0,
        augurWalletRegistry.address)
    )

    messageHash = augurWalletRegistry.getRelayMessageHash(relayRequest)

    signature = signMessage(messageHash, accountKey)

    success, failureReason, gasLimits = relayHub.canRelay(
        relayRequest,
        maxPossibleGasLimit,
        signature,
        approvalData)

    assert success, failureReason

    TransactionRelayedLog = {
        "status": 0,
    }

    relayHub.relayCall(
        relayRequest,
        signature,
        approvalData,
        maxPossibleGasLimit,
        sender=relayer,
        gas=4100000
    )

    assert contractsFixture.ethBalance(ethRecipient) == oldBalance + ethAmount
    
def test_augur_wallet_registry_auto_create(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistryV2"]
    stakeManager = contractsFixture.contracts["StakeManager"]
    relayHub = contractsFixture.contracts["RelayHubV2"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    stakeManager.stakeForAddress(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    stakeManager.authorizeHubByOwner(relayer, relayHub.address, sender=relayOwner)
    relayHub.addRelayWorkers([relayer], sender=relayer)
    relayHub.registerRelayServer(0, 10, "url", sender=relayer)

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 100*10**18
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress, cashAmount, sender=account)

    # We'll provide some liquidity to the eth exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    # We do this again in order to trigger a storage update that will make using the exchange cheaper
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    assert augurWalletRegistry.getWallet(account) == nullAddress

    repAmount = 10**18
    fingerprint = longTo32Bytes(42)
    ethPayment = 10**16
    desiredSignerBalance = 0
    maxExchangeRate = 200 * 10**36
    repFaucetData = reputationToken.faucet_encode(repAmount)
    augurWalletRepFaucetData = augurWalletRegistry.executeWalletTransaction_encode(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
    nonce = 0
    maxDaiTxFee = 10**18
    additionalFee = 10 # 10%
    gasPrice = 1
    gasLimit = 3000000
    maxPossibleGasLimit = 4000000
    approvalData = ""
    baseFee = 0

    relayRequest = (
        (account,
        augurWalletRegistry.address,
        0,
        gasLimit,
        nonce,
        augurWalletRepFaucetData),
        (gasPrice,
        additionalFee,
        baseFee,
        relayer,
        augurWalletRegistry.address,
        "",
        0,
        augurWalletRegistry.address)
    )

    messageHash = augurWalletRegistry.getRelayMessageHash(relayRequest)

    signature = signMessage(messageHash, accountKey)

    initialRep = reputationToken.balanceOf(walletAddress)

    relayHub.relayCall(
        relayRequest,
        signature,
        approvalData,
        maxPossibleGasLimit,
        sender=relayer,
        gas=4100000
    )

    assert augurWalletRegistry.getWallet(account) == walletAddress
    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

    # Lets quickly make sure the wallet addresses and functions for the legacy registry work with this wallet
    legacyWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    assert legacyWalletRegistry.getCreate2WalletAddress(account) == walletAddress

def test_augur_wallet_registry_fund_signer(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistryV2"]
    stakeManager = contractsFixture.contracts["StakeManager"]
    relayHub = contractsFixture.contracts["RelayHubV2"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    stakeManager.stakeForAddress(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    stakeManager.authorizeHubByOwner(relayer, relayHub.address, sender=relayOwner)
    relayHub.addRelayWorkers([relayer], sender=relayer)
    relayHub.registerRelayServer(0, 10, "url", sender=relayer)

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 100*10**18
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress, cashAmount, sender=account)

    # We'll provide some liquidity to the eth exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    weth.deposit(ethAmount, value=ethAmount)
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    weth.transfer(ethExchange.address, ethAmount)
    ethExchange.mint(account)

    assert augurWalletRegistry.getWallet(account) == nullAddress

    # Specify a desired signer balance and a maximum exchnage rate
    desiredSignerBalance = contractsFixture.ethBalance(account) + 5 * 10**16
    maxExchangeRate = 220 * 10**18

    repAmount = 10**18
    fingerprint = longTo32Bytes(42)
    ethPayment = 10**16
    repFaucetData = reputationToken.faucet_encode(repAmount)
    augurWalletRepFaucetData = augurWalletRegistry.executeWalletTransaction_encode(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
    nonce = 0
    maxDaiTxFee = 10**18
    additionalFee = 10 # 10%
    gasPrice = 1
    gasLimit = 3000000
    maxPossibleGasLimit = 4000000
    approvalData = ""
    baseFee = 0

    relayRequest = (
        (account,
        augurWalletRegistry.address,
        0,
        gasLimit,
        nonce,
        augurWalletRepFaucetData),
        (gasPrice,
        additionalFee,
        baseFee,
        relayer,
        augurWalletRegistry.address,
        "",
        0,
        augurWalletRegistry.address)
    )

    messageHash = augurWalletRegistry.getRelayMessageHash(relayRequest)

    signature = signMessage(messageHash, accountKey)

    initialRep = reputationToken.balanceOf(walletAddress)

    relayHub.relayCall(
        relayRequest,
        signature,
        approvalData,
        maxPossibleGasLimit,
        sender=relayer,
        gas=4100000
    )

    assert augurWalletRegistry.getWallet(account) == walletAddress
    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount
    signerEthBalance = contractsFixture.ethBalance(account)
    assert signerEthBalance >= desiredSignerBalance

    # Now we'll tests the method to extract all ETH & CASH funds, signer and wallet, out to a specified address
    walletCashBalance = cash.balanceOf(walletAddress)
    assert walletCashBalance > 0

    destinationAddress = contractsFixture.accounts[4]
    minExchangeRate = 90 * 10 ** 18
    wallet = contractsFixture.applySignature("AugurWallet", walletAddress)
    ethReserve = 10 ** 18
    sendableEth = ethReserve
    with PrintGasUsed(contractsFixture, "WITHDRAW WALLET FUNDS", 0):
        assert wallet.withdrawAllFundsAsDai(destinationAddress, minExchangeRate, value=sendableEth)
    assert cash.balanceOf(walletAddress) == 0
    assert cash.balanceOf(destinationAddress) > walletCashBalance
    assert contractsFixture.ethBalance(account) < signerEthBalance - ethReserve

def test_authorizedProxies(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistryV2"]
    stakeManager = contractsFixture.contracts["StakeManager"]
    relayHub = contractsFixture.contracts["RelayHubV2"]
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]

    assert augurWalletRegistry.getWallet(account) == nullAddress
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)

    desiredSignerBalance = 0
    maxExchangeRate = 0

    repAmount = 10**18
    fingerprint = longTo32Bytes(42)
    ethPayment = 10**16
    repFaucetData = reputationToken.faucet_encode(repAmount)

    initialRep = reputationToken.balanceOf(walletAddress)

    augurWalletRegistry.executeWalletTransaction(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

    # Now lets add an authorizedProxy to do the call by uploading a different AugurWalletRegistry
    newProxy = contractsFixture.upload('../src/contracts/AugurWalletRegistry.sol', 'NewProxy')
    newProxy.initialize(contractsFixture.contracts['Augur'].address, contractsFixture.contracts['AugurTrading'].address, value=2.5 * 10**17)

    # Initially we may not execute transactions using this contract
    with raises(TransactionFailed):
        newProxy.executeWalletTransaction(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)

    # If we add this contract to the wallets authorized proxies however it may then execute the transaction
    wallet = contractsFixture.applySignature("AugurWallet", walletAddress)
    assert wallet.addAuthorizedProxy(newProxy.address)

    initialRep = reputationToken.balanceOf(walletAddress)
    augurWalletRegistry.executeWalletTransaction(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)
    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

    # We can remove an authorized proxy as well
    assert wallet.removeAuthorizedProxy(newProxy.address)

    with raises(TransactionFailed):
        newProxy.executeWalletTransaction(reputationToken.address, repFaucetData, 0, ethPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)



def signMessage(messageHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + messageHash), key)
    return "0x" + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + v.to_bytes(1, "big").hex()

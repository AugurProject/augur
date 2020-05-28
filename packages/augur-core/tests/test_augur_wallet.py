#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, longTo32Bytes, AssertLog, PrintGasUsed
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad

RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494"

def test_augur_wallet_registry(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    relayHub = contractsFixture.applySignature("RelayHub", RELAY_HUB_ADDRESS)
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    relayHub.stake(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    relayHub.registerRelay(10, "url", sender=relayer)

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

    messageHash = augurWalletRegistry.getRelayMessageHash(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)

    signature = signMessage(messageHash, accountKey)

    assert relayHub.canRelay(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData)[0] == 0

    initialRep = reputationToken.balanceOf(walletAddress)

    TransactionRelayedLog = {
        "status": 0,
    }
    with AssertLog(contractsFixture, "TransactionRelayed", TransactionRelayedLog, contract=relayHub):
        relayHub.relayCall(
            account,
            augurWalletRegistry.address,
            augurWalletRepFaucetData,
            additionalFee,
            gasPrice,
            gasLimit,
            nonce,
            signature,
            approvalData,
            sender=relayer
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

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
        account,
        augurWalletRegistry.address,
        augurWalletCreateMarketData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)

    signature = signMessage(messageHash, accountKey)

    assert relayHub.canRelay(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletCreateMarketData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData)[0] == 0

    MarketCreatedLog = {
        "marketCreator": walletAddress
    }

    TransactionRelayedLog = {
        "status": 0,
    }
    with AssertLog(contractsFixture, "MarketCreated", MarketCreatedLog):
        with AssertLog(contractsFixture, "TransactionRelayed", TransactionRelayedLog, contract=relayHub):
            relayHub.relayCall(
                account,
                augurWalletRegistry.address,
                augurWalletCreateMarketData,
                additionalFee,
                gasPrice,
                gasLimit,
                nonce,
                signature,
                approvalData,
                sender=relayer
            )

    # Lets try sending some eth with the wallet
    ethAmount = 100
    contractsFixture.sendEth(account, walletAddress, ethAmount)

    ethRecipient = contractsFixture.accounts[3]
    oldBalance = contractsFixture.ethBalance(ethRecipient)

    augurWalletSendEthData = augurWalletRegistry.executeWalletTransaction_encode(ethRecipient, "0x", ethAmount, cashPayment, nullAddress, fingerprint, desiredSignerBalance, maxExchangeRate, False)

    nonce += 1

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
        account,
        augurWalletRegistry.address,
        augurWalletSendEthData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)

    signature = signMessage(messageHash, accountKey)

    assert relayHub.canRelay(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletSendEthData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData)[0] == 0

    TransactionRelayedLog = {
        "status": 0,
    }

    relayHub.relayCall(
        account,
        augurWalletRegistry.address,
        augurWalletSendEthData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData,
        sender=relayer
    )

    assert contractsFixture.ethBalance(ethRecipient) == oldBalance + ethAmount
    
def test_augur_wallet_registry_auto_create(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    relayHub = contractsFixture.applySignature("RelayHub", RELAY_HUB_ADDRESS)
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    relayHub.stake(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    relayHub.registerRelay(10, "url", sender=relayer)

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
    approvalData = ""

    messageHash = augurWalletRegistry.getRelayMessageHash(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)

    signature = signMessage(messageHash, accountKey)

    initialRep = reputationToken.balanceOf(walletAddress)

    relayHub.relayCall(
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData,
        sender=relayer
    )

    assert augurWalletRegistry.getWallet(account) == walletAddress
    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

def test_augur_wallet_registry_fund_signer(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    relayHub = contractsFixture.applySignature("RelayHub", RELAY_HUB_ADDRESS)
    ethExchange = contractsFixture.applySignature("UniswapV2Pair", augurWalletRegistry.ethExchange())
    weth = contractsFixture.contracts["WETH9"]
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    relayHub.stake(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    relayHub.registerRelay(10, "url", sender=relayer)

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
    approvalData = ""

    messageHash = augurWalletRegistry.getRelayMessageHash(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)

    signature = signMessage(messageHash, accountKey)

    initialRep = reputationToken.balanceOf(walletAddress)

    relayHub.relayCall(
        account,
        augurWalletRegistry.address,
        augurWalletRepFaucetData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData,
        sender=relayer
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
    

def signMessage(messageHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + messageHash), key)
    return "0x" + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + v.to_bytes(1, "big").hex()

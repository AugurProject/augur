#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture as pytest_fixture
from utils import nullAddress, longTo32Bytes, AssertLog
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad

RELAY_HUB_ADDRESS = "0xD216153c06E857cD7f72665E0aF1d7D82172F494"

def test_augur_wallet_registry(contractsFixture, augur, universe, cash, reputationToken):
    augurWalletRegistry = contractsFixture.contracts["AugurWalletRegistry"]
    ethExchange = contractsFixture.contracts["EthExchange"]
    relayHub = contractsFixture.applySignature("RelayHub", RELAY_HUB_ADDRESS)
    account = contractsFixture.accounts[0]
    accountKey = contractsFixture.privateKeys[0]
    relayer = contractsFixture.accounts[1]
    relayOwner = contractsFixture.accounts[2]

    # Register a relay
    unstakeDelay = 2 * 7 * 24 * 60 * 60
    relayHub.stake(relayer, unstakeDelay, value=2*10**18, sender=relayOwner)
    relayHub.registerRelay(10, "url", sender=relayer)

    # Fund the registry manually
    relayHub.depositFor(augurWalletRegistry.address, value=2*10**18)

    # Fund the wallet so we can generate it and have it reimburse the relay hub
    cashAmount = 100*10**18
    walletAddress = augurWalletRegistry.getCreate2WalletAddress(account)
    cash.faucet(cashAmount)
    cash.transfer(walletAddress, cashAmount, sender=account)

    # We'll provide some liquidity to the eth exchange
    cashAmount = 1000 * 10**18
    ethAmount = 10 * 10**18
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    contractsFixture.sendEth(account, ethExchange.address, ethAmount)
    ethExchange.publicMint(account)

    # We do this again in order to trigger a storage update that will make using the exchange cheaper
    cash.faucet(cashAmount)
    cash.transfer(ethExchange.address, cashAmount)
    contractsFixture.sendEth(account, ethExchange.address, ethAmount)
    ethExchange.publicMint(account)

    assert augurWalletRegistry.getWallet(account) == nullAddress

    maxDaiTxFee = 10**18
    fingerprint = longTo32Bytes(42)
    additionalFee = 10 # 10%
    gasPrice = 1
    gasLimit = 3000000
    nonce = 0
    approvalData = ""
    augurWalletCreationData = augurWalletRegistry.createAugurWallet_encode(nullAddress, fingerprint, maxDaiTxFee)

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
        account,
        augurWalletRegistry.address,
        augurWalletCreationData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce)
    signature = signMessage(messageHash, accountKey)

    assert relayHub.canRelay(
        relayer,
        account,
        augurWalletRegistry.address,
        augurWalletCreationData,
        additionalFee,
        gasPrice,
        gasLimit,
        nonce,
        signature,
        approvalData)[0] == 0

    TransactionRelayedLog = {
        "status": 0,
    }
    with AssertLog(contractsFixture, "TransactionRelayed", TransactionRelayedLog, contract=relayHub):
        relayHub.relayCall(
            account,
            augurWalletRegistry.address,
            augurWalletCreationData,
            additionalFee,
            gasPrice,
            gasLimit,
            nonce,
            signature,
            approvalData,
            sender=relayer
        )

    assert augurWalletRegistry.getWallet(account) == walletAddress

    wallet = contractsFixture.applySignature("AugurWallet", walletAddress)

    assert cash.allowance(walletAddress, augur.address, 2 ** 256 - 1)

    # Now lets have the relayer send an actual tx for the user to faucet cash into their wallet
    repAmount = 10**18
    repFaucetData = reputationToken.faucet_encode(repAmount)
    augurWalletRepFaucetData = augurWalletRegistry.executeWalletTransaction_encode(reputationToken.address, repFaucetData, 0)
    nonce += 1

    messageHash = augurWalletRegistry.getRelayMessageHash(relayer,
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

    assert reputationToken.balanceOf(walletAddress) == initialRep + repAmount

def signMessage(messageHash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + messageHash), key)
    return "0x" + (zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32) + zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32)).hex() + v.to_bytes(1, "big").hex()

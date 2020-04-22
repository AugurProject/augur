#!/usr/bin/env python

from eth_tester.exceptions import TransactionFailed
from pytest import raises, fixture, mark
from utils import fix, AssertLog, EtherDelta, TokenDelta, BuyWithCash, nullAddress, longTo32Bytes
from constants import YES, NO
from old_eth_utils import ecsign, sha3, normalize_key, int_to_32bytearray, bytearray_to_bytestr, zpad


def test_fingerprint(kitchenSinkFixture, universe, cash, market):
    affiliates = kitchenSinkFixture.contracts['Affiliates']
    affiliateValidator = kitchenSinkFixture.applySignature("AffiliateValidator", affiliates.createAffiliateValidator())
    shareToken = kitchenSinkFixture.contracts['ShareToken']

    accountFingerprint = longTo32Bytes(11)
    affiliateFingerprint = longTo32Bytes(12)

    account = kitchenSinkFixture.accounts[0]
    affiliate = kitchenSinkFixture.accounts[1]

    affiliates.setFingerprint(accountFingerprint, sender=account)
    affiliates.setFingerprint(affiliateFingerprint, sender=affiliate)
    affiliates.setReferrer(affiliate)

    numSets = 10
    cost = numSets * market.getNumTicks()
    expectedAffiliateFees = cost * .0025
    expectedAffiliateFees *= .8
    cash.faucet(cost)
    shareToken.buyCompleteSets(market.address, account, numSets)
    with TokenDelta(cash, expectedAffiliateFees, affiliate):
        shareToken.sellCompleteSets(market.address, account, account, numSets, accountFingerprint)

    # If we pass the affiliate fingerprint we will see that the affiliate fees do not apply and will remain what they were before complete set sale
    cash.faucet(cost)
    shareToken.buyCompleteSets(market.address, account, numSets)
    with TokenDelta(cash, 0, affiliate):
        shareToken.sellCompleteSets(market.address, account, account, numSets, affiliateFingerprint)

def test_affiliate_validator(kitchenSinkFixture, universe, cash):
    affiliates = kitchenSinkFixture.contracts['Affiliates']
    affiliateValidator = kitchenSinkFixture.applySignature("AffiliateValidator", affiliates.createAffiliateValidator())
    shareToken = kitchenSinkFixture.contracts['ShareToken']

    market = kitchenSinkFixture.createReasonableYesNoMarket(universe, affiliateValidator = affiliateValidator.address)

    accountFingerprint = longTo32Bytes(11)
    affiliateFingerprint = longTo32Bytes(12)

    account = kitchenSinkFixture.accounts[0]
    affiliate = kitchenSinkFixture.accounts[1]
    affiliateValidatorOperator = kitchenSinkFixture.accounts[5]
    affiliateValidatorOperatorPrivKey = kitchenSinkFixture.privateKeys[5]

    affiliates.setFingerprint(accountFingerprint, sender=account)
    affiliates.setFingerprint(affiliateFingerprint, sender=affiliate)
    affiliates.setReferrer(affiliate)

    accountKey = longTo32Bytes(21)
    salt = 0
    accountHash = affiliateValidator.getKeyHash(accountKey, account, salt)

    # A bad signature will be rejected
    with raises(TransactionFailed):
        affiliateValidator.addKey(accountKey, salt, longTo32Bytes(0), longTo32Bytes(0), 8, sender=account)

    # This includes being signed by a non operator. So the same sig will fail initially but work once the signer is approved as an operator
    r, s, v = signHash(accountHash, affiliateValidatorOperatorPrivKey)
    with raises(TransactionFailed):
        affiliateValidator.addKey(accountKey, salt, r, s, v, sender=account)

    # Succesfully add the key for the trader account
    affiliateValidator.addOperator(affiliateValidatorOperator)
    affiliateValidator.addKey(accountKey, salt, r, s, v, sender=account)

    # Re-using a salt will not work
    with raises(TransactionFailed):
        affiliateValidator.addKey(accountKey, salt, r, s, v, sender=account)

    affiliateKey = longTo32Bytes(22)
    salt += 1
    affiliateHash = affiliateValidator.getKeyHash(affiliateKey, affiliate, salt)
    r, s, v = signHash(affiliateHash, affiliateValidatorOperatorPrivKey)
    affiliateValidator.addKey(affiliateKey, salt, r, s, v, sender=affiliate)

    numSets = 10
    cost = numSets * market.getNumTicks()
    expectedAffiliateFees = cost * .0025
    expectedAffiliateFees *= .8
    cash.faucet(cost)
    shareToken.buyCompleteSets(market.address, account, numSets)
    with TokenDelta(cash, expectedAffiliateFees, affiliate):
        shareToken.sellCompleteSets(market.address, account, account, numSets, accountFingerprint)

    # If we try to use an account that has registered an affiliate key which is the same as the referrer the affiliate fees do not apply and will remain what they were before complete set sale
    dupeAccount = kitchenSinkFixture.accounts[2]
    affiliates.setReferrer(affiliate, sender=dupeAccount)
    salt += 1
    affiliateHash = affiliateValidator.getKeyHash(affiliateKey, dupeAccount, salt)
    r, s, v = signHash(affiliateHash, affiliateValidatorOperatorPrivKey)
    affiliateValidator.addKey(affiliateKey, salt, r, s, v, sender=dupeAccount)
    
    cash.faucet(cost, sender=dupeAccount)
    shareToken.buyCompleteSets(market.address, dupeAccount, numSets, sender=dupeAccount)
    with TokenDelta(cash, 0, affiliate):
        shareToken.sellCompleteSets(market.address, dupeAccount, dupeAccount, numSets, accountFingerprint, sender=dupeAccount)

    # It will also not work if the account or the referrer does not have a key registered with the validator
    noKeyAccount = kitchenSinkFixture.accounts[3]
    affiliates.setReferrer(affiliate, sender=noKeyAccount)
    
    cash.faucet(cost, sender=noKeyAccount)
    shareToken.buyCompleteSets(market.address, noKeyAccount, numSets, sender=noKeyAccount)
    with TokenDelta(cash, 0, affiliate):
        shareToken.sellCompleteSets(market.address, noKeyAccount, noKeyAccount, numSets, accountFingerprint, sender=noKeyAccount)

def signHash(hash, private_key):
    key = normalize_key(private_key.to_hex())
    v, r, s = ecsign(sha3("\x19Ethereum Signed Message:\n32".encode('utf-8') + hash), key)
    return zpad(bytearray_to_bytestr(int_to_32bytearray(r)), 32), zpad(bytearray_to_bytestr(int_to_32bytearray(s)), 32), v
pragma solidity 0.5.10;

import 'ROOT/external/IAffiliateValidator.sol';


contract Affiliates {
    // Maps a fingerprint to an account. Used to naievly filter out attempts at self reference
    mapping (bytes32 => address) public fingerprints;

    struct Referrer {
        address account;
        bytes32 key;
    }

    // Maps an account to the referral account. Used to apply affiliate fees on settlement.
    mapping (address => Referrer) public referrals;

    function setFingerprint(bytes32 _fingerprint) external {
        fingerprints[_fingerprint] = msg.sender;
    }

    function setReferrer(address _referrer, bytes32 _key) external {
        require(msg.sender != _referrer);

        if (referrals[msg.sender].account != address(0)) {
            return;
        }

        referrals[msg.sender].account = _referrer;
        referrals[msg.sender].key = _key;
    }

    function getFingerprintAccount(bytes32 _fingerprint) external returns (address) {
        return fingerprints[_fingerprint];
    }

    function getReferrer(address _account) external returns (address) {
        return referrals[_account].account;
    }

    function getAndValidateReferrer(address _account, IAffiliateValidator affiliateValidator) external returns (address) {
        Referrer memory _referrer = referrals[_account];
        if (_referrer.account == address(0)) {
            return _referrer.account;
        }
        if (affiliateValidator != IAffiliateValidator(0) && !affiliateValidator.isValidKey(_referrer.account, _referrer.key)) {
            return address(0);
        }
        return _referrer.account;
    }
}
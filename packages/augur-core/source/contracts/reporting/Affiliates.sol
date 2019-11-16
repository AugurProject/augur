pragma solidity 0.5.10;

import 'ROOT/external/IAffiliateValidator.sol';


contract Affiliates {
    // Maps an account to their fingerprint. Used to naievly filter out attempts at self reference
    mapping (address => bytes32) public fingerprints;

    // Maps an account to the referral account. Used to apply affiliate fees on settlement.
    mapping (address => address) public referrals;

    function setFingerprint(bytes32 _fingerprint) external {
        fingerprints[msg.sender] = _fingerprint;
    }

    function setReferrer(address _referrer) external {
        require(msg.sender != _referrer);

        if (referrals[msg.sender] != address(0)) {
            return;
        }

        referrals[msg.sender] = _referrer;
    }

    function getAccountFingerprint(address _account) external view returns (bytes32) {
        return fingerprints[_account];
    }

    function getReferrer(address _account) external view returns (address) {
        return referrals[_account];
    }

    function getAndValidateReferrer(address _account, IAffiliateValidator affiliateValidator) external view returns (address) {
        address _referrer = referrals[_account];
        if (_referrer == address(0) || _account == _referrer) {
            return address(0);
        }
        if (affiliateValidator != IAffiliateValidator(0) && !affiliateValidator.isValidReference(_account, _referrer)) {
            return address(0);
        }
        return _referrer;
    }
}
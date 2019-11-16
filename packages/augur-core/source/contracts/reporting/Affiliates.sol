pragma solidity 0.5.10;

import 'ROOT/external/IAffiliateValidator.sol';


contract Affiliates {
    // Maps an account to their fingerprint. Used to naievly filter out attempts at self reference
    mapping (address => bytes32) public fingerprints;

    // Maps an account to the referral account. Used to apply affiliate fees on settlement.
    mapping (address => address) public referrals;

    uint256 constant internal AFFILIATE_VALIDATOR_GAS = 30000;

    bytes4 constant internal AFFILIATE_VALIDATOR_SELECTOR = bytes4(keccak256("validateReference(address,address)"));

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

    function getAndValidateReferrer(address _account, IAffiliateValidator _affiliateValidator) external returns (address) {
        address _referrer = referrals[_account];
        if (_referrer == address(0) || _account == _referrer) {
            return address(0);
        }
        if (_affiliateValidator == IAffiliateValidator(0)) {
            return _referrer;
        }
        // We call and limit gas here so that a malicious market maker cannot specify a malicious affiliate validator. It will simply turn off affiliate validation
        (bool _success,) = address(_affiliateValidator).call.gas(AFFILIATE_VALIDATOR_GAS)(
            abi.encodeWithSelector(
                AFFILIATE_VALIDATOR_SELECTOR,
                _account,
                _referrer
            )
        );
        if (!_success) {
            return address(0);
        }
        return _referrer;
    }
}
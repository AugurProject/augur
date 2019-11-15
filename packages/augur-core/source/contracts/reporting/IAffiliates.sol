pragma solidity 0.5.10;

import 'ROOT/external/IAffiliateValidator.sol';


contract IAffiliates {
    function setFingerprint(bytes32 _fingerprint) external;
    function setReferrer(address _referrer, bytes32 _key) external;
    function getFingerprintAccount(bytes32 _fingerprint) external returns (address);
    function getReferrer(address _account) external returns (address);
    function getAndValidateReferrer(address _account, IAffiliateValidator affiliateValidator) external returns (address);
}
pragma solidity 0.5.10;


contract IAffiliateValidator {
    function isValidReference(address _account, address _referrer) external view returns (bool);
}
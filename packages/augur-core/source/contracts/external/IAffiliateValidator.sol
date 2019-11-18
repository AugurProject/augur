pragma solidity 0.5.10;


contract IAffiliateValidator {
    function validateReference(address _account, address _referrer) external view;
}
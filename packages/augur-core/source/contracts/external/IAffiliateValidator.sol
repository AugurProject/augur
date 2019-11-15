pragma solidity 0.5.10;


contract IAffiliateValidator {
    function isValidKey(address _account, bytes32 _key) external returns (bool);
}
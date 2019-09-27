pragma solidity 0.5.10;

contract IProxyFactory {
    function proxyRuntimeCode() public pure returns (bytes memory);
    function proxyCreationCode() public pure returns (bytes memory);
}
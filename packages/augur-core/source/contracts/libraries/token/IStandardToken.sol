pragma solidity 0.5.10;


interface IStandardToken {
    function noHooksTransfer(address recipient, uint256 amount) external returns (bool);
}
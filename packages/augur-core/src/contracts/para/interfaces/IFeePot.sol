pragma solidity 0.5.15;


interface IFeePot {
    function depositFees(uint256 _amount) external returns (bool);
}
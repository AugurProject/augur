pragma solidity 0.5.15;

interface IWETH {
    function deposit() external payable;
    function balanceOf(address owner) external view returns (uint);
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}
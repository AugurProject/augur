pragma solidity 0.5.10;


contract IGnosisSafe {
    address public masterCopy;
    function getThreshold() public view returns (uint256);
    function getOwners() public view returns (address[] memory);
}
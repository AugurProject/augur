pragma solidity 0.5.10;

contract IRepSymbol {
    function getRepSymbol(address _augur, address _universe) external view returns (string memory);
}
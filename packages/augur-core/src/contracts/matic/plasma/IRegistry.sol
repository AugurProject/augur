pragma solidity 0.5.15;

contract IRegistry {
  function getChildChainAndStateSender() public view returns(address, address);
}

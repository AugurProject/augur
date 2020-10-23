pragma solidity 0.5.15;

contract IExitCash {
  function initializeFromPredicate() external;
  function transferFrom(address _sender, address _recipient, uint256 _amount) public returns (bool);
  function balanceOf(address _account) public view returns (uint256);
  function setIsExecuting(bool executing) public;
  function faucet(address _account, uint256 _amount) public returns (bool);
}

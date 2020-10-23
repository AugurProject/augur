pragma solidity 0.5.15;

interface IStateReceiver {
  function onStateReceive(uint256 id, bytes calldata data) external;
}

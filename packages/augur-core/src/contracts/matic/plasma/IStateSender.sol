pragma solidity 0.5.15;

interface IStateSender {
  function syncState(address receiver, bytes calldata data) external;
}

pragma solidity 0.5.15;

interface IAugurPredicate {
  function trustedTransfer(address recipient, uint256 amount) external;
  function depositToFeePot(uint256 amount) external;
}

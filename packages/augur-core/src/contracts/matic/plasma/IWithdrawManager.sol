pragma solidity 0.5.15;

contract IWithdrawManager {
  function verifyInclusion(bytes calldata data, uint8 offset, bool verifyTxInclusion) external view returns (uint256 age);
  function addExitToQueue(
      address exitor,
      address childToken,
      address rootToken,
      uint256 exitAmountOrTokenId,
      bytes32 txHash,
      bool isRegularExit,
      uint256 priority)
    external;
  function addInput(uint256 exitId, uint256 age, address utxoOwner, address token) external;
}

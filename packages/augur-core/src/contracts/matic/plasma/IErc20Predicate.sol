pragma solidity 0.5.15;

contract IErc20Predicate {
  function interpretStateUpdate(bytes calldata state) external view returns (bytes memory);
  function getAddressFromTx(bytes memory txData) public pure returns (address signer, bytes32 txHash);
}

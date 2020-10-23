pragma solidity 0.5.15;

import { BytesLib } from "./BytesLib.sol";
import { RLPReader } from "./RLPReader.sol";

library ProofReader {
  using RLPReader for bytes;
  using RLPReader for RLPReader.RLPItem;

  function convertToExitPayload(bytes memory data) internal pure returns(RLPReader.RLPItem[] memory) {
    return data.toRlpItem().toList();
  }

  function convertToTx(bytes memory data) internal pure returns(RLPReader.RLPItem[] memory) {
    return data.toRlpItem().toList();
  }

  function getLogIndex(RLPReader.RLPItem[] memory payload) internal pure returns(uint256) {
    return payload[9].toUint();
  }

  /**
    @dev Receipt structred as:
    0: Status
    1: CumulativeGasUsed
    2: LogsBloom
    3: Logs - array of [address, [topics], data]
   */
  function getReceipt(RLPReader.RLPItem[] memory payload) internal pure returns(RLPReader.RLPItem[] memory) {
    return payload[6].toBytes().toRlpItem().toList();
  }

  function getLog(RLPReader.RLPItem[] memory payload) internal pure returns(RLPReader.RLPItem[] memory) {
    uint256 logIndex = getLogIndex(payload);
    RLPReader.RLPItem[] memory receipt = getReceipt(payload);
    return receipt[3].toList()[logIndex].toList();
  }

  function getLogEmitterAddress(RLPReader.RLPItem[] memory log) internal pure returns(address) {
    return RLPReader.toAddress(log[0]);
  }

  function getLogTopics(RLPReader.RLPItem[] memory log) internal pure returns(RLPReader.RLPItem[] memory) {
    return log[1].toList();
  }

  function getChallengeTxBytes(RLPReader.RLPItem[] memory payload) internal pure returns(bytes memory) {
    return payload[10].toBytes();
  }

  function getChallengeTx(RLPReader.RLPItem[] memory payload) internal pure returns(RLPReader.RLPItem[] memory) {
    return payload[10].toBytes().toRlpItem().toList();
  }

  function getTxNonce(RLPReader.RLPItem[] memory _tx) internal pure returns(uint256) {
    return _tx[0].toUint();
  }

  function getTxTo(RLPReader.RLPItem[] memory _tx) internal pure returns(address) {
    return _tx[3].toAddress();
  }

  function getTxData(RLPReader.RLPItem[] memory _tx) internal pure returns(bytes memory) {
    return _tx[5].toBytes();
  }

  function getFunctionSignature(bytes memory data) internal pure returns(bytes4) {
    return BytesLib.toBytes4(BytesLib.slice(data, 0, 4));
  }
}

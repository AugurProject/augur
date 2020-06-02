// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/gsn/v1/ECDSA.sol';

import "ROOT/gsn/v2/utils/GSNTypes.sol";
import "ROOT/gsn/v2/interfaces/ITrustedForwarder.sol";


contract TrustedForwarder is ITrustedForwarder {
    using ECDSA for bytes32;

    // Nonces of senders, used to prevent replay attacks
    mapping(address => uint256) private nonces;

    // solhint-disable-next-line max-line-length
    bytes32 public constant RELAY_REQUEST_TYPEHASH = keccak256("RelayRequest(address target,bytes encodedFunction,GasData gasData,RelayData relayData)GasData(uint256 gasLimit,uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee)RelayData(address senderAddress,uint256 senderNonce,address relayWorker,address paymaster)");

    // solhint-disable-next-line max-line-length
    bytes32 public constant CALLDATA_TYPEHASH = keccak256("GasData(uint256 gasLimit,uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee)");

    // solhint-disable-next-line max-line-length
    bytes32 public constant RELAYDATA_TYPEHASH = keccak256("RelayData(address senderAddress,uint256 senderNonce,address relayWorker,address paymaster)");

    function getNonce(address from) external view returns (uint256) {
        return nonces[from];
    }

    function verify(GSNTypes.RelayRequest memory req, bytes memory sig) public view {
        _verify(req, sig);
    }

    function verifyAndCall(GSNTypes.RelayRequest memory req, bytes memory sig)
    public
    returns (
        bool success, bytes memory ret
    ) {
        _verify(req, sig);
        _updateNonce(req);

        // solhint-disable-next-line avoid-low-level-calls
        return req.target.call.gas(req.gasData.gasLimit)(abi.encodePacked(req.encodedFunction, req.relayData.senderAddress));
    }

    function _verify(GSNTypes.RelayRequest memory req, bytes memory sig) internal view {
        _verifyNonce(req);
        _verifySig(req, sig);
    }

    function _verifyNonce(GSNTypes.RelayRequest memory req) internal view {
        require(nonces[req.relayData.senderAddress] == req.relayData.senderNonce, "nonce mismatch");
    }

    function _updateNonce(GSNTypes.RelayRequest memory req) internal {
        nonces[req.relayData.senderAddress]++;
    }

    function hash(GSNTypes.RelayRequest memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                RELAY_REQUEST_TYPEHASH,
                    req.target,
                    keccak256(req.encodedFunction),
                    hash(req.gasData),
                    hash(req.relayData)
            ));
    }

    function hash(GSNTypes.GasData memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                CALLDATA_TYPEHASH,
                req.gasLimit,
                req.gasPrice,
                req.pctRelayFee,
                req.baseRelayFee
            ));
    }

    function hash(GSNTypes.RelayData memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                RELAYDATA_TYPEHASH,
                req.senderAddress,
                req.senderNonce,
                req.relayWorker,
                req.paymaster
            ));
    }

    function getRelayMessageHash(GSNTypes.RelayRequest memory relayRequest) public view returns (bytes32) {
        bytes memory packed = abi.encodePacked("rlx:", hash(relayRequest), address(this));
        return keccak256(packed);
    }

    function _verifySig(GSNTypes.RelayRequest memory req, bytes memory sig) internal view {
        bytes32 hashedMessage = getRelayMessageHash(req);

        require(hashedMessage.toEthSignedMessageHash().recover(sig) == req.relayData.senderAddress, "Signature mismatch");
    }
}

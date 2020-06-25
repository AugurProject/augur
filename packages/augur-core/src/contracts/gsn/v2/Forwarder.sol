// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v1/ECDSA.sol";
import "ROOT/gsn/v2/utils/GsnUtils.sol";
import "ROOT/gsn/v2/interfaces/IForwarder.sol";
import "ROOT/gsn/v2/interfaces/ISignatureVerifier.sol";


contract Forwarder is IForwarder {

    using ECDSA for bytes32;

    // solhint-disable-next-line max-line-length
    bytes32 public constant RELAY_REQUEST_TYPEHASH = keccak256("RelayRequest(address target,bytes encodedFunction,GasData gasData,RelayData relayData)GasData(uint256 gasLimit,uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee)RelayData(address senderAddress,uint256 senderNonce,address relayWorker,address paymaster,address forwarder)");

    // solhint-disable-next-line max-line-length
    bytes32 public constant CALLDATA_TYPEHASH = keccak256("GasData(uint256 gasLimit,uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee)");

    // solhint-disable-next-line max-line-length
    bytes32 public constant RELAYDATA_TYPEHASH = keccak256("RelayData(address senderAddress,uint256 senderNonce,address relayWorker,address paymaster,address forwarder)");


    string public versionSM = "augur-forwarder";

    function versionForwarder() external view returns (string memory) {
        return "2.0.0-alpha.1+opengsn.forwarder.iforwarder";
    }

    // Nonces of senders, used to prevent replay attacks
    mapping(address => uint256) private nonces;

    function getNonce(address from) external view returns (uint256) {
        return nonces[from];
    }

    function verify(ISignatureVerifier.RelayRequest memory req, bytes memory sig) public view {
        _verify(req, sig);
    }

    function verifyAndCall(ISignatureVerifier.RelayRequest memory req, bytes memory sig)
    public
    {
        _verify(req, sig);
        _updateNonce(req);

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returnValue) = req.target.call.gas(req.gasData.gasLimit)(abi.encodePacked(req.encodedFunction, req.relayData.senderAddress));
        // TODO: use assembly to prevent double-wrapping of the revert reason (part of GSN-37)
        require(success, GsnUtils.getError(returnValue));
    }

    function _verify(ISignatureVerifier.RelayRequest memory req, bytes memory sig) internal view {
        _verifyNonce(req);
        _verifySig(req, sig);
    }

    function _verifyNonce(ISignatureVerifier.RelayRequest memory req) internal view {
        require(nonces[req.relayData.senderAddress] == req.relayData.senderNonce, "nonce mismatch");
    }

    function _updateNonce(ISignatureVerifier.RelayRequest memory req) internal {
        nonces[req.relayData.senderAddress]++;
    }

    function hash(ISignatureVerifier.RelayRequest memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                RELAY_REQUEST_TYPEHASH,
                    req.target,
                    keccak256(req.encodedFunction),
                    hash(req.gasData),
                    hash(req.relayData)
            ));
    }

    function hash(ISignatureVerifier.GasData memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                CALLDATA_TYPEHASH,
                req.gasLimit,
                req.gasPrice,
                req.pctRelayFee,
                req.baseRelayFee
            ));
    }

    function hash(ISignatureVerifier.RelayData memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                RELAYDATA_TYPEHASH,
                req.senderAddress,
                req.senderNonce,
                req.relayWorker,
                req.paymaster,
                req.forwarder
            ));
    }

    function getRelayMessageHash(ISignatureVerifier.RelayRequest memory relayRequest) public view returns (bytes32) {
        bytes memory packed = abi.encodePacked("rlx:", hash(relayRequest), address(this));
        return keccak256(packed);
    }

    function _verifySig(ISignatureVerifier.RelayRequest memory req, bytes memory sig) internal view {
        bytes32 hashedMessage = getRelayMessageHash(req);

        require(hashedMessage.toEthSignedMessageHash().recover(sig) == req.relayData.senderAddress, "Signature mismatch");
    }
}

// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v1/ECDSA.sol";
import "ROOT/gsn/v2/interfaces/GsnTypes.sol";
import "ROOT/gsn/v2/utils/GsnUtils.sol";
import "ROOT/gsn/v2/interfaces/IForwarder.sol";
import "ROOT/gsn/v2/interfaces/ISignatureVerifier.sol";
import "ROOT/gsn/v2/utils/GsnEip712Library.sol";


contract Forwarder is IForwarder {

    using ECDSA for bytes32;

    string public constant GENERIC_PARAMS = "address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data";

    mapping(bytes32 => bool) public typeHashes;

    // Nonces of senders, used to prevent replay attacks
    mapping(address => uint256) private nonces;

    // solhint-disable-next-line no-empty-blocks
    function() external payable {}

    function getNonce(address from) public view returns (uint256) {
        return nonces[from];
    }

    constructor() public {
        string memory requestType = string(abi.encodePacked("ForwardRequest(", GENERIC_PARAMS, ")"));
        registerRequestTypeInternal(requestType);
    }

    function verify(
        ForwardRequest memory req,
        bytes memory suffixData,
        bytes memory sig)
    public view {
        _verifyNonce(req);
        _verifySig(req, suffixData, sig);
    }

    function execute(
        ForwardRequest memory req,
        bytes32 domainSeparator,
        bytes32 requestTypeHash,
        bytes memory suffixData,
        bytes memory sig
    )
    public payable
    returns (bool success, bytes memory ret) {
        _verifyNonce(req);
        _verifySig(req, suffixData, sig);
        _updateNonce(req);

        // solhint-disable-next-line avoid-low-level-calls
        (success,ret) = req.to.call.gas(req.gas).value(req.value)(abi.encodePacked(req.data, req.from));
        if ( address(this).balance > 0 ) {
            //can't fail: req.from signed (off-chain) the request, so it must be an EOA...
            address(uint160(req.from)).transfer(address(this).balance);
        }
        return (success,ret);
    }

    function _verifyNonce(ForwardRequest memory req) internal view {
        require(nonces[req.from] == req.nonce, "nonce mismatch");
    }

    function _updateNonce(ForwardRequest memory req) internal {
        nonces[req.from]++;
    }

    function registerRequestType(string calldata typeName, string calldata typeSuffix) external {
        for (uint i = 0; i < bytes(typeName).length; i++) {
            bytes1 c = bytes(typeName)[i];
            require(c != "(" && c != ")", "invalid typename");
        }

        string memory requestType = string(abi.encodePacked(typeName, "(", GENERIC_PARAMS, ",", typeSuffix));
        registerRequestTypeInternal(requestType);
    }

    function registerRequestTypeInternal(string memory requestType) internal {
        bytes32 requestTypehash = keccak256(bytes(requestType));
        typeHashes[requestTypehash] = true;
        emit RequestTypeRegistered(requestTypehash, string(requestType));
    }

    event RequestTypeRegistered(bytes32 indexed typeHash, string typeStr);

    function getRelayMessageHash(GsnTypes.RelayRequest memory req) public pure returns (bytes32) {
        (IForwarder.ForwardRequest memory forwardRequest, bytes memory suffixData) = GsnEip712Library.splitRequest(req);
        return _getEncoded(forwardRequest, suffixData);
    }

    function _getEncoded(ForwardRequest memory relayRequest, bytes memory suffixData) internal pure returns (bytes32) {
        bytes memory packed = abi.encodePacked("rlx:", GsnEip712Library.hash(relayRequest), suffixData);
        return keccak256(packed);
    }

    function _verifySig(ForwardRequest memory req, bytes memory suffixData, bytes memory sig) public pure {
        bytes32 hashedMessage = _getEncoded(req, suffixData);

        require(hashedMessage.toEthSignedMessageHash().recover(sig) == req.from, "Signature mismatch");
    }
}

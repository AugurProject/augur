// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v2/interfaces/GsnTypes.sol";
import "ROOT/gsn/v2/interfaces/IRelayRecipient.sol";
import "ROOT/gsn/v2/Forwarder.sol";
import "ROOT/gsn/v2/utils/GsnUtils.sol";


/**
 * Bridge Library to map GSN RelayRequest into a call of a Forwarder
 */
library GsnEip712Library {

    //copied from Forwarder (can't reference string constants even from another library)
    string public constant GENERIC_PARAMS = "address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data";

    bytes public constant RELAYDATA_TYPE = "RelayData(uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee,address relayWorker,address paymaster,bytes paymasterData,uint256 clientId)";

    string public constant RELAY_REQUEST_NAME = "RelayRequest";
    string public constant RELAY_REQUEST_SUFFIX = string(abi.encodePacked("RelayData relayData)", RELAYDATA_TYPE));

    bytes public constant RELAY_REQUEST_TYPE = abi.encodePacked(RELAY_REQUEST_NAME,"(",GENERIC_PARAMS,",", RELAY_REQUEST_SUFFIX);

    bytes32 public constant RELAYDATA_TYPEHASH = keccak256(RELAYDATA_TYPE);
    bytes32 public constant RELAY_REQUEST_TYPEHASH = keccak256(RELAY_REQUEST_TYPE);

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    bytes32 public constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    function splitRequest(
        GsnTypes.RelayRequest memory req
    )
    internal
    pure
    returns (
        IForwarder.ForwardRequest memory forwardRequest,
        bytes memory suffixData
    ) {
        forwardRequest = IForwarder.ForwardRequest(
            req.request.from,
            req.request.to,
            req.request.value,
            req.request.gas,
            req.request.nonce,
            req.request.data
        );
        suffixData = abi.encode(
            hashRelayData(req.relayData));
    }

    function verifyForwarderTrusted(GsnTypes.RelayRequest memory relayRequest) internal view {
        (bool success, bytes memory ret) = relayRequest.request.to.staticcall(
            abi.encodeWithSelector(
                IRelayRecipient(address(0)).isTrustedForwarder.selector, relayRequest.relayData.forwarder
            )
        );
        require(success, "isTrustedForwarder reverted");
        require(ret.length == 32, "isTrustedForwarder returned invalid response");
        require(abi.decode(ret, (bool)), "invalid forwarder for recipient");
    }

    function verifySignature(GsnTypes.RelayRequest memory relayRequest, bytes memory signature) internal view {
        (IForwarder.ForwardRequest memory forwardRequest, bytes memory suffixData) = splitRequest(relayRequest);
        Forwarder forwarder = Forwarder(address(uint160(relayRequest.relayData.forwarder)));
        forwarder.verify(forwardRequest, suffixData, signature);
    }

    function verify(GsnTypes.RelayRequest memory relayRequest, bytes memory signature) internal view {
        verifyForwarderTrusted(relayRequest);
        verifySignature(relayRequest, signature);
    }

    function execute(GsnTypes.RelayRequest memory relayRequest, bytes memory signature) internal returns (bool, string memory) {
        (IForwarder.ForwardRequest memory forwardRequest, bytes memory suffixData) = splitRequest(relayRequest);
        bytes32 domainSeparator = domainSeparator(relayRequest.relayData.forwarder);
        (bool _success, bytes memory _ret) = IForwarder(relayRequest.relayData.forwarder).execute(forwardRequest, domainSeparator, RELAY_REQUEST_TYPEHASH, suffixData, signature);
        if (!_success) {
            return (false, GsnUtils.getError(_ret));
        }
        return (true, "");
    }

    function domainSeparator(address forwarder) internal pure returns (bytes32) {
        return hashDomain(EIP712Domain({
            name : "GSN Relayed Transaction",
            version : "2",
            chainId : getChainID(),
            verifyingContract : forwarder
            }));
    }

    function getChainID() internal pure returns (uint256 id) {
        /* solhint-disable no-inline-assembly */
        assembly {
            id := chainid()
        }
    }

    function hashDomain(EIP712Domain memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                EIP712DOMAIN_TYPEHASH,
                keccak256(bytes(req.name)),
                keccak256(bytes(req.version)),
                req.chainId,
                req.verifyingContract));
    }

    function hashRelayData(GsnTypes.RelayData memory req) internal pure returns (bytes32) {
        return keccak256(abi.encode(
                RELAYDATA_TYPEHASH,
                req.gasPrice,
                req.pctRelayFee,
                req.baseRelayFee,
                req.relayWorker,
                req.paymaster,
                keccak256(req.paymasterData),
                req.clientId
//                req.forwarder
            ));
    }

    function hash(IForwarder.ForwardRequest memory req) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            RELAY_REQUEST_TYPEHASH,
            abi.encode(
                req.from,
                req.to,
                req.value,
                req.gas,
                req.nonce,
                keccak256(req.data)
            )
        ));
    }
}
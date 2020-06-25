// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;

import "ROOT/gsn/v2/interfaces/ISignatureVerifier.sol";
pragma experimental ABIEncoderV2;

interface IForwarder {

    // verify the signature matches the request.
    //  that is, the senderAccount is the signer
    function verify(ISignatureVerifier.RelayRequest calldata req, bytes calldata sig) external view;

    // validate the signature, and execute the call.
    function verifyAndCall(ISignatureVerifier.RelayRequest calldata req, bytes calldata sig) external;

    function getNonce(address from) external view returns (uint256);

    function versionForwarder() external view returns (string memory);
}

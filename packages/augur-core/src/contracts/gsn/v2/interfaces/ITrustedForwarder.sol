// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v2/utils/GSNTypes.sol";

interface ITrustedForwarder {

    // verify the signature matches the request.
    //  that is, the senderAccount is the signer
    function verify(GSNTypes.RelayRequest calldata req, bytes calldata sig) external view;

    // validate the signature, and execute the call.
    function verifyAndCall(GSNTypes.RelayRequest calldata req, bytes calldata sig) external returns (bool success, bytes memory ret);

    function getNonce(address from) external view returns (uint256);
}

// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v2/interfaces/ISignatureVerifier.sol";
import "ROOT/gsn/v2/interfaces/IPaymaster.sol";
import "ROOT/gsn/v2/interfaces/IRelayHub.sol";
import "ROOT/gsn/v2/interfaces/IForwarder.sol";
import "ROOT/gsn/v2/utils/GsnEip712Library.sol";

/**
 * Abstract base class to be inherited by a concrete Paymaster
 * A subclass must implement:
 *  - acceptRelayedCall
 *  - preRelayedCall
 *  - postRelayedCall
 */
contract BasePaymaster is IPaymaster {

    IRelayHub internal relayHub;
    IForwarder internal trustedForwarder;

    bytes32 public domainSeparator;

    function getHubAddr() public view returns (address) {
        return address(relayHub);
    }

    // Gas stipends for acceptRelayedCall, preRelayedCall and postRelayedCall
    uint256 constant private ACCEPT_RELAYED_CALL_GAS_LIMIT = 50000;
    uint256 constant private PRE_RELAYED_CALL_GAS_LIMIT = 100000;
    uint256 constant private POST_RELAYED_CALL_GAS_LIMIT = 110000;

    function getGasLimits()
    external
    view
    returns (
        IPaymaster.GasLimits memory limits
    ) {
        return IPaymaster.GasLimits(
            ACCEPT_RELAYED_CALL_GAS_LIMIT,
            PRE_RELAYED_CALL_GAS_LIMIT,
            POST_RELAYED_CALL_GAS_LIMIT
        );
    }

    // this method must be called from acceptRelayedCall to validate that the forwarder
    // is approved by the paymaster as well and that the request is verified.
    function _verifySignature(
        GsnTypes.RelayRequest memory relayRequest,
        bytes memory signature
    )
    public
    view
    {
        require(address(trustedForwarder) == relayRequest.relayData.forwarder, "Forwarder is not trusted");
        GsnEip712Library.verify(relayRequest, signature);
    }

    /*
     * modifier to be used by recipients as access control protection for preRelayedCall & postRelayedCall
     */
    modifier relayHubOnly() {
        require(msg.sender == getHubAddr(), "Function can only be called by RelayHub");
        _;
    }

    /// check current deposit on relay hub.
    // (wanted to name it "getRelayHubDeposit()", but we use the name from IRelayRecipient...
    function getRelayHubDeposit()
    public
    view
    returns (uint) {
        return relayHub.balanceOf(address(this));
    }

    // any money moved into the paymaster is transferred as a deposit.
    // This way, we don't need to understand the RelayHub API in order to replenish
    // the paymaster.
    function() external payable {
        require(address(relayHub) != address(0), "relay hub address not set");
        relayHub.depositFor.value(msg.value)(address(this));
    }
}

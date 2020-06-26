// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/gsn/v1/ECDSA.sol";

import "ROOT/gsn/v2/utils/RLPReader.sol";
import "ROOT/gsn/v2/utils/GsnUtils.sol";
import "ROOT/gsn/v2/interfaces/IRelayHub.sol";
import "ROOT/gsn/v2/interfaces/IPenalizer.sol";


contract Penalizer is IPenalizer{

    string public versionPenalizer = "2.0.0-alpha.1+opengsn.penalizer.ipenalizer";

    using ECDSA for bytes32;

    function decodeTransaction(bytes memory rawTransaction) private pure returns (Transaction memory transaction) {
        (transaction.nonce,
        transaction.gasPrice,
        transaction.gasLimit,
        transaction.to,
        transaction.value,
        transaction.data) = RLPReader.decodeTransaction(rawTransaction);
        return transaction;

    }

    function penalizeRepeatedNonce(
        bytes memory unsignedTx1,
        bytes memory signature1,
        bytes memory unsignedTx2,
        bytes memory signature2,
        IRelayHub hub
    )
    public
    {
        // Can be called by anyone.
        // If a relay attacked the system by signing multiple transactions with the same nonce
        // (so only one is accepted), anyone can grab both transactions from the blockchain and submit them here.
        // Check whether unsignedTx1 != unsignedTx2, that both are signed by the same address,
        // and that unsignedTx1.nonce == unsignedTx2.nonce.
        // If all conditions are met, relay is considered an "offending relay".
        // The offending relay will be unregistered immediately, its stake will be forfeited and given
        // to the address who reported it (msg.sender), thus incentivizing anyone to report offending relays.
        // If reported via a relay, the forfeited stake is split between
        // msg.sender (the relay used for reporting) and the address that reported it.

        address addr1 = keccak256(abi.encodePacked(unsignedTx1)).recover(signature1);
        address addr2 = keccak256(abi.encodePacked(unsignedTx2)).recover(signature2);

        require(addr1 == addr2, "Different signer");
        require(addr1 != address(0), "ecrecover failed");

        Transaction memory decodedTx1 = decodeTransaction(unsignedTx1);
        Transaction memory decodedTx2 = decodeTransaction(unsignedTx2);

        // checking that the same nonce is used in both transaction, with both signed by the same address
        // and the actual data is different
        // note: we compare the hash of the tx to save gas over iterating both byte arrays
        require(decodedTx1.nonce == decodedTx2.nonce, "Different nonce");

        bytes memory dataToCheck1 =
        abi.encodePacked(decodedTx1.data, decodedTx1.gasLimit, decodedTx1.to, decodedTx1.value);

        bytes memory dataToCheck2 =
        abi.encodePacked(decodedTx2.data, decodedTx2.gasLimit, decodedTx2.to, decodedTx2.value);

        require(keccak256(dataToCheck1) != keccak256(dataToCheck2), "tx is equal");

        penalize(addr1, hub);
    }

    function penalizeIllegalTransaction(
        bytes memory unsignedTx,
        bytes memory signature,
        IRelayHub hub
    )
    public
    {
        Transaction memory decodedTx = decodeTransaction(unsignedTx);
        if (decodedTx.to == address(hub)) {
            bytes4 selector = GsnUtils.getMethodSig(decodedTx.data);
            bool isWrongMethodCall = selector != IRelayHub(address(0)).relayCall.selector;
            bool isGasLimitWrong = GsnUtils.getParam(decodedTx.data, 3) != decodedTx.gasLimit;
            require(
                isWrongMethodCall || isGasLimitWrong,
                "Legal relay transaction");
        }
        address relay = keccak256(abi.encodePacked(unsignedTx)).recover(signature);
        require(relay != address(0), "ecrecover failed");

        penalize(relay, hub);
    }

    function penalize(address relayWorker, IRelayHub hub) private {
        hub.penalize(relayWorker, msg.sender);
    }
}

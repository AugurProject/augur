// SPDX-License-Identifier:MIT
pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;


interface IForwarder {

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
    }

    function getNonce(address from)
    external view
    returns(uint256);

    /**
     * verify the transaction would execute.
     * validate the signatrue and the nonce of the request.
     * revert if either signature or nonce are incorrect.
     */
    function verify(
        ForwardRequest calldata forwardRequest,
        bytes calldata suffixData,
        bytes calldata signature
    ) external view;

    /**
     * execute a transaction
     * @param forwardRequest - all transaction parameters
     * @param domainSeparator - domain used when signing this request
     * @param requestTypeHash - request type used when signing this request.
     * @param suffixData - the extension data used when signing this request.
     * @param signature - signature to validate.
     *
     * the transaction is verified, and then executed.
     * the success and ret of "call" are returned.
     * This method would revert only verification errors. target errors
     * are reported using the returned "success" and ret string
     */
    function execute(
        ForwardRequest calldata forwardRequest,
        bytes32 domainSeparator,
        bytes32 requestTypeHash,
        bytes calldata suffixData,
        bytes calldata signature
    )
    external payable
    returns (bool success, bytes memory ret);

    /**
     * Register a new Request typehash.
     * @param typeName - the name of the request type.
     * @param typeSuffix - anything after the generic params can be empty string (if no extra fields are needed)
     *        if it does contain a value, then a comma is added first.
     */
    function registerRequestType(string calldata typeName, string calldata typeSuffix) external;
}
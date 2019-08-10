pragma solidity 0.5.10;

/**
 * @dev Interface for an ERC1820 implementer, as defined in the
 * [EIP](https://eips.ethereum.org/EIPS/eip-1820#interface-implementation-erc1820implementerinterface).
 * Used by contracts that will be registered as implementers in the
 * `IERC1820Registry`.
 */
interface IERC1820Implementer {
    /**
     * @dev Returns a special value (`ERC1820_ACCEPT_MAGIC`) if this contract
     * implements `interfaceHash` for `account`.
     *
     * See `IERC1820Registry.setInterfaceImplementer`.
     */
    function canImplementInterfaceForAddress(bytes32 interfaceHash, address account) external view returns (bytes32);
}
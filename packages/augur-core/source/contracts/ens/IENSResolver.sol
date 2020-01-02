pragma solidity 0.5.15;


/**
 * A generic resolver interface which includes all the functions including the ones deprecated
 */
interface IENSResolver{
    event AddrChanged(bytes32 indexed node, address a);
    event AddressChanged(bytes32 indexed node, uint coinType, bytes newAddress);
    event NameChanged(bytes32 indexed node, string name);
    event ABIChanged(bytes32 indexed node, uint256 indexed contentType);
    event PubkeyChanged(bytes32 indexed node, bytes32 x, bytes32 y);
    event TextChanged(bytes32 indexed node, string indexed indexedKey, string key);
    event ContenthashChanged(bytes32 indexed node, bytes hash);
    /* Deprecated events */
    event ContentChanged(bytes32 indexed node, bytes32 hash);

    function addr(bytes32 node) external view returns (address);
    function addr(bytes32 node, uint coinType) external view returns(bytes memory);

    function setAddr(bytes32 node, address addr) external;
    function setAddr(bytes32 node, uint coinType, bytes calldata a) external;

}
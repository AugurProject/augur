pragma solidity 0.5.15;

import "ROOT/libraries/token/ERC1155Receiver.sol";


contract ERC1155Holder is ERC1155Receiver {

    function onERC1155Received(address, address, uint256, uint256, bytes calldata) external returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
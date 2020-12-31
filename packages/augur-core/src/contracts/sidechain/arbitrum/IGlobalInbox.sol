pragma solidity 0.5.15;

interface IGlobalInbox {
    function sendL2Message(address chain, bytes calldata messageData) external;
    function depositERC20Message(address chain, address erc20, address to, uint256 value) external;
}

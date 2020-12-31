pragma solidity 0.5.15;

interface IGlobalInbox {
    function sendL2Message(address chain, bytes calldata messageData) external;
}

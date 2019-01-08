pragma solidity 0.4.24;


interface ERC777TokensSender {
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint amount,
        bytes32 userData,
        bytes32 operatorData
    ) external;
}

pragma solidity 0.4.24;


interface ERC777TokensSender {
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes32 data,
        bytes32 operatorData
    ) external;
}

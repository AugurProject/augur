pragma solidity 0.5.4;


interface ERC777TokensRecipient {
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes32 data,
        bytes32 operatorData
    ) external;
}

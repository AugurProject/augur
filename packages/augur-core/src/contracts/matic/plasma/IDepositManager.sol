pragma solidity 0.5.15;

interface IDepositManager {
    function depositBulk(
        address[] calldata _tokens,
        uint256[] calldata _amountOrTokens,
        address _user
    ) external;

    function transferAssets(
        address _token,
        address _user,
        uint256 _amountOrNFTId
    ) external;
}

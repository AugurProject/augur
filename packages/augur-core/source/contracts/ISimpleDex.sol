pragma solidity 0.5.15;

import "ROOT/libraries/token/IERC20.sol";


interface ISimpleDex {
    function token() external view returns (address);
    function cash() external view returns (IERC20);
    function tokenReserve() external view returns (uint256);
    function cashReserve() external view returns (uint256);
    function blockNumberLast() external view returns (uint256);
    function tokenPriceCumulativeLast() external view returns (uint256);

    function buyToken(address _recipient) external returns (uint256 _tokenAmount);
    function autoBuyTokenAmount(address _recipient, uint256 _tokenAmount) external returns (uint256);
    function getTokenPurchaseCost(uint256 _tokenAmount) external view returns (uint256);
    function getCashSaleProceeds(uint256 _cashAmount) external view returns (uint256);

    function publicMint(address to) external returns (uint256 liquidity);
    function publicBurn(address to) external returns (uint256 tokenAmount, uint256 cashAmount);
    function skim(address to) external;
    function sync() external;
}
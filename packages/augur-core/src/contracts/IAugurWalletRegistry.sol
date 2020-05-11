pragma solidity 0.5.15;

import 'ROOT/uniswap/interfaces/IUniswapV2Exchange.sol';
import 'ROOT/uniswap/interfaces/IWETH.sol';


interface IAugurWalletRegistry {
    function ethExchange() external returns (IUniswapV2Exchange);
    function WETH() external returns (IWETH);
    function token0IsCash() external returns (bool);
}
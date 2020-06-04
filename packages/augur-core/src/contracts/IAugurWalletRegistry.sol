pragma solidity 0.5.15;

import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/uniswap/interfaces/IWETH.sol';


interface IAugurWalletRegistry {
    function ethExchange() external returns (IUniswapV2Pair);
    function WETH() external returns (IWETH);
    function token0IsCash() external returns (bool);
}
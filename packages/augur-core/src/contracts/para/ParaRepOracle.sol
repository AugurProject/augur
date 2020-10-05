pragma solidity 0.5.15;

import 'ROOT/reporting/RepOracle.sol';


contract ParaRepOracle is RepOracle {

    function getInitialPrice(address _reputationToken) private view returns (uint256) {
        IUniverse _parentUniverse = IUniverse(IReputationToken(_reputationToken).getUniverse().getParentUniverse());
        if (_parentUniverse == IUniverse(0)) {
            address _exchangeAddress = uniswapFactory.getPair(_reputationToken, address(cash));
            if (_exchangeAddress == address(0)) {
                return 0;
            }
            IUniswapV2Pair _exchange = IUniswapV2Pair(_exchangeAddress);
            (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = _exchange.getReserves();
            if (_reserve0 == 0 || _reserve1 == 0) {
                return 0;
            }
            bool _token0IsCash = _exchange.token0() == address(cash);
            return _token0IsCash ? (_reserve0 * 10**18 / _reserve1) : (_reserve1 * 10**18 / _reserve0);
        } else {
            return repData[address(_parentUniverse.getReputationToken())].price;
        }
    }
}
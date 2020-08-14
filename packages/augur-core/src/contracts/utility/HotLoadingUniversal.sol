pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/utility/HotLoading.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


/**
 * @title Hot Loading Universal. Used for ERC20 Augur Variants
 * @notice A Utility contract for pulling market data in a single call intended for fast rendering of market presentation before full platform data can be accessed
 */
contract HotLoadingUniversal is HotLoading {
    function getMarketData(IAugur _augur, IMarket _market, IFillOrder _fillOrder, IOrders _orders) public view returns (MarketData memory _marketData) {
        _marketData = super.getMarketData(_augur, _market, _fillOrder, _orders);
        IUniverse _universe = _market.getUniverse();
        IParaUniverse _paraUniverse = IParaUniverse(IParaAugur(address(_augur)).getParaUniverse(address(_universe)));
        _marketData.openInterest = _paraUniverse.getMarketOpenInterest(_market);
        _marketData.reportingFeeDivisor = _paraUniverse.getReportingFeeDivisor();
    }
}
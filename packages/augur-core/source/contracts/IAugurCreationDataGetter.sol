pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import 'ROOT/reporting/IMarket.sol';

contract IAugurCreationDataGetter {
    struct MarketCreationData {
        string extraInfo;
        address marketCreator;
        bytes32[] outcomes;
        int256[] displayPrices;
        IMarket.MarketType marketType;
    }

    function getMarketCreationData(IMarket _market) public view returns (MarketCreationData memory);
}

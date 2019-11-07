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
    function getMarketType(IMarket _market) public view returns (IMarket.MarketType _marketType);
    function getMarketOutcomes(IMarket _market) public view returns (bytes32[] memory _outcomes);
}

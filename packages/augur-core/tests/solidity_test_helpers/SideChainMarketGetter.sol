pragma solidity 0.5.15;

import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';


contract SideChainMarketGetter {
    function isValid(address _market) external view returns (bool) {
        return true;
    }

    function isFinalized(address _market) external view returns (bool) {
        return IMarket(_market).isFinalized();
    }
    
    function isFinalizedAsInvalid(address _market) external view returns (bool) {
        return IMarket(_market).isFinalizedAsInvalid();
    }
    
    function getOwner(address _market) external view returns (address) {
        return IMarket(_market).getOwner();
    }
    
    function getCreatorFee(address _market) external view returns (uint256) {
        return IMarket(_market).getMarketCreatorSettlementFeeDivisor();
    }
    
    function getUniverse(address _market) external view returns (IUniverse) {
        return IMarket(_market).getUniverse();
    }
    
    function getNumTicks(address _market) external view returns (uint256) {
        return IMarket(_market).getNumTicks();
    }
    
    function getNumberOfOutcomes(address _market) external view returns (uint256) {
        return IMarket(_market).getNumberOfOutcomes();
    }
    
    function getWinningPayoutNumerator(address _market, uint256 _outcome) external view returns (uint256) {
        return IMarket(_market).getWinningPayoutNumerator(_outcome);
    }
    
    function getAffiliateFeeDivisor(address _market) external view returns (uint256) {
        return IMarket(_market).affiliateFeeDivisor();
    }
    
    function getOrCacheReportingFeeDivisor() external view returns (uint256) {
        return 10000;
    }
}
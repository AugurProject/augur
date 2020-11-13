pragma solidity 0.5.15;

import 'ROOT/reporting/IUniverse.sol';


interface IMarketGetter {
    function isValid(address _market) external view returns (bool);
    function isFinalized(address _market) external view returns (bool);
    function isFinalizedAsInvalid(address _market) external view returns (bool);
    function getOwner(address _market) external view returns (address);
    function getCreatorFee(address _market) external view returns (uint256);
    function getUniverse(address _market) external view returns (IUniverse);
    function getNumTicks(address _market) external view returns (uint256);
    function getNumberOfOutcomes(address _market) external view returns (uint256);
    function getWinningPayoutNumerator(address _market, uint256 _outcome) external view returns (uint256);
    function getAffiliateFeeDivisor(address _market) external view returns (uint256);
    function getOrCacheReportingFeeDivisor() external view returns (uint256);
}
pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IFeePot.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';


interface IParaUniverse {
    function getFeePot() external view returns (IFeePot);
    function getReputationToken() external view returns (IV2ReputationToken);
    function originUniverse() external view returns (IUniverse);
    function setMarketFinalized(IMarket _market, uint256 _totalSupply) external returns (bool);
    function withdraw(address _recipient, uint256 _amount, address _market) external returns (bool);
    function deposit(address _sender, uint256 _amount, address _market) external returns (bool);
    function decrementOpenInterest(uint256 _amount) external returns (bool);
    function incrementOpenInterest(uint256 _amount) external returns (bool);
    function recordMarketCreatorFees(IMarket _market, uint256 _marketCreatorFees, address _sourceAccount) external returns (bool);
    function getMarketOpenInterest(IMarket _market) external view returns (uint256);
    function getOrCacheReportingFeeDivisor() external returns (uint256);
    function getReportingFeeDivisor() external view returns (uint256);
    function setOrigin(IUniverse _originUniverse) external;
}

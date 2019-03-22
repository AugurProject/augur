pragma solidity 0.5.4;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/ICash.sol';


contract MaliciousMarket {
    IMarket private victimMarket;
    uint256 public getNumTicks = 1;

    constructor(IMarket _market) public {
        victimMarket = _market;
    }

    function getShareToken(uint256 _outcome)  public view returns (IShareToken) {
        return victimMarket.getShareToken(_outcome);
    }

    function getNumberOfOutcomes() public view returns (uint256) {
        return victimMarket.getNumberOfOutcomes();
    }

    function getUniverse() public view returns (IUniverse) {
        return victimMarket.getUniverse();
    }
}

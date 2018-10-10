pragma solidity 0.4.24;

import 'reporting/IRepPriceOracle.sol';


contract RepPriceOracle is IRepPriceOracle {
    // A rough initial estimate based on the current date (04/10/2018) 1 REP ~= .06 ETH
    uint256 private repPriceInAttoEth = 6 * 10 ** 16;

    function setRepPriceInAttoEth(uint256 _repPriceInAttoEth) external onlyOwner returns (bool) {
        repPriceInAttoEth = _repPriceInAttoEth;
        return true;
    }

    function getRepPriceInAttoEth() external view returns (uint256) {
        return repPriceInAttoEth;
    }

    function onTransferOwnership(address, address) internal returns (bool) {
        return true;
    }
}

pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';


contract MockShareTokenFactory {
    IMarket private createShareTokenMarketValue;
    uint256 private createShareTokenOutcomeValue;
    uint256 private createShareTokenCounter;
    IShareToken[] private setCreateShareTokenValue;

    function resetCreateShareToken() public {
        createShareTokenCounter = 0;
    }

    function getCreateShareTokenCounter() public returns(uint256) {
        return createShareTokenCounter;
    }

    function getCreateShareToken(uint256 _index) public returns(IShareToken) {
        return setCreateShareTokenValue[_index];
    }

    function pushCreateShareToken(IShareToken _shareToken) public {
        setCreateShareTokenValue.push(_shareToken);
    }

    function getCreateShareTokenMarketValue() public returns(IMarket) {
        return createShareTokenMarketValue;
    }

    function getCreateShareTokenOutcomeValue() public returns(uint256) {
        return createShareTokenOutcomeValue;
    }

    function createShareToken(IAugur _augur, IMarket _market, uint256 _outcome) public returns (IShareToken) {
        createShareTokenMarketValue = _market;
        createShareTokenOutcomeValue = _outcome;
        createShareTokenCounter += 1;
        return setCreateShareTokenValue[_outcome];
    }
}

pragma solidity 0.4.24;

import 'reporting/IDisputeWindow.sol';
import 'reporting/IMarket.sol';
import 'reporting/IReputationToken.sol';
import 'trading/ICash.sol';
import 'IAugur.sol';


contract MockMarketFactory {
    IMarket private setMarketValue;
    IAugur private createMarketAugurValue;
    IUniverse private createMarketUniverseValue;
    uint256 private createMarketEndTimeValue;
    uint256 private createMarketNumOutcomesValue;
    uint256 private createMarketNumTicksValue;
    uint256 private createMarketfeePerEthInWeiValue;
    address private createMarketCreatorValue;
    address private createMarketDesignatedReporterAddressValue;

    function setMarket(IMarket _market) public {
        setMarketValue = _market;
    }

    function getCreateMarketUniverseValue() public returns(IUniverse) {
        return createMarketUniverseValue;
    }

    function getCreateMarketEndTimeValue() public returns(uint256) {
        return createMarketEndTimeValue;
    }

    function getCreateMarketNumOutcomesValue() public returns(uint256) {
        return createMarketNumOutcomesValue;
    }

    function getCreateMarketNumTicksValue() public returns(uint256) {
        return createMarketNumTicksValue;
    }

    function getCreateMarketfeePerEthInWeiValue() public returns(uint256) {
        return createMarketfeePerEthInWeiValue;
    }

    function getCreateMarketCreatorValue() public returns(address) {
        return createMarketCreatorValue;
    }

    function getCreateMarketDesignatedReporterAddressValue() public returns(address) {
        return createMarketDesignatedReporterAddressValue;
    }

    function createMarket(IAugur _augur, IUniverse _universe, uint256 _endTime, uint256 _feePerEthInWei, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) public returns (IMarket _market) {
        createMarketAugurValue = _augur;
        createMarketUniverseValue = _universe;
        createMarketEndTimeValue = _endTime;
        createMarketNumOutcomesValue = _numOutcomes;
        createMarketNumTicksValue = _numTicks;
        createMarketfeePerEthInWeiValue = _feePerEthInWei;
        createMarketCreatorValue = _sender;
        createMarketDesignatedReporterAddressValue = _designatedReporterAddress;
        return setMarketValue;
    }
}

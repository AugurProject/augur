pragma solidity ^0.4.24;

import 'reporting/IMarket.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IDisputeWindow.sol';
import 'IController.sol';
import 'libraries/ITyped.sol';
import 'reporting/IReputationToken.sol';
import 'libraries/Initializable.sol';
import 'TEST/MockVariableSupplyToken.sol';


contract MockDisputeWindow is Initializable, MockVariableSupplyToken, IDisputeWindow {
    bool private setMigrateMarketInFromSiblingValue;
    bool private setMigrateMarketInFromNiblingValue;
    bool private setRemoveMarketValue;
    bool private setUpdateMarketPhaseValue;
    IUniverse private universe;
    IReputationToken private setReputationTokenValue;
    uint256 private setStartTimeValue;
    uint256 private setEndTimeValue;
    uint256 private setNumMarketsValue;
    uint256 private setNumInvalidMarketsValue;
    uint256 private setNumIncorrectDesignatedReportMarketsValue;
    IDisputeWindow private setNextDisputeWindowValue;
    IDisputeWindow private setPreviousDisputeWindowValue;
    uint256 private setNumDesignatedReportNoShowsValue;
    bool private setAllMarketsFinalizedValue;
    uint256 private setCollectDisputeWindowReportingFeesValue;
    bool private setMigrateFeesDueToForkValue;
    bool private setIsContainerForMarketValue;
    bool private setIsForkingMarketFinalizedValue;
    bool private setIsDisputeActiveValue;
    IMarket private market;
    IUniverse private initializeUniverseValue;
    uint256 private initializeDisputeWindowIdValue;
    address private collectReporterAddress;
    bool private collectForgoFees;
    bool private setIsReportingActiveValue;
    bool private setIsActiveValue;
    bool private setIsOverValue;
    bool private setIsContainerForDisputeWindowValue;
    bool private setIncreaseTotalStakeValue;
    bool private setIncreaseTotalWinningStakeValue;
    bool private setNoteDesignatedReportValue;

    /*
    * setters to feed the getters and impl of IDisputeWindow
    */
    function reset() public {
        setUpdateMarketPhaseValue = false;
        setNoteDesignatedReportValue = false;
        setIncreaseTotalStakeValue = false;
        setRemoveMarketValue = false;
        setMigrateMarketInFromSiblingValue = false;
        setMigrateMarketInFromNiblingValue = false;
    }

    function getMigrateMarketInFromSiblingCalled() public returns(bool) {
        return setMigrateMarketInFromSiblingValue;
    }

    function getMigrateMarketInFromNiblingCalled() public returns(bool) {
        return setMigrateMarketInFromNiblingValue;
    }

    function getRemoveMarketCalled() public returns (bool) {
        return setRemoveMarketValue;
    }

    function getUpdateMarketPhaseCalled() public returns(bool) {
        return setUpdateMarketPhaseValue;
    }

    function getNoteDesignatedReport() public returns(bool) {
        return setNoteDesignatedReportValue;
    }

    function setUniverse(IUniverse _universe) public {
        universe = _universe;
    }

    function setReputationToken(IReputationToken _setReputationTokenValue) public {
        setReputationTokenValue = _setReputationTokenValue;
    }

    function setStartTime(uint256 _setStartTimeValue) public {
        setStartTimeValue = _setStartTimeValue;
    }

    function setEndTime(uint256 _setEndTimeValue) public {
        setEndTimeValue = _setEndTimeValue;
    }

    function setNumMarkets(uint256 _setNumMarketsValue) public {
        setNumMarketsValue = _setNumMarketsValue;
    }

    function setNumInvalidMarkets(uint256 _setNumInvalidMarketsValue) public {
        setNumInvalidMarketsValue = _setNumInvalidMarketsValue;
    }

    function setNumIncorrectDesignatedReportMarkets(uint256 _setNumIncorrectDesignatedReportMarketsValue) public {
        setNumIncorrectDesignatedReportMarketsValue = _setNumIncorrectDesignatedReportMarketsValue;
    }

    function setNextDisputeWindow(IDisputeWindow _setNextDisputeWindowValue) public {
        setNextDisputeWindowValue = _setNextDisputeWindowValue;
    }

    function setPreviousDisputeWindow(IDisputeWindow _setPreviousDisputeWindowValue) public {
        setPreviousDisputeWindowValue = _setPreviousDisputeWindowValue;
    }

    function setNumDesignatedReportNoShows(uint256 _setNumDesignatedReportNoShowsValue) public {
        setNumDesignatedReportNoShowsValue = _setNumDesignatedReportNoShowsValue;
    }

    function setAllMarketsFinalized(bool _setAllMarketsFinalizedValue) public {
        setAllMarketsFinalizedValue = _setAllMarketsFinalizedValue;
    }

    function setCollectDisputeWindowReportingFees(uint256 _setCollectDisputeWindowReportingFeesValue) public {
        setCollectDisputeWindowReportingFeesValue = _setCollectDisputeWindowReportingFeesValue;
    }

    function setMigrateFeesDueToFork(bool _setMigrateFeesDueToForkValue) public {
        setMigrateFeesDueToForkValue = _setMigrateFeesDueToForkValue;
    }

    function setIsContainerForMarket(bool _setIsContainerForMarketValue) public {
        setIsContainerForMarketValue = _setIsContainerForMarketValue;
    }

    function setIsForkingMarketFinalized(bool _setIsForkingMarketFinalizedValue) public {
        setIsForkingMarketFinalizedValue = _setIsForkingMarketFinalizedValue;
    }

    function setIsDisputeActive(bool _setIsDisputeActiveValue) public {
        setIsDisputeActiveValue = _setIsDisputeActiveValue;
    }

    function setCreateMarket(IMarket _market) public {
        market = _market;
    }

    function setIsOver(bool _isOver) public {
        setIsOverValue = _isOver;
    }

    function setIsReportingActive(bool _isReportingActive) public {
        setIsReportingActiveValue = _isReportingActive;
    }

    function setIsActive(bool _isActive) public {
        setIsActiveValue = _isActive;
    }

    function setIsContainerForDisputeWindow(bool _isContainerForDisputeWindow) public {
        setIsContainerForDisputeWindowValue = _isContainerForDisputeWindow;
    }

    function getIncreaseTotalStakeCalled() public returns(bool) {
        return setIncreaseTotalStakeValue;
    }

    function setIncreaseTotalWinningStake(bool _setIncreaseTotalWinningStakeValue) public {
        setIncreaseTotalWinningStakeValue = _setIncreaseTotalWinningStakeValue;
    }

    function getInitializeUniverseValue() public view returns(IUniverse) {
        return initializeUniverseValue;
    }

    function getinitializeDisputeWindowIdValue() public returns(uint256) {
        return initializeDisputeWindowIdValue;
    }

    function getCollectReporterAddress() public returns(address) {
        return collectReporterAddress;
    }

    function callTrustedDisputeWindowTransfer(IReputationToken _reputationToken, address _source, address _destination, uint256 _attotokens) public returns (bool) {
        return _reputationToken.trustedDisputeWindowTransfer(_source, _destination, _attotokens);
    }

    /*
    * Impl of IDisputeWindow and ITyped
     */
    function getTypeName() public afterInitialized view returns (bytes32) {
        return "DisputeWindow";
    }

    function initialize(IUniverse _universe, uint256 _disputeWindowId) public returns (bool) {
        endInitialization();
        initializeUniverseValue = _universe;
        initializeDisputeWindowIdValue = _disputeWindowId;
        return true;
    }

    function createMarket(uint256 _endTime, uint256 _feePerEthInWei, ICash _denominationToken, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) public payable returns (IMarket _newMarket) {
        return market;
    }

    function migrateMarketInFromSibling() public returns (bool) {
        setMigrateMarketInFromSiblingValue = true;
        return true;
    }

    function migrateMarketInFromNibling() public returns (bool) {
        setMigrateMarketInFromNiblingValue = true;
        return true;
    }

    function removeMarket() public returns (bool) {
        setRemoveMarketValue = true;
        return true;
    }

    function noteDesignatedReport() public returns (bool) {
        setNoteDesignatedReportValue = true;
        return true;
    }

    function updateMarketPhase() public returns (bool) {
        setUpdateMarketPhaseValue = true;
        return true;
    }

    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    function getReputationToken() public view returns (IReputationToken) {
        return setReputationTokenValue;
    }

    function getStartTime() public view returns (uint256) {
        return setStartTimeValue;
    }

    function getEndTime() public view returns (uint256) {
        return setEndTimeValue;
    }

    function getNumMarkets() public view returns (uint256) {
        return setNumMarketsValue;
    }

    function getNumInvalidMarkets() public view returns (uint256) {
        return setNumInvalidMarketsValue;
    }

    function getNumIncorrectDesignatedReportMarkets() public view returns (uint256) {
        return setNumIncorrectDesignatedReportMarketsValue;
    }

    function getOrCreateNextDisputeWindow() public returns (IDisputeWindow) {
        return setNextDisputeWindowValue;
    }

    function getOrCreatePreviousDisputeWindow() public returns (IDisputeWindow) {
        return setPreviousDisputeWindowValue;
    }

    function getNumDesignatedReportNoShows() public view returns (uint256) {
        return setNumDesignatedReportNoShowsValue;
    }

    function allMarketsFinalized() public view returns (bool) {
        return setAllMarketsFinalizedValue;
    }

    function migrateFeesDueToFork() public returns (bool) {
        return setMigrateFeesDueToForkValue;
    }

    function isContainerForMarket(IMarket _shadyTarget) public view returns (bool) {
        return setIsContainerForMarketValue;
    }

    function isDisputeActive() public view returns (bool) {
        return setIsDisputeActiveValue;
    }

    function isReportingActive() public view returns (bool) {
        return setIsReportingActiveValue;
    }

    function isActive() public view returns (bool) {
        return setIsActiveValue;
    }

    function isOver() public view returns (bool) {
        return setIsOverValue;
    }

    function isContainerForDisputeWindow(IDisputeWindow _shadyTarget) public view returns (bool) {
        return setIsContainerForDisputeWindowValue;
    }

    function increaseTotalStake(uint256 _amount) public returns (bool) {
        setIncreaseTotalStakeValue = true;
    }

    function increaseTotalWinningStake(uint256 _amount) public returns (bool) {
        return setIncreaseTotalWinningStakeValue;
    }

    function noteInitialReportingGasPrice() public returns (bool) {
        return true;
    }

    function onMarketFinalized() public returns (bool) {
        return true;
    }

    function buy(uint256 _attotokens) public returns (bool) {
        return true;
    }

    function redeem(address _sender) public returns (bool) {
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        return true;
    }

    function redeemForReportingParticipant() public returns (bool) {
        return true;
    }

    function getController() public view returns (IController) {
        return IController(0);
    }

    function setController(IController _controller) public returns(bool) {
        return true;
    }

    function trustedUniverseBuy(address _buyer, uint256 _attotokens) public returns (bool) {
        return true;
    }
}

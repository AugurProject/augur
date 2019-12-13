pragma solidity ^0.5.10;

import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'TEST/MockVariableSupplyToken.sol';


contract MockReputationToken is ITyped, Initializable, MockVariableSupplyToken, IReputationToken {
    using SafeMathUint256 for uint256;

    bool private setMigrateOutValue;
    bool private setMigrateInValue;
    bool private setTrustedTransferValue;
    IUniverse private setUniverseValue;
    IReputationToken private setTopMigrationDestinationValue;
    IReputationToken private migrateOutDestinationValue;
    address private migrateOutReporterValue;
    uint256 private migrateOutAttoTokens;
    bool private setMigrateFromLegacyReputationTokenValue;
    IUniverse private initializeUniverseValue;
    address private trustedTransferSourceValue;
    address private trustedTransferDestinationValue;
    uint256 private trustedTransferAttotokensValue;
    address private migrateInReporterValue;
    uint256 private migrateInAttoTokensValue;
    bool private migrateInBonusIfInForkWindowValue;

    /*
    * setters to feed the getters and impl of IUniverse
    */
    function reset() public {
        trustedTransferSourceValue = address(0);
        trustedTransferDestinationValue = address(0);
        trustedTransferAttotokensValue = 0;
        migrateInReporterValue = address(0);
        migrateInAttoTokensValue = 0;
        migrateInBonusIfInForkWindowValue = false;
    }

    function setMigrateOut(bool _setMigrateOutValue) public {
        setMigrateOutValue = _setMigrateOutValue;
    }

    function setMigrateIn(bool _setMigrateInValue) public {
        setMigrateInValue = _setMigrateInValue;
    }

    function setTrustedCashTransfer(bool _setTrustedTransferValue) public {
        setTrustedTransferValue = _setTrustedTransferValue;
    }

    function setUniverse(IUniverse _setUniverseValue) public {
        setUniverseValue = _setUniverseValue;
    }

    function setTopMigrationDestination(IReputationToken _setTopMigrationDestinationValue) public {
        setTopMigrationDestinationValue = _setTopMigrationDestinationValue;
    }

    function setMigrateFromLegacyReputationToken(bool _setMigrateFromLegacyReputationTokenValue) public {
        setMigrateFromLegacyReputationTokenValue = _setMigrateFromLegacyReputationTokenValue;
    }

    function setInitializeUniverseValue() public returns(IUniverse) {
        return initializeUniverseValue;
    }

    function getTrustedTransferSourceValue() public returns(address) {
        return trustedTransferSourceValue;
    }

    function getTrustedTransferDestinationValue() public returns(address) {
        return trustedTransferDestinationValue;
    }

    function getTrustedTransferAttotokensValue() public returns(uint256) {
        return trustedTransferAttotokensValue;
    }

    function getMigrateOutDestinationValue() public view returns(IReputationToken) {
        return migrateOutDestinationValue;
    }

    function getMigrateOutReporterValue() public returns(address) {
        return migrateOutReporterValue;
    }

    function getMigrateOutAttoTokens() public returns(uint256) {
        return migrateOutAttoTokens;
    }

    function getMigrateInReporterValue() public returns(address) {
        return migrateInReporterValue;
    }

    function getMigrateInAttoTokensValue() public returns(uint256) {
        return migrateInAttoTokensValue;
    }

    function getMigrateInBonusIfInForkWindowValue() public returns(bool) {
        return migrateInBonusIfInForkWindowValue;
    }

    function callMigrateIn(IReputationToken _reputationToken, address _reporter, uint256 _attotokens) public returns (bool) {
        return _reputationToken.migrateIn(_reporter, _attotokens);
    }

    /*
    * Impl of IReputationToken and ITyped
     */
    function getTypeName() public view returns (bytes32) {
        return "ReputationToken";
    }

    function initialize(IUniverse _universe) public returns (bool) {
        endInitialization();
        initializeUniverseValue = _universe;
        return true;
    }

    function migrateOut(IReputationToken _destination, uint256 _attotokens) public returns (bool) {
        migrateOutDestinationValue = _destination;
        migrateOutAttoTokens = _attotokens;
        return setMigrateOutValue;
    }

    function migrateIn(address _reporter, uint256 _attotokens) public returns (bool) {
        migrateInReporterValue = _reporter;
        migrateInAttoTokensValue = _attotokens;
        return setMigrateInValue;
    }

    function trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        trustedTransferSourceValue = _source;
        trustedTransferDestinationValue = _destination;
        trustedTransferAttotokensValue = _attotokens;
        transfer(_destination, _attotokens);
        return setTrustedTransferValue;
    }

    function trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        trustedTransferSourceValue = _source;
        trustedTransferDestinationValue = _destination;
        trustedTransferAttotokensValue = _attotokens;
        return setTrustedTransferValue;
    }

    function trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        trustedTransferSourceValue = _source;
        trustedTransferDestinationValue = _destination;
        trustedTransferAttotokensValue = _attotokens;
        return setTrustedTransferValue;
    }

    function getUniverse() public view returns (IUniverse) {
        return setUniverseValue;
    }

    function migrateFromLegacyReputationToken() public returns (bool) {
        return setMigrateFromLegacyReputationTokenValue;
    }

    function mintForDisputeCrowdsourcer(uint256 _amountMigrated) public returns (bool) {
        return true;
    }

    function trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        return true;
    }

    function mintForReportingParticipant(uint256 _amountMigrated) public returns (bool) {
        return true;
    }

    function getTotalMigrated() public view returns (uint256) {
        return 0;
    }

    function getTotalTheoreticalSupply() public view returns (uint256) {
        return 0;
    }

    function trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        return true;
    }

    function mintForAuction(uint256 _amountToMint) public returns (bool) {
        return true;
    }

    function burnForAuction(uint256 _amountToMint) public returns (bool) {
        return true;
    }
}

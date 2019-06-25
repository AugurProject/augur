pragma solidity 0.5.4;

import 'ROOT/libraries/IERC1820Registry.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract ReputationToken is ITyped, VariableSupplyToken, IV2ReputationToken {
    using SafeMathUint256 for uint256;

    string constant public name = "Reputation";
    string constant public symbol = "REP";
    IUniverse internal universe;
    IUniverse internal parentUniverse;
    uint256 internal totalMigrated;
    IERC20 public legacyRepToken;
    IAugur public augur;

    constructor(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse, address _erc1820RegistryAddress) public {
        require(_universe != IUniverse(0));
        augur = _augur;
        universe = _universe;
        parentUniverse = _parentUniverse;
        legacyRepToken = IERC20(augur.lookup("LegacyReputationToken"));
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    function migrateOutByPayout(uint256[] memory _payoutNumerators, uint256 _attotokens) public returns (bool) {
        require(_attotokens > 0);
        IUniverse _destinationUniverse = universe.createChildUniverse(_payoutNumerators);
        IReputationToken _destination = _destinationUniverse.getReputationToken();
        burn(msg.sender, _attotokens);
        _destination.migrateIn(msg.sender, _attotokens);
        return true;
    }

    function migrateOut(IReputationToken _destination, uint256 _attotokens) public returns (bool) {
        require(_attotokens > 0);
        assertReputationTokenIsLegitSibling(_destination);
        burn(msg.sender, _attotokens);
        _destination.migrateIn(msg.sender, _attotokens);
        return true;
    }

    function migrateIn(address _reporter, uint256 _attotokens) public returns (bool) {
        IUniverse _parentUniverse = universe.getParentUniverse();
        require(ReputationToken(msg.sender) == _parentUniverse.getReputationToken());
        require(augur.getTimestamp() < _parentUniverse.getForkEndTime());
        mint(_reporter, _attotokens);
        totalMigrated += _attotokens;
        // Update the fork tenative winner and finalize if we can
        if (!_parentUniverse.getForkingMarket().isFinalized()) {
            _parentUniverse.updateTentativeWinningChildUniverse(universe.getParentPayoutDistributionHash());
        }
        return true;
    }

    function mintForReportingParticipant(uint256 _amountMigrated) public returns (bool) {
        IUniverse _parentUniverse = universe.getParentUniverse();
        IReportingParticipant _reportingParticipant = IReportingParticipant(msg.sender);
        require(_parentUniverse.isContainerForReportingParticipant(_reportingParticipant));
        uint256 _bonus = _amountMigrated.mul(2) / 5;
        mint(address(_reportingParticipant), _bonus);
        return true;
    }

    function burnForMarket(uint256 _amountToBurn) public returns (bool) {
        require(universe.isContainerForMarket(IMarket(msg.sender)));
        burn(msg.sender, _amountToBurn);
        return true;
    }

    function transfer(address _to, uint _value) public returns (bool) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint _value) public returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    function trustedUniverseTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        require(IUniverse(msg.sender) == universe);
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function trustedMarketTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        require(universe.isContainerForMarket(IMarket(msg.sender)));
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function trustedReportingParticipantTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        require(universe.isContainerForReportingParticipant(IReportingParticipant(msg.sender)));
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function trustedDisputeWindowTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool) {
        require(universe.isContainerForDisputeWindow(IDisputeWindow(msg.sender)));
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function assertReputationTokenIsLegitSibling(IReputationToken _shadyReputationToken) private view returns (bool) {
        IUniverse _shadyUniverse = _shadyReputationToken.getUniverse();
        require(universe.isParentOf(_shadyUniverse));
        IUniverse _legitUniverse = _shadyUniverse;
        require(_legitUniverse.getReputationToken() == _shadyReputationToken);
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "ReputationToken";
    }

    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    function getTotalMigrated() public view returns (uint256) {
        return totalMigrated;
    }

    function getLegacyRepToken() public view returns (IERC20) {
        return legacyRepToken;
    }

    function getTotalTheoreticalSupply() public view returns (uint256) {
        if (parentUniverse == IUniverse(0)) {
            return Reporting.getInitialREPSupply();
        } else if (augur.getTimestamp() >= parentUniverse.getForkEndTime()) {
            return totalSupply();
        } else {
            return totalSupply() + parentUniverse.getReputationToken().totalSupply();
        }
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logReputationTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logReputationTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logReputationTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function migrateFromLegacyReputationToken() public returns (bool) {
        require(parentUniverse == IUniverse(0));
        uint256 _legacyBalance = legacyRepToken.balanceOf(msg.sender);
        require(legacyRepToken.transferFrom(msg.sender, address(1), _legacyBalance));
        mint(msg.sender, _legacyBalance);
        return true;
    }
}

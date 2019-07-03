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


/**
 * @title Reputation Token
 * @notice The Reputation Token for a particular universe
 */
contract ReputationToken is VariableSupplyToken, IV2ReputationToken {
    using SafeMathUint256 for uint256;

    string constant public name = "Reputation";
    string constant public symbol = "REP";
    IUniverse internal universe;
    IUniverse internal parentUniverse;
    uint256 internal totalMigrated;
    IERC20 public legacyRepToken;
    IAugur public augur;

    constructor(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse, address _erc1820RegistryAddress) public {
        augur = _augur;
        universe = _universe;
        parentUniverse = _parentUniverse;
        legacyRepToken = IERC20(augur.lookup("LegacyReputationToken"));
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    /**
     * @notice Migrate to a Child Universe by indicating the Market payout associated with it
     * @param _payoutNumerators The array of payouts for the market associated with the desired universe
     * @param _attotokens The amount of tokens to migrate
     * @return Bool True
     */
    function migrateOutByPayout(uint256[] memory _payoutNumerators, uint256 _attotokens) public returns (bool) {
        require(_attotokens > 0);
        IUniverse _destinationUniverse = universe.createChildUniverse(_payoutNumerators);
        IReputationToken _destination = _destinationUniverse.getReputationToken();
        burn(msg.sender, _attotokens);
        _destination.migrateIn(msg.sender, _attotokens);
        return true;
    }

    function migrateIn(address _reporter, uint256 _attotokens) public returns (bool) {
        IUniverse _parentUniverse = universe.getParentUniverse();
        require(ReputationToken(msg.sender) == _parentUniverse.getReputationToken());
        require(augur.getTimestamp() < _parentUniverse.getForkEndTime(), "ReputationToken.migrateIn: Cannot migrate after fork end");
        mint(_reporter, _attotokens);
        totalMigrated += _attotokens;
        // Update the fork tentative winner and finalize if we can
        if (!_parentUniverse.getForkingMarket().isFinalized()) {
            _parentUniverse.updateTentativeWinningChildUniverse(universe.getParentPayoutDistributionHash());
        }
        return true;
    }

    function mintForReportingParticipant(uint256 _amountMigrated) public returns (bool) {
        IUniverse _parentUniverse = universe.getParentUniverse();
        IReportingParticipant _reportingParticipant = IReportingParticipant(msg.sender);
        require(_parentUniverse.isContainerForReportingParticipant(_reportingParticipant));
        // simulate a 40% ROI which would have occured during a normal dispute had this participant's outcome won the dispute
        uint256 _bonus = _amountMigrated.mul(2) / 5;
        mint(address(_reportingParticipant), _bonus);
        return true;
    }

    function mintForUniverse(uint256 _amountToMint, address _target) public returns (bool) {
        require(universe == IUniverse(msg.sender));
        mint(_target, _amountToMint);
        return true;
    }

    function burnForMarket(uint256 _amountToBurn) public returns (bool) {
        require(universe.isContainerForMarket(IMarket(msg.sender)));
        burn(msg.sender, _amountToBurn);
        return true;
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

    function assertReputationTokenIsLegitSibling(IReputationToken _shadyReputationToken) private view {
        IUniverse _universe = _shadyReputationToken.getUniverse();
        require(universe.isParentOf(_universe));
        require(_universe.getReputationToken() == _shadyReputationToken);
    }

    /**
     * @return The universe associated with this Reputation Token
     */
    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    /**
     * @return The total amount of parent REP migrated into this version of REP
     */
    function getTotalMigrated() public view returns (uint256) {
        return totalMigrated;
    }

    /**
     * @return The V1 Rep token
     */
    function getLegacyRepToken() public view returns (IERC20) {
        return legacyRepToken;
    }

    /**
     * @return The maximum possible total supply for this version of REP.
     */
    function getTotalTheoreticalSupply() public view returns (uint256) {
        if (parentUniverse == IUniverse(0)) {
            return Reporting.getInitialREPSupply().max(totalSupply());
        } else if (augur.getTimestamp() >= parentUniverse.getForkEndTime()) {
            return totalSupply();
        } else {
            return totalSupply() + parentUniverse.getReputationToken().totalSupply();
        }
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
        augur.logReputationTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
    }

    function onMint(address _target, uint256 _amount) internal {
        augur.logReputationTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
    }

    function onBurn(address _target, uint256 _amount) internal {
        augur.logReputationTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
    }

    /**
     * @notice Migrate V1 REP to V2
     * @dev This can only be done for the Genesis Universe in V2. If a fork occurs and the window ends V1 REP is stuck in V1 forever
     * @return Bool True
     */
    function migrateFromLegacyReputationToken() public returns (bool) {
        require(parentUniverse == IUniverse(0));
        uint256 _legacyBalance = legacyRepToken.balanceOf(msg.sender);
        require(legacyRepToken.transferFrom(msg.sender, address(1), _legacyBalance));
        mint(msg.sender, _legacyBalance);
        return true;
    }
}

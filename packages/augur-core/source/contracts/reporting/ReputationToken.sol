pragma solidity 0.5.10;

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
import 'ROOT/libraries/math/UintToString.sol';
import 'ROOT/IAugurCreationDataGetter.sol';


/**
 * @title Reputation Token
 * @notice The Reputation Token for a particular universe
 */
contract ReputationToken is VariableSupplyToken, IV2ReputationToken {
    using SafeMathUint256 for uint256;
    using UintToString for uint;

    string constant public name = "Reputation";
    IUniverse internal universe;
    IUniverse internal parentUniverse;
    uint256 internal totalMigrated;
    IERC20 public legacyRepToken;
    IAugur public augur;
    address public warpSync;

    constructor(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse, address _erc1820RegistryAddress) public {
        augur = _augur;
        universe = _universe;
        parentUniverse = _parentUniverse;
        warpSync = _augur.lookup("WarpSync");
        legacyRepToken = IERC20(augur.lookup("LegacyReputationToken"));
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    function symbol() public view returns (string memory) {
        if (parentUniverse != IUniverse(0)) {
            uint256 _forkIndex = augur.getUniverseForkIndex(parentUniverse);
            IMarket _forkingMarket = parentUniverse.getForkingMarket();
            uint256 _numTicks = _forkingMarket.getNumTicks();
            uint256[] memory _payoutNumerators = universe.getPayoutNumerators();
            if (_payoutNumerators[0] != 0) {
                return string(abi.encodePacked("REPv2", "_", _payoutNumerators[0] == _numTicks ? "INVALID" : "MALFORMED", "_", _forkIndex.uint2str()));
            }
            IMarket.MarketType _marketType = IAugurCreationDataGetter(address(augur)).getMarketType(_forkingMarket);
            string memory _outcome = "YES";
            if (_marketType == IMarket.MarketType.YES_NO) {
                if (_payoutNumerators[1] == _numTicks) {
                    _outcome = "NO";
                } else if (_payoutNumerators[1] != _numTicks) {
                    _outcome = "MALFORMED";
                }
            } else if (_marketType == IMarket.MarketType.CATEGORICAL) {
                uint256 _numOutcomes = _forkingMarket.getNumberOfOutcomes();
                bytes32[] memory _outcomes = IAugurCreationDataGetter(address(augur)).getMarketOutcomes(_forkingMarket);
                for (uint256 _i = 1; _i < _numOutcomes; _i++) {
                    if (_payoutNumerators[_i] != _numTicks) {
                        _outcome = "MALFORMED";
                    } else if (_payoutNumerators[_i] != 0) {
                        bytes memory _bytesArray = new bytes(32);
                        for (uint256 _j = 0; _j < 32; _j++) {
                            _bytesArray[_j] = _outcomes[_i][_j];
                        }
                        _outcome = string(_bytesArray);
                        _i = _numOutcomes;
                    }
                }
            } else {
                _outcome = _payoutNumerators[2].uint2str();
            }

            return string(abi.encodePacked("REPv2", "_", _outcome, "_", _forkIndex.uint2str()));
        }
        return "REPv2";
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
        require(augur.getTimestamp() < _parentUniverse.getForkEndTime());
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

    function mintForWarpSync(uint256 _amountToMint, address _target) public returns (bool) {
        require(warpSync == msg.sender);
        mint(_target, _amountToMint);
        universe.updateForkValues();
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
        uint256 _totalSupply = totalSupply();
        if (parentUniverse == IUniverse(0)) {
            return Reporting.getInitialREPSupply().max(_totalSupply);
        } else if (augur.getTimestamp() >= parentUniverse.getForkEndTime()) {
            return _totalSupply;
        } else {
            return _totalSupply + parentUniverse.getReputationToken().totalSupply();
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

pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverseFactory.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/Ownable.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/IAugurMarketDataGetter.sol';
import 'ROOT/IAugurCreationDataGetter.sol';
import 'ROOT/para/interfaces/IOINexus.sol';


contract ParaAugur is IParaAugur, IAugurCreationDataGetter, Ownable {
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 timestamp, address para);
    event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 fees, uint256 timestamp, address para);
    event TradingProceedsClaimed(address indexed universe, address indexed sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp, address para);
    event MarketOIChanged(address indexed universe, address indexed market, uint256 marketOI, address para);
    event ReportingFeeChanged(address indexed universe, uint256 reportingFee, address para);
    event ShareTokenBalanceChanged(address indexed universe, address indexed account, address indexed market, uint256 outcome, uint256 balance, address para);

    event RegisterContract(address contractAddress, bytes32 key);
    event FinishDeployment();

    mapping(bytes32 => address) private registry;

    mapping(address => bool) public universes;

    address private constant NULL_ADDRESS = address(0);
    uint256 private constant MAX_NUM_TICKS = 2 ** 256 - 2;

    IAugur public augur;
    ICash public cash;
    IParaShareToken public shareToken;
    IParaUniverseFactory public paraUniverseFactory;
    IOINexus public OINexus;

    constructor(IAugur _augur) public {
        owner = msg.sender;
        augur = _augur;
    }

    //
    // Registry
    //

    function registerContract(bytes32 _key, address _address) external onlyOwner returns (bool) {
        require(registry[_key] == address(0), "Augur.registerContract: key has already been used in registry");
        require(_address.exists());
        registry[_key] = _address;
        if (_key == "Cash") {
            cash = ICash(_address);
        } else if (_key == "ShareToken") {
            shareToken = IParaShareToken(_address);
        } else if (_key == "ParaUniverseFactory") {
            paraUniverseFactory = IParaUniverseFactory(_address);
        } else if (_key == "OINexus") {
            OINexus = IOINexus(_address);
        }
        emit RegisterContract(_address, _key);
        return true;
    }

    /**
     * @notice Find the contract address for a particular key
     * @param _key The key to lookup
     * @return the address of the registered contract if one exists for the given key
     */
    function lookup(bytes32 _key) external view returns (address) {
        if (_key == "ShareToken" || _key == "Cash" || _key == "ParaRepOracle" || _key == "FeePotFactory" || _key == "ParaUniverseFactory" || _key == "ParaOICashFactory" || _key == "OINexus" || _key == "ParaOICash") {
            return registry[_key];
        }
        return augur.lookup(_key);
    }

    function finishDeployment() external onlyOwner returns (bool) {
        owner = address(1);
        emit FinishDeployment();
        return true;
    }

    function genesisUniverse() public view returns (address) {
        IUniverse _universe = augur.genesisUniverse();
        return getParaUniverse[address(_universe)];
    }

    function isKnownUniverse(IUniverse _universe) public view returns (bool) {
        return augur.isKnownUniverse(_universe);
    }

    function generateParaUniverse(IUniverse _universe) external returns (IParaUniverse) {
        require(isKnownUniverse(_universe));
        require(getParaUniverse[address(_universe)] == NULL_ADDRESS);
        IUniverse _parentUniverse = IUniverse(_universe.getParentUniverse());
        // If this is a child universe:
        if (_parentUniverse != IUniverse(0)) {
            // Disallow creation until the fork is complete (Done implicitly by asking for the winner)
            IUniverse _winningChildUniverse = _parentUniverse.getWinningChildUniverse();
            // If the child is the winner simply point to the parent universe. This lets trading continue for markets in either universe. Also have the universe ETH instance point to the correct origin and create a new FeePot for it as well as direct OICash to approve that new pot
            if (_universe == _winningChildUniverse) {
                IParaUniverse _paraUniverse = IParaUniverse(getParaUniverse[address(_parentUniverse)]);
                getParaUniverse[address(_universe)] = address(_paraUniverse);
                _paraUniverse.setOrigin(_universe);
                OINexus.registerParaUniverse(_universe, _paraUniverse);
                return _paraUniverse;
            }
        }
        IParaUniverse _paraUniverse = paraUniverseFactory.createParaUniverse(this, _universe);
        universes[address(_paraUniverse)] = true;
        getParaUniverse[address(_universe)] = address(_paraUniverse);
        OINexus.registerParaUniverse(_universe, _paraUniverse);
        shareToken.approveUniverse(_paraUniverse);
        return _paraUniverse;
    }

    function isKnownParaUniverse(IParaUniverse _universe) public view returns (bool) {
        return universes[address(_universe)];
    }

    //
    // Transfer
    //

    function trustedCashTransfer(address _from, address _to, uint256 _amount) public returns (bool) {
        require(isKnownParaUniverse(IParaUniverse(msg.sender)) || msg.sender == registry['ShareToken']);
        require(cash.transferFrom(_from, _to, _amount));
        return true;
    }

    function isKnownMarket(IMarket _market) public view returns (bool) {
        return augur.isKnownMarket(_market);
    }

    function logCompleteSetsPurchased(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) external returns (bool) {
        require(msg.sender == registry["ShareToken"] || (isKnownUniverse(_universe) && _universe.isOpenInterestCash(msg.sender)));
        emit CompleteSetsPurchased(address(_universe), address(_market), _account, _numCompleteSets, getTimestamp(), address(cash));
        return true;
    }

    function logCompleteSetsSold(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) external returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit CompleteSetsSold(address(_universe), address(_market), _account, _numCompleteSets, _fees, getTimestamp(), address(cash));
        return true;
    }

    function logMarketOIChanged(IUniverse _universe, IMarket _market) external returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        IParaUniverse _paraUniverse = IParaUniverse(getParaUniverse[address(_universe)]);
        emit MarketOIChanged(address(_universe), address(_market), _paraUniverse.getMarketOpenInterest(_market), address(cash));
        return true;
    }

    function logTradingProceedsClaimed(IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) external returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit TradingProceedsClaimed(address(_universe), _sender, _market, _outcome, _numShares, _numPayoutTokens, _fees, getTimestamp(), address(cash));
        return true;
    }

    function logShareTokensBalanceChanged(address _account, IMarket _market, uint256 _outcome, uint256 _balance) external returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit ShareTokenBalanceChanged(address(_market.getUniverse()), _account, address(_market), _outcome, _balance, address(cash));
        return true;
    }

    function logReportingFeeChanged(uint256 _reportingFee) external returns (bool) {
        IParaUniverse _paraUniverse = IParaUniverse(msg.sender);
        require(isKnownParaUniverse(_paraUniverse));
        emit ReportingFeeChanged(address(_paraUniverse.originUniverse()), _reportingFee, address(cash));
        return true;
    }

    function getTimestamp() public view returns (uint256) {
        return augur.getTimestamp();
    }

    function getMarketRecommendedTradeInterval(IMarket _market) external view returns (uint256) {
        return IAugurMarketDataGetter(address(augur)).getMarketRecommendedTradeInterval(_market) / 10;
    }

    function getMarketCreationData(IMarket _market) public view returns (MarketCreationData memory) {
        return IAugurCreationDataGetter(address(augur)).getMarketCreationData(_market);
    }

    function getMaximumMarketEndDate() public returns (uint256) {
        return augur.getMaximumMarketEndDate();
    }

    function getUniverseForkIndex(IUniverse _universe) public view returns (uint256) {
        return augur.getUniverseForkIndex(_universe);
    }

    function isKnownFeeSender(address _feeSender) public view returns (bool) {
        return augur.isKnownFeeSender(_feeSender);
    }

    function derivePayoutDistributionHash(uint256[] memory _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes) public view returns (bytes32) {
        return augur.derivePayoutDistributionHash(_payoutNumerators, _numTicks, _numOutcomes);
    }

    function getMarketType(IMarket _market) public view returns (IMarket.MarketType) {
        return augur.getMarketType(_market);
    }

    function getMarketOutcomes(IMarket _market) public view returns (bytes32[] memory _outcomes) {
        return augur.getMarketOutcomes(_market);
    }

    function onTransferOwnership(address, address) internal {}

    function getOriginCash() public view returns (address) {
        return address(augur.cash);
    }
}

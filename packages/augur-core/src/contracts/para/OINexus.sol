pragma solidity 0.5.15;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IOINexus.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/para/ParaOracle.sol';


contract OINexus is Ownable, IOINexus {
    using SafeMathUint256 for uint256;

    mapping(address => bool) public registeredParaAugur;
    mapping(address => uint256) public numParaUniverses;
    mapping(address => bool) public knownParaUniverse;
    mapping(address => uint256) public paraUniversePreviousContribution;
    mapping(address => uint256) public totalUniverseContributions;
    mapping(address => uint256) public universeReportingFeeDivisor;
    
    // WETH / TOKEN oracle
    ParaOracle public oracle;

    constructor(address _weth, address _uniswapFactory) public {
        owner = msg.sender;
        oracle = new ParaOracle(_weth, _uniswapFactory);
    }

    function addParaAugur(address _paraAugur) external onlyOwner returns (bool) {
        registeredParaAugur[_paraAugur] = true;
        oracle.poke(IParaAugur(_paraAugur).lookup("Cash"));
        return true;
    }

    function registerParaUniverse(IUniverse _universe, IParaUniverse _paraUniverse) external {
        require(registeredParaAugur[msg.sender]);
        numParaUniverses[address(_universe)] += 1;
        knownParaUniverse[address(_paraUniverse)] = true;
        oracle.poke(address(_universe.getReputationToken()));
    }

    function recordParaUniverseValuesAndUpdateReportingFee(IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) external returns (uint256) {
        require(knownParaUniverse[msg.sender]);
        IParaUniverse _paraUniverse = IParaUniverse(msg.sender);
        // Before applying the para universe values we update/apply the core universe values first
        {
            uint256 _coreTargetRepMarketCapInAttoCash = _universe.getTargetRepMarketCapInAttoCash();
            uint256 _coreRepMarketCapInAttoCash = _universe.pokeRepMarketCapInAttoCash();
            if (_coreTargetRepMarketCapInAttoCash > 0) {
                applyReportingFeeChanges(_universe, IParaUniverse(address(_universe)), _coreTargetRepMarketCapInAttoCash, _coreRepMarketCapInAttoCash, false);
            }
        }
        return applyReportingFeeChanges(_universe, _paraUniverse, _targetRepMarketCapInAttoCash, _repMarketCapInAttoCash, true);
    }

    function applyReportingFeeChanges(IUniverse _universe, IParaUniverse _paraUniverse, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash, bool recalculate) public returns (uint256) {
        uint256 _reportingFeeDivisor = universeReportingFeeDivisor[address(_universe)];
        if (_reportingFeeDivisor == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        }

        // Derive a new total para universe factor by subtracting this ones old value then adding its new value
        uint256 _magnifiedReportingDivisorFactorContribution = _targetRepMarketCapInAttoCash.mul(10**18).div(_repMarketCapInAttoCash);
        if (_magnifiedReportingDivisorFactorContribution == 0) {
            return _reportingFeeDivisor;
        }
        uint256 _totalMagnifiedUniverseContributions = totalUniverseContributions[address(_universe)];
        uint256 _paraUniversePreviousContribution = paraUniversePreviousContribution[address(_paraUniverse)];
        _totalMagnifiedUniverseContributions = _totalMagnifiedUniverseContributions.sub(_paraUniversePreviousContribution);
        _totalMagnifiedUniverseContributions = _totalMagnifiedUniverseContributions.add(_magnifiedReportingDivisorFactorContribution);
        totalUniverseContributions[address(_universe)] = _totalMagnifiedUniverseContributions;
        paraUniversePreviousContribution[address(_paraUniverse)] = _magnifiedReportingDivisorFactorContribution;

        if (!recalculate) {
            return _reportingFeeDivisor;
        }

        if (_totalMagnifiedUniverseContributions == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        } else {
            _reportingFeeDivisor = _reportingFeeDivisor.mul(10**18).div(_totalMagnifiedUniverseContributions);
        }

        _reportingFeeDivisor = _reportingFeeDivisor
            .max(Reporting.getMinimumReportingFeeDivisor())
            .min(Reporting.getMaximumReportingFeeDivisor());

        universeReportingFeeDivisor[address(_universe)] = _reportingFeeDivisor;
        return _reportingFeeDivisor;
    }

    // Atto no longer properly describes this but I don't want to change it everywhere. It is a euphamism now for "smallest unit" :(
    function getAttoCashPerRep(address _cash, address _reputationToken) public returns (uint256) {
        uint256 _attoWethPerRep = oracle.poke(_reputationToken);
        uint256 _attoWethPerCash = oracle.poke(_cash);
        uint256 _decimals = IERC20(_cash).decimals();
        uint256 _tokenPrecision = 10 ** _decimals;
        if (_attoWethPerRep == 0 || _attoWethPerCash == 0) {
            return 0;
        }
        return _attoWethPerRep * _tokenPrecision / _attoWethPerCash;
    }

    function onTransferOwnership(address, address) internal {}
}

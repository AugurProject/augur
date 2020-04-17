pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/libraries/Initializable.sol';


/**
 * @title Audit Funds
 * @notice A Utility contract to check if a user has any funds to claim and if so return data on what they have
 */
contract AuditFunds is Initializable {
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    struct ShareData {
        IMarket market;
        uint256 payout;
    }

    struct AffiliateFeesData {
        IMarket market;
        uint256 fees;
    }

    struct StakeData {
        IMarket market;
        IReportingParticipant bond;
        uint256 amount;
    }

    address public marketFactory;
    address public disputeCrowdsourcerFactory;
    address public initialReporterFactory;
    IShareToken public shareToken;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        marketFactory = _augur.lookup("MarketFactory");
        disputeCrowdsourcerFactory = _augur.lookup("DisputeCrowdsourcerFactory");
        initialReporterFactory = _augur.lookup("InitialReporterFactory");
        shareToken = IShareToken(_augur.lookup("ShareToken"));
    }

    function getAvailableShareData(address _account, uint256 _offset, uint256 _num) external view returns (ShareData[] memory _data, bool _done) {
        _data = new ShareData[](_num);
        for (uint256 _i = 0; _i < _num; _i++) {
            address _marketAddress = addressFrom(marketFactory, _offset +_i + 1);
            if (!_marketAddress.exists()) {
                return (_data, true);
            }
            IMarket _market = IMarket(_marketAddress);
            if (!_market.isFinalized()) {
                continue;
            }
            uint256 _payout = 0;
            uint256 _numOutcomes = _market.getNumberOfOutcomes();
            for (uint _outcome = 0; _outcome < _numOutcomes; _outcome++) {
                uint256 _numberOfShares = shareToken.balanceOfMarketOutcome(_market, _outcome, _account);
                uint256 _payoutNumerator = _market.getWinningPayoutNumerator(_outcome);
                _payout += _numberOfShares.mul(_payoutNumerator);
            }
            _data[_i].market = _market;
            _data[_i].payout = _payout;
        }
    }

    function getAvailableReports(address _account, uint256 _offset, uint256 _num) external view returns (StakeData[] memory _data, bool _done) {
        _data = new StakeData[](_num);
        for (uint256 _i = 0; _i < _num; _i++) {
            address _initialReportAddress = addressFrom(initialReporterFactory, _offset +_i + 1);
            if (!_initialReportAddress.exists()) {
                return (_data, true);
            }
            IInitialReporter _bond = IInitialReporter(_initialReportAddress);
            IMarket _market = _bond.getMarket();
            if (!_market.isFinalized() || _bond.getOwner() != _account) {
                continue;
            }
            _data[_i].bond = _bond;
            _data[_i].market = _market;
            IV2ReputationToken _reputationToken = _market.getReputationToken();
            _data[_i].amount = _reputationToken.balanceOf(_initialReportAddress);
        }
    }

    function getAvailableDisputes(address _account, uint256 _offset, uint256 _num) external view returns (StakeData[] memory _data, bool _done) {
        _data = new StakeData[](_num);
        for (uint256 _i = 0; _i < _num; _i++) {
            address _disputeBondAddress = addressFrom(disputeCrowdsourcerFactory, _offset +_i + 1);
            if (!_disputeBondAddress.exists()) {
                return (_data, true);
            }
            IDisputeCrowdsourcer _bond = IDisputeCrowdsourcer(_disputeBondAddress);
            IMarket _market = _bond.getMarket();
            if (_market != IMarket(0) && !_market.isFinalized()) {
                continue;
            }
            _data[_i].bond = _bond;
            _data[_i].market = _market;
            _data[_i].amount = _bond.balanceOf(_account);
        }
    }

    function addressFrom(address _origin, uint _nonce) public pure returns (address) {
        if(_nonce == 0x00)       return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xd6), byte(0x94), _origin, byte(0x80)))))));
        if(_nonce <= 0x7f)       return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xd6), byte(0x94), _origin, byte(uint8(_nonce))))))));
        if(_nonce <= 0xff)       return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xd7), byte(0x94), _origin, byte(0x81), uint8(_nonce)))))));
        if(_nonce <= 0xffff)     return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xd8), byte(0x94), _origin, byte(0x82), uint16(_nonce)))))));
        if(_nonce <= 0xffffff)   return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xd9), byte(0x94), _origin, byte(0x83), uint24(_nonce)))))));
        if(_nonce <= 0xffffffff) return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xda), byte(0x94), _origin, byte(0x84), uint32(_nonce)))))));
		return address(uint160(uint256((keccak256(abi.encodePacked(byte(0xdb), byte(0x94), _origin, byte(0x85), uint40(_nonce))))))); // more than 2^40 nonces not realistic
    }
}
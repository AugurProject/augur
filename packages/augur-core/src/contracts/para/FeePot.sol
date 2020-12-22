pragma solidity ^0.5.0;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IFeePot.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';


contract FeePot is VariableSupplyToken, Initializable, IFeePot {
    using SafeMathUint256 for uint256;

    uint256 constant internal magnitude = 2**128;

    IParaUniverse public paraUniverse;
    ICash public cash;
    IV2ReputationToken public reputationToken;

    uint256 public magnifiedFeesPerShare;

    mapping(address => uint256) public magnifiedFeesCorrections;
    mapping(address => uint256) public storedFees;

    uint256 public feeReserve;

    function initialize(IParaAugur _augur, IParaUniverse _paraUniverse) external beforeInitialized {
        endInitialization();
        cash = ICash(_augur.lookup("Cash"));
        paraUniverse = _paraUniverse;
        reputationToken = _paraUniverse.getReputationToken();

        require(cash != ICash(0));
    }

    function symbol() public view returns (string memory) {
        return string(abi.encodePacked("S_", reputationToken.symbol()));
    }

    function depositFees(uint256 _amount) public returns (bool) {
        cash.transferFrom(msg.sender, address(this), _amount);
        uint256 _totalSupply = totalSupply; // after cash.transferFrom to prevent reentrancy causing stale totalSupply
        if (_totalSupply == 0) {
            feeReserve = feeReserve.add(_amount);
            return true;
        }
        if (feeReserve > 0) {
            _amount = _amount.add(feeReserve);
            feeReserve = 0;
        }
        magnifiedFeesPerShare = magnifiedFeesPerShare.add((_amount).mul(magnitude) / _totalSupply);
        return true;
    }

    function withdrawableFeesOf(address _owner) public view returns(uint256) {
        return earnedFeesOf(_owner).add(storedFees[_owner]);
    }

    function earnedFeesOf(address _owner) public view returns(uint256) {
        uint256 _ownerBalance = balanceOf(_owner);
        uint256 _magnifiedFees = magnifiedFeesPerShare.mul(_ownerBalance);
        return _magnifiedFees.sub(magnifiedFeesCorrections[_owner]) / magnitude;
    }

    function _transfer(address _from, address _to, uint256 _amount) internal {
        storedFees[_from] = storedFees[_from].add(earnedFeesOf(_from));
        super._transfer(_from, _to, _amount);

        magnifiedFeesCorrections[_from] = magnifiedFeesPerShare.mul(balanceOf(_from));
        magnifiedFeesCorrections[_to] = magnifiedFeesCorrections[_to].add(magnifiedFeesPerShare.mul(_amount));
    }

    function stake(uint256 _amount) external returns (bool) {
        reputationToken.transferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
        magnifiedFeesCorrections[msg.sender] = magnifiedFeesCorrections[msg.sender].add(magnifiedFeesPerShare.mul(_amount));
        return true;
    }

    function exit(uint256 _amount) external returns (bool) {
        redeemInternal(msg.sender);
        _burn(msg.sender, _amount);
        reputationToken.transfer(msg.sender, _amount);
        magnifiedFeesCorrections[msg.sender] = magnifiedFeesPerShare.mul(balanceOf(msg.sender));
        return true;
    }

    function redeem() public returns (bool) {
        redeemInternal(msg.sender);
        magnifiedFeesCorrections[msg.sender] =  magnifiedFeesPerShare.mul(balanceOf(msg.sender));
        return true;
    }

    function redeemInternal(address _account) internal {
        uint256 _withdrawableFees = withdrawableFeesOf(_account);
        if (_withdrawableFees > 0) {
            storedFees[_account] = 0;
            cash.transfer(_account, _withdrawableFees);
        }
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}

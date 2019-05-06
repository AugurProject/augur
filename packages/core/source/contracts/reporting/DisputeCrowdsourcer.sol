pragma solidity 0.5.4;

import 'ROOT/libraries/IERC820Registry.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IDisputeOverloadToken.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/reporting/BaseReportingParticipant.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/IAugur.sol';


contract DisputeCrowdsourcer is VariableSupplyToken, BaseReportingParticipant, IDisputeCrowdsourcer, Initializable {
    IUniverse internal universe;
    IDisputeOverloadToken disputeOverloadToken;

    string constant public name = "Dispute Crowdsourcer Token";
    string constant public symbol = "DISP";

    function initialize(IAugur _augur, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, IDisputeOverloadToken _disputeOverloadToken, address _erc820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        market = _market;
        universe = market.getUniverse();
        reputationToken = market.getReputationToken();
        size = _size;
        payoutNumerators = _payoutNumerators;
        payoutDistributionHash = _payoutDistributionHash;
        disputeOverloadToken = _disputeOverloadToken;
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
    }

    function redeem(address _redeemer) public returns (bool) {
        bool _isDisavowed = isDisavowed();
        if (!_isDisavowed && !market.isFinalized()) {
            market.finalize();
        }
        uint256 _amount = balances[_redeemer];
        uint256 _overloadAmount = disputeOverloadToken.balanceOf(_redeemer);
        uint256 _totalAmount = _amount.add(_overloadAmount);

        if (_totalAmount == 0) {
            return true;
        }

        uint256 _reputationShare = _totalAmount;

        uint256 _totalRep = reputationToken.balanceOf(address(this));

        if (_totalRep == 0) {
            return true;
        }

        uint256 _excessRep = _totalRep.sub(getStake());
        uint256 _excessRepAvailableForBaseContributions = _excessRep.min(totalSupply().mul(2) / 5);
        uint256 _excessRepAvailableForOverloadContributions = _excessRep.sub(_excessRepAvailableForBaseContributions);

        if (_overloadAmount > 0) {
            _reputationShare = _reputationShare.add(_excessRepAvailableForOverloadContributions.mul(_overloadAmount) / disputeOverloadToken.totalSupply());
            disputeOverloadToken.trustedBurn(_redeemer, _overloadAmount);
        }
        if (_amount > 0) {
            _reputationShare = _reputationShare.add(_excessRepAvailableForBaseContributions.mul(_amount) / totalSupply());
            burn(_redeemer, _amount);
        }

        require(reputationToken.transfer(_redeemer, _reputationShare));

        augur.logDisputeCrowdsourcerRedeemed(universe, _redeemer, address(market), _totalAmount, _reputationShare, payoutNumerators);
        return true;
    }

    function contribute(address _participant, uint256 _amount, bool _overload) public returns (uint256) {
        require(IMarket(msg.sender) == market);
        uint256 _curStake = getStake();
        uint256 _baseAmount = _amount.min(size.sub(_curStake));
        uint256 _totalAmount = _baseAmount;
        if (_overload) {
            uint256 _overloadAmount = _amount.min(universe.getDisputeThresholdForDisputePacing().sub(_curStake)).sub(_baseAmount);
            _totalAmount = _totalAmount.add(_overloadAmount);
            disputeOverloadToken.trustedMint(_participant, _overloadAmount);
        }
        if (_totalAmount == 0) {
            return 0;
        }
        reputationToken.trustedReportingParticipantTransfer(_participant, address(this), _totalAmount);
        if (_baseAmount > 0) {
            mint(_participant, _baseAmount);
        }
        assert(reputationToken.balanceOf(address(this)) >= getStake());
        return _totalAmount;
    }

    function forkAndRedeem() public returns (bool) {
        fork();
        redeem(msg.sender);
        return true;
    }

    function getRemainingToFill() public view returns (uint256) {
        return size.sub(getStake());
    }

    function getStake() public view returns (uint256) {
        return totalSupply().add(disputeOverloadToken.totalSupply());
    }

    function setSize(uint256 _size) public returns (bool) {
        require(IMarket(msg.sender) == market);
        size = _size;
        return true;
    }

    function getDisputeOverloadToken() public returns (IDisputeOverloadToken) {
        return disputeOverloadToken;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function getReputationToken() public view returns (IReputationToken) {
        return reputationToken;
    }

    function correctSize() public returns (bool) {
        require(IMarket(msg.sender) == market);
        size = getStake();
        return true;
    }
}

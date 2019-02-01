pragma solidity 0.4.24;

import 'libraries/IERC820Registry.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'libraries/token/VariableSupplyToken.sol';
import 'reporting/BaseReportingParticipant.sol';
import 'libraries/Initializable.sol';
import 'reporting/IUniverse.sol';
import 'IAugur.sol';


contract DisputeCrowdsourcer is VariableSupplyToken, BaseReportingParticipant, IDisputeCrowdsourcer, Initializable {
    IUniverse internal universe;

    function initialize(IAugur _augur, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] _payoutNumerators, address _erc820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        market = _market;
        universe = market.getUniverse();
        reputationToken = market.getReputationToken();
        size = _size;
        payoutNumerators = _payoutNumerators;
        payoutDistributionHash = _payoutDistributionHash;
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
    }

    function redeem(address _redeemer) public returns (bool) {
        bool _isDisavowed = isDisavowed();
        if (!_isDisavowed && !market.isFinalized()) {
            market.finalize();
        }
        uint256 _reputationSupply = reputationToken.balanceOf(this);
        uint256 _supply = totalSupply();
        uint256 _amount = balances[_redeemer];
        uint256 _reputationShare = _reputationSupply.mul(_amount).div(_supply);
        burn(_redeemer, _amount);
        require(reputationToken.transfer(_redeemer, _reputationShare));
        augur.logDisputeCrowdsourcerRedeemed(universe, _redeemer, market, _amount, _reputationShare, payoutNumerators);
        return true;
    }

    function contribute(address _participant, uint256 _amount) public returns (uint256) {
        require(IMarket(msg.sender) == market);
        _amount = _amount.min(size.sub(totalSupply()));
        if (_amount == 0) {
            return 0;
        }
        reputationToken.trustedReportingParticipantTransfer(_participant, this, _amount);
        mint(_participant, _amount);
        assert(reputationToken.balanceOf(this) >= totalSupply());
        return _amount;
    }

    function forkAndRedeem() public returns (bool) {
        fork();
        redeem(msg.sender);
        return true;
    }

    function getStake() public view returns (uint256) {
        return totalSupply();
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensTransferred(universe, _from, _to, _value);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensMinted(universe, _target, _amount);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeCrowdsourcerTokensBurned(universe, _target, _amount);
        return true;
    }

    function getReputationToken() public view returns (IReputationToken) {
        return reputationToken;
    }
}

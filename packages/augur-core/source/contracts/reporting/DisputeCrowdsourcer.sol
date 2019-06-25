pragma solidity 0.5.4;

import 'ROOT/libraries/IERC1820Registry.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/reporting/BaseReportingParticipant.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/IAugur.sol';


contract DisputeCrowdsourcer is VariableSupplyToken, BaseReportingParticipant, IDisputeCrowdsourcer, Initializable {
    IUniverse internal universe;

    string constant public name = "Dispute Crowdsourcer Token";
    string constant public symbol = "DISP";

    function initialize(IAugur _augur, IMarket _market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, address _erc1820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        market = _market;
        universe = market.getUniverse();
        reputationToken = market.getReputationToken();
        size = _size;
        payoutNumerators = _payoutNumerators;
        payoutDistributionHash = _payoutDistributionHash;
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
        return true;
    }

    function redeem(address _redeemer) public returns (bool) {
        bool _isDisavowed = isDisavowed();
        if (!_isDisavowed && !market.isFinalized()) {
            market.finalize();
        }
        uint256 _reputationSupply = reputationToken.balanceOf(address(this));
        uint256 _supply = totalSupply();
        uint256 _amount = balances[_redeemer];
        uint256 _reputationShare = _reputationSupply.mul(_amount).div(_supply);
        burn(_redeemer, _amount);
        require(reputationToken.transfer(_redeemer, _reputationShare));
        augur.logDisputeCrowdsourcerRedeemed(universe, _redeemer, address(market), _amount, _reputationShare, payoutNumerators);
        return true;
    }

    function contribute(address _participant, uint256 _amount, bool _overload) public returns (uint256) {
        require(IMarket(msg.sender) == market);
        if (_overload) {
            universe.updateForkValues();
            _amount = _amount.min(universe.getDisputeThresholdForDisputePacing().sub(totalSupply()));
        } else {
            _amount = _amount.min(size.sub(totalSupply()));
        }
        if (_amount == 0) {
            return 0;
        }
        reputationToken.trustedReportingParticipantTransfer(_participant, address(this), _amount);
        mint(_participant, _amount);
        assert(reputationToken.balanceOf(address(this)) >= totalSupply());
        return _amount;
    }

    function forkAndRedeem() public returns (bool) {
        fork();
        redeem(msg.sender);
        return true;
    }

    function getRemainingToFill() public view returns (uint256) {
        return size.sub(totalSupply());
    }

    function setSize(uint256 _size) public returns (bool) {
        require(IMarket(msg.sender) == market);
        size = _size;
        return true;
    }

    function getStake() public view returns (uint256) {
        return totalSupply();
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
        size = totalSupply();
        return true;
    }
}

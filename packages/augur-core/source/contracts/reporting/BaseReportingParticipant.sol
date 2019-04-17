pragma solidity 0.5.4;

import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IReputationToken.sol';


contract BaseReportingParticipant is IReportingParticipant {
    IMarket internal market;
    uint256 internal size;
    bytes32 internal payoutDistributionHash;
    uint256[] internal payoutNumerators;
    IReputationToken internal reputationToken;
    IAugur public augur;

    function liquidateLosing() public returns (bool) {
        require(IMarket(msg.sender) == market);
        require(market.getWinningPayoutDistributionHash() != getPayoutDistributionHash() && market.getWinningPayoutDistributionHash() != bytes32(0));
        IReputationToken _reputationToken = market.getReputationToken();
        require(_reputationToken.transfer(address(market), _reputationToken.balanceOf(address(this))));
        return true;
    }

    function fork() internal returns (bool) {
        require(market == market.getUniverse().getForkingMarket());
        IUniverse _newUniverse = market.getUniverse().createChildUniverse(payoutNumerators);
        IReputationToken _newReputationToken = _newUniverse.getReputationToken();
        uint256 _balance = reputationToken.balanceOf(address(this));
        reputationToken.migrateOut(_newReputationToken, _balance);
        _newReputationToken.mintForReportingParticipant(size);
        reputationToken = _newReputationToken;
        augur.logReportingParticipantDisavowed(market.getUniverse(), market);
        market = IMarket(0);
        return true;
    }

    function getSize() public view returns (uint256) {
        return size;
    }

    function getPayoutDistributionHash() public view returns (bytes32) {
        return payoutDistributionHash;
    }

    function getMarket() public view returns (IMarket) {
        return market;
    }

    function isDisavowed() public view returns (bool) {
        return market == IMarket(0) || !market.isContainerForReportingParticipant(this);
    }

    function getPayoutNumerator(uint256 _outcome) public view returns (uint256) {
        return payoutNumerators[_outcome];
    }

    function getPayoutNumerators() public view returns (uint256[] memory) {
        return payoutNumerators;
    }
}

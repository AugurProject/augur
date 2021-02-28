pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/symbiote/ISymbioteShareTokenFactory.sol';
import 'ROOT/symbiote/ISymbioteShareToken.sol';
import 'ROOT/symbiote/IArbiter.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract SymbioteHatchery is Initializable {
    using SafeMathUint256 for uint256;

    uint256 private constant MIN_OUTCOMES = 2; // Does not Include Invalid
    uint256 private constant MAX_OUTCOMES = 7; // Does not Include Invalid
    uint256 private constant MAX_FEE = 2 * 10**16; // 2%
    address private constant NULL_ADDRESS = address(0);
    uint256 private constant MAX_UINT = 2**256 - 1;

    struct Symbiote {
        address creator;
        uint256 creatorFee;
        uint256 numTicks;
        IArbiter arbiter;
        ISymbioteShareToken[] shareTokens;
        uint256 creatorFees;
    }

    Symbiote[] public symbiotes;
    ISymbioteShareTokenFactory public tokenFactory;
    IParaUniverse public paraUniverse;
    IParaOICash public OICash;
    IFeePot public feePot;
    IERC20 public underlyingCurrency;

    event SymbioteCreated();
    event CompleteSetsMinted();
    event CompleteSetsBurned();
    event Claim();
    event AugurResolutionInitiated();

    function initialize(IParaUniverse _universe, ISymbioteShareTokenFactory _tokenFactory) public returns (bool) {
        endInitialization();
        paraUniverse = _universe;
        tokenFactory = _tokenFactory;
        OICash = IParaOICash(_universe.openInterestCash());
        feePot = _universe.getFeePot();
        underlyingCurrency = IERC20(_universe.cash());
        underlyingCurrency.approve(_universe.augur(), MAX_UINT);
        underlyingCurrency.approve(address(feePot), MAX_UINT);
        return true;
    }

    function createSymbiote(uint256 _creatorFee, string[] memory _outcomeSymbols, bytes32[] memory _outcomeNames, uint256 _numTicks, IArbiter _arbiter, bytes memory _arbiterConfiguration) public returns (uint256) {
        require(_numTicks.isMultipleOf(2), "SymbioteHatchery.createSymbiote: numTicks must be multiple of 2");
        require(_numTicks >= _outcomeSymbols.length, "SymbioteHatchery.createSymbiote: numTicks lower than numOutcomes");
        require(MIN_OUTCOMES <= _outcomeSymbols.length && _outcomeSymbols.length <= MAX_OUTCOMES, "SymbioteHatchery.createSymbiote: Number of outcomes is not acceptable");
        require(_outcomeSymbols.length == _outcomeNames.length, "SymbioteHatchery.createSymbiote: outcome names and outcome symbols differ in length");
        require(_creatorFee <= MAX_FEE, "SymbioteHatchery.createSymbiote: market creator fee too high");
        {
            symbiotes.push(Symbiote(
                msg.sender,
                _creatorFee,
                _numTicks,
                _arbiter,
                tokenFactory.createShareTokens(_outcomeNames, _outcomeSymbols),
                0
            ));
        }
        uint256 _id = symbiotes.length-1;
        _arbiter.onSymbioteCreated(_id, _outcomeSymbols, _outcomeNames, _numTicks, _arbiterConfiguration);
        emit SymbioteCreated();
        return _id;
    }

    function getShareTokens(uint256 _id) external returns (ISymbioteShareToken[] memory) {
        return symbiotes[_id].shareTokens;
    }

    function mintCompleteSets(uint256 _id, uint256 _amount, address _receiver) public returns (bool) {
        uint256 _numTicks = symbiotes[_id].numTicks;
        uint256 _cost = _amount.mul(_numTicks);
        underlyingCurrency.transferFrom(msg.sender, address(this), _cost);
        OICash.deposit(_cost);
        for (uint256 _i = 0; _i < symbiotes[_id].shareTokens.length; _i++) {
            symbiotes[_id].shareTokens[_i].trustedMint(_receiver, _amount);
        }
        emit CompleteSetsMinted();
        return true;
    }

    function burnCompleteSets(uint256 _id, uint256 _amount) public returns (bool) {
        for (uint256 _i = 0; _i < symbiotes[_id].shareTokens.length; _i++) {
            symbiotes[_id].shareTokens[_i].trustedBurn(msg.sender, _amount);
        }
        uint256 _numTicks = symbiotes[_id].numTicks;
        payout(_id, msg.sender, _amount.mul(_numTicks), false, false);
        emit CompleteSetsBurned();
        return true;
    }

    function claimWinnings(uint256 _id) public returns (bool) {
        // We expect this to revert if the symbiote is not resolved
        uint256[] memory _winningPayout = symbiotes[_id].arbiter.getSymbioteResolution(_id);
        uint256 _winningBalance = 0;
        for (uint256 _i = 0; _i < symbiotes[_id].shareTokens.length; _i++) {
            _winningBalance = _winningBalance.add(symbiotes[_id].shareTokens[_i].trustedBurnAll(msg.sender) * _winningPayout[_i]);
        }
        payout(_id, msg.sender, _winningBalance, true, _winningPayout[0] != 0);
        emit Claim();
        return true;
    }

    function payout(uint256 _id, address _payee, uint256 _payout, bool _finalized, bool _invalid) private {
        uint256 _creatorFee = symbiotes[_id].creatorFee.mul(_payout) / 10**18;

        (bool _, uint256 _payoutAfterFees) = OICash.withdraw(_payout);

        if (_finalized) {
            if (_invalid) {
                feePot.depositFees(_creatorFee + symbiotes[_id].creatorFees);
                symbiotes[_id].creatorFees = 0;
            } else {
                underlyingCurrency.transfer(symbiotes[_id].creator, _creatorFee);
            }
        } else {
            symbiotes[_id].creatorFees = symbiotes[_id].creatorFees.add(_creatorFee);
        }

        underlyingCurrency.transfer(_payee, _payoutAfterFees.sub(_creatorFee));
    }

    function withdrawCreatorFees(uint256 _id) external returns (bool) {
        // We expect this to revert if the symbiote is not resolved
        uint256[] memory _winningPayout = symbiotes[_id].arbiter.getSymbioteResolution(_id);

        require(_winningPayout[0] == 0, "Can only withdraw creator fees from a valid market");

        underlyingCurrency.transfer(symbiotes[_id].creator, symbiotes[_id].creatorFees);
    }
}
pragma solidity 0.5.10;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/trading/CompleteSets.sol';
import 'ROOT/Augur.sol';


contract ZeroXPoC is ReentrancyGuard {
    using SafeMathUint256 for uint256;

    // Error Codes
    enum Errors {
        ORDER_EXPIRED,                    // Order has already expired
        ORDER_FULLY_FILLED_OR_CANCELLED,  // Order has already been fully filled or cancelled
        ROUNDING_ERROR_TOO_LARGE,         // Rounding error too large
        INSUFFICIENT_BALANCE_OR_ALLOWANCE // Insufficient balance or allowance for token transfer
    }

    uint16 constant public EXTERNAL_QUERY_GAS_LIMIT = 4999;    // Changes to state require at least 5000 gas

    // token => account => balance
    mapping(address => mapping(address => uint256)) public tokenBalances;

    // orderHash => amounts of Amount filled or cancelled.
    mapping (bytes32 => uint) public filled;
    mapping (bytes32 => uint) public cancelled;

    Augur public augur;
    CompleteSets public completeSets;
    ICash public cash;

    event Fill(
        address taker,
        uint256 amountFilled,
        bytes32 orderHash
    );

    event Cancel(
        bytes32 orderHash,
        uint256 cancelledAmount
    );

    event Error(
        uint8 indexed errorId,
        bytes32 indexed orderHash
    );

    struct Order {
        address maker;
        IMarket market;
        uint256 outcome;
        uint256 orderType;
        uint256 amount;
        uint256 price;
        uint256 expirationTimestampInSec;
        bytes32 orderHash;
    }

    event Deposit(
        address indexed account,
        address indexed shareToken,
        uint256 amountDeposited,
        uint256 amountHeld
    );

    event Withdraw(
        address indexed account,
        address indexed shareToken,
        uint256 amountWithdrawn,
        uint256 amountHeld
    );

    constructor(Augur _augur) public {
        augur = _augur;
        completeSets = CompleteSets(augur.lookup("CompleteSets"));
        cash = ICash(augur.lookup("Cash"));
        cash.approve(address(augur), 2 ** 256 - 1);
    }

    /*
    / Market Share management
    */

    function deposit(IERC20 _token, uint256 _amount) public nonReentrant returns (bool) {
        require(_token != IERC20(0));
        tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].add(_amount);
        require(_token.transferFrom(msg.sender, address(this), _amount));
        emit Deposit(msg.sender, address(_token), _amount, tokenBalances[address(_token)][msg.sender]);
        return true;
    }

    function withdraw(IERC20 _token, uint256 _amount) public nonReentrant returns (bool) {
        require(_token != IERC20(0));
        uint256 _heldAmount = tokenBalances[address(_token)][msg.sender];
        tokenBalances[address(_token)][msg.sender] = _heldAmount.sub(_amount);
        require(_heldAmount >= _amount);
        require(_token.transfer(msg.sender, _amount));
        emit Withdraw(msg.sender, address(_token), _amount, tokenBalances[address(_token)][msg.sender]);
        return true;
    }

    // TODO could add something for depositing ETH too and credit CASH

    /*
    / Exchange functions
    */

    /// @dev Fills the input order.
    /// @param orderAddresses Array of order's maker, market
    /// @param orderValues Array of order's outcome, orderType, amount, price, expirationTimestampInSec, and salt.
    /// @param fillAmount Desired amount to fill.
    /// @param v ECDSA signature parameter v.
    /// @param r ECDSA signature parameters r.
    /// @param s ECDSA signature parameters s.
    /// @return success.
    function fillOrder(
          address[2] memory orderAddresses,
          uint[6] memory orderValues,
          uint256 fillAmount,
          uint8 v,
          bytes32 r,
          bytes32 s)
          public
          nonReentrant
          returns (bool)
    {
        Order memory order = Order({
            maker: orderAddresses[0],
            market: IMarket(orderAddresses[1]),
            outcome: orderValues[0],
            orderType: orderValues[1],
            amount: orderValues[2],
            price: orderValues[3],
            expirationTimestampInSec: orderValues[4],
            orderHash: getOrderHash(orderAddresses, orderValues)
        });

        require(order.amount > 0 && fillAmount > 0);

        require(isValidSignature(
            order.maker,
            order.orderHash,
            v,
            r,
            s
        ));

        if (augur.getTimestamp() >= order.expirationTimestampInSec) {
            emit Error(uint8(Errors.ORDER_EXPIRED), order.orderHash);
            return false;
        }

        uint256 _remainingAmount = order.amount.sub(getUnavailableAmount(order.orderHash));
        uint256 _toFillAmount = fillAmount.min(_remainingAmount);
        if (_toFillAmount == 0) {
            emit Error(uint8(Errors.ORDER_FULLY_FILLED_OR_CANCELLED), order.orderHash);
            return false;
        }

        filled[order.orderHash] = filled[order.orderHash].add(_toFillAmount);

        emit Fill(
            msg.sender,
            _toFillAmount,
            order.orderHash
        );

        _toFillAmount = tradeMakerSharesForFillerShares(order, _toFillAmount);
        _toFillAmount = tradeMakerSharesForFillerTokens(order, _toFillAmount);
        _toFillAmount = tradeMakerTokensForFillerShares(order, _toFillAmount);
        tradeMakerTokensForFillerTokens(order, _toFillAmount);

        return true;
    }

    function tradeMakerSharesForFillerShares(Order memory order, uint256 _toFillAmount) private returns (uint256) {
        if (_toFillAmount == 0) {
            return _toFillAmount;
        }

        IShareToken _longShareToken = order.market.getShareToken(order.outcome);
        IShareToken[] memory _shortShareTokens = getShortShareTokens(order.market, order.outcome);

        address _shortParticipant = order.orderType == 0 ? msg.sender : order.maker;
        address _longParticipant = order.orderType == 0 ? order.maker : msg.sender;

        uint256 longSharesHeldByShortParticipant = tokenBalances[address(_longShareToken)][_shortParticipant];
        uint256 shortSharesHeldByLongParticipant = 0;
        for (uint256 _i = 0; _i < _shortShareTokens.length; ++_i) {
            shortSharesHeldByLongParticipant = shortSharesHeldByLongParticipant.add(tokenBalances[address(_shortShareTokens[_i])][_longParticipant]);
        }

        uint256 numCompleteSets = longSharesHeldByShortParticipant.min(shortSharesHeldByLongParticipant).min(_toFillAmount);
        if (numCompleteSets > 0) {
            sellCompleteSets(order, numCompleteSets, _shortParticipant, _longParticipant, _longShareToken, _shortShareTokens);
            _toFillAmount = _toFillAmount.sub(numCompleteSets);
        }

        return _toFillAmount;
    }

    function sellCompleteSets(Order memory order, uint256 _numCompleteSets, address _shortParticipant, address _longParticipant, IShareToken _longShareToken, IShareToken[] memory _shortShareTokens) private returns (bool) {
        uint256 _startingBalance = cash.balanceOf(address(this));
        completeSets.publicSellCompleteSets(order.market, _numCompleteSets);

        uint256 _payout = cash.balanceOf(address(this)).sub(_startingBalance);

        tokenBalances[address(_longShareToken)][_shortParticipant] = tokenBalances[address(_longShareToken)][_shortParticipant].sub(_numCompleteSets);
        for (uint256 _i = 0; _i < _shortShareTokens.length; ++_i) {
            tokenBalances[address(_shortShareTokens[_i])][_longParticipant] = tokenBalances[address(_shortShareTokens[_i])][_longParticipant].sub(_numCompleteSets);
        }

        uint256 _longShare = _payout.mul(order.price).div(order.market.getNumTicks());

        tokenBalances[address(cash)][_shortParticipant] = tokenBalances[address(cash)][_shortParticipant].add(_longShare);
        tokenBalances[address(cash)][_longParticipant] = tokenBalances[address(cash)][_longParticipant].add(_payout.sub(_longShare));

        return true;
    }

    function tradeMakerSharesForFillerTokens(Order memory order, uint256 _toFillAmount) private returns (uint256) {
        if (_toFillAmount == 0) {
            return _toFillAmount;
        }

        IShareToken _longShareToken = order.market.getShareToken(order.outcome);

        // TODO should function in both trade directions
        address _shortParticipant = order.orderType == 0 ? msg.sender : order.maker;
        address _longParticipant = order.orderType == 0 ? order.maker : msg.sender;

        uint256 longSharesHeldByShortParticipant = tokenBalances[address(_longShareToken)][_shortParticipant];

        if (longSharesHeldByShortParticipant == 0) {
            return _toFillAmount;
        }

        uint256 _amountToTrade = _toFillAmount.min(longSharesHeldByShortParticipant);
        uint256 _cost = _amountToTrade.mul(order.price);

        tokenBalances[address(_longShareToken)][_shortParticipant] = tokenBalances[address(_longShareToken)][_shortParticipant].sub(_amountToTrade);
        tokenBalances[address(_longShareToken)][_longParticipant] = tokenBalances[address(_longShareToken)][_longParticipant].add(_amountToTrade);
        tokenBalances[address(cash)][_shortParticipant] = tokenBalances[address(cash)][_shortParticipant].add(_cost);
        tokenBalances[address(cash)][_longParticipant] = tokenBalances[address(cash)][_longParticipant].sub(_cost);

        return _toFillAmount.sub(_amountToTrade);
    }

    function tradeMakerTokensForFillerShares(Order memory order, uint256 _toFillAmount) private returns (uint256) {
        // TODO
        return _toFillAmount;
    }

    function tradeMakerTokensForFillerTokens(Order memory order, uint256 _toFillAmount) private returns (bool) {
        if (_toFillAmount == 0) {
            return true;
        }
        IShareToken _longShareToken = order.market.getShareToken(order.outcome);
        IShareToken[] memory _shortShareTokens = getShortShareTokens(order.market, order.outcome);

        address _shortParticipant = order.orderType == 0 ? msg.sender : order.maker;
        address _longParticipant = order.orderType == 0 ? order.maker : msg.sender;

        uint256 _shortPrice = order.orderType == 0 ? order.market.getNumTicks().sub(order.price) : order.price;
        uint256 _longPrice = order.orderType == 0 ? order.price : order.market.getNumTicks().sub(order.price);

        completeSets.publicBuyCompleteSets(order.market, _toFillAmount);
        tokenBalances[address(_longShareToken)][_longParticipant] = tokenBalances[address(_longShareToken)][_longParticipant].add(_toFillAmount);
        for (uint256 _i = 0; _i < _shortShareTokens.length; ++_i) {
            tokenBalances[address(_shortShareTokens[_i])][_shortParticipant] = tokenBalances[address(_shortShareTokens[_i])][_shortParticipant].add(_toFillAmount);
        }

        tokenBalances[address(cash)][_longParticipant] = tokenBalances[address(cash)][_longParticipant].sub(_toFillAmount.mul(_longPrice));
        tokenBalances[address(cash)][_shortParticipant] = tokenBalances[address(cash)][_shortParticipant].sub(_toFillAmount.mul(_shortPrice));

        return true;
    }

    function getShortShareTokens(IMarket _market, uint256 _longOutcome) private view returns (IShareToken[] memory) {
        IShareToken[] memory _shortShareTokens = new IShareToken[](_market.getNumberOfOutcomes() - 1);
        for (uint256 _outcome = 0; _outcome < _shortShareTokens.length + 1; ++_outcome) {
            if (_outcome == _longOutcome) {
                continue;
            }
            uint256 _index = (_outcome < _longOutcome) ? _outcome : _outcome - 1;
            _shortShareTokens[_index] = _market.getShareToken(_outcome);
        }
        return _shortShareTokens;
    }

    /// @dev Cancels the input order.
    /// @param orderAddresses Array of order's maker and market.
    /// @param orderValues Array of order's outcome, orderType, amount, price, expirationTimestampInSec, and salt.
    /// @param cancelAmount Desired amount to cancel in order.
    /// @return success.
    function cancelOrder(
        address[2] memory orderAddresses,
        uint[6] memory orderValues,
        uint256 cancelAmount)
        public
        nonReentrant
        returns (bool)
    {
        Order memory order = Order({
            maker: orderAddresses[0],
            market: IMarket(orderAddresses[1]),
            outcome: orderValues[0],
            orderType: orderValues[1],
            amount: orderValues[2],
            price: orderValues[3],
            expirationTimestampInSec: orderValues[4],
            orderHash: getOrderHash(orderAddresses, orderValues)
        });

        require(order.maker == msg.sender);
        require(order.amount > 0 && cancelAmount > 0);

        if (augur.getTimestamp() >= order.expirationTimestampInSec) {
            emit Error(uint8(Errors.ORDER_EXPIRED), order.orderHash);
            return false;
        }

        uint256 remainingAmount = order.amount.sub(getUnavailableAmount(order.orderHash));
        uint256 cancelledAmount = cancelAmount.min(remainingAmount);
        if (cancelledAmount == 0) {
            emit Error(uint8(Errors.ORDER_FULLY_FILLED_OR_CANCELLED), order.orderHash);
            return false;
        }

        cancelled[order.orderHash] = cancelled[order.orderHash].add(cancelledAmount);

        emit Cancel(
            order.orderHash,
            cancelledAmount
        );

        return true;
    }

    /*
    * Constant public functions
    */

    /// @dev Calculates Keccak-256 hash of order with specified parameters.
    /// @param orderAddresses Array of order's maker and market.
    /// @param orderValues Array of order's outcome, orderType, amount, price, expirationTimestampInSec, and salt.
    /// @return Keccak-256 hash of order.
    function getOrderHash(address[2] memory orderAddresses, uint[6] memory orderValues) public view returns (bytes32)
    {
        return keccak256(abi.encodePacked(
            address(this),
            orderAddresses[0], // maker
            orderAddresses[1], // market
            orderValues[0],    // outcome
            orderValues[1],    // orderType
            orderValues[2],    // amount
            orderValues[3],    // price
            orderValues[4],    // expirationTimestampInSec
            orderValues[5]     // salt
        ));
    }

    /// @dev Verifies that an order signature is valid.
    /// @param signer address of signer.
    /// @param hash Signed Keccak-256 hash.
    /// @param v ECDSA signature parameter v.
    /// @param r ECDSA signature parameters r.
    /// @param s ECDSA signature parameters s.
    /// @return Validity of order signature.
    function isValidSignature(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool) {
        return signer == ecrecover(
            keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)),
            v,
            r,
            s
        );
    }

    /// @dev Calculates the sum of values already filled and cancelled for a given order.
    /// @param orderHash The Keccak-256 hash of the given order.
    /// @return Sum of values already filled and cancelled.
    function getUnavailableAmount(bytes32 orderHash) public view returns (uint) {
        return filled[orderHash].add(cancelled[orderHash]);
    }

    function getTokenBalance(IERC20 token, address owner) public view returns (uint) {
        return tokenBalances[address(token)][owner];
    }

    /*
    * Internal functions
    */

    /// @dev Get token balance of an address.
    /// @param token Address of token.
    /// @param owner Address of owner.
    /// @return Token balance of owner.
    function getBalance(IERC20 token, address owner)
        internal
        returns (uint)
    {
        return token.balanceOf.gas(EXTERNAL_QUERY_GAS_LIMIT)(owner); // Limit gas to prevent reentrancy
    }

    /// @dev Get allowance of token given to this contract by an address.
    /// @param token Address of token.
    /// @param owner Address of owner.
    /// @return Allowance of token given to this contract by owner.
    function getAllowance(IERC20 token, address owner)
        internal
        returns (uint)
    {
        return token.allowance.gas(EXTERNAL_QUERY_GAS_LIMIT)(owner, address(this)); // Limit gas to prevent reentrancy
    }
}

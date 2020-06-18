pragma solidity 0.5.15;

import 'ROOT/libraries/Initializable.sol';
import 'ROOT/IAugurWallet.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/IAugurWalletRegistry.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/uniswap/interfaces/IWETH.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract AugurWallet is Initializable, IAugurWallet {
    using SafeMathUint256  for uint256;

    IAugurWalletRegistry public registry;
    mapping(address => bool) public authorizedProxies;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    //keccak256("EIP712Domain(address verifyingContract)");
    bytes32 public constant DOMAIN_SEPARATOR_TYPEHASH = 0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749;

    //keccak256("AugurWalletMessage(bytes message)");
    bytes32 public constant MSG_TYPEHASH = 0xe0e790a7bae5fba0106cf286392dd87dfd6ec8631e5631988133e4470b9e7b0d;

    // bytes4(keccak256("isValidSignature(bytes,bytes)")
    bytes4 constant internal EIP1271_MAGIC_VALUE = 0x20c13b0b;

    address owner;

    bytes32 public domainSeparator;
    IERC20 public cash;

    function initialize(address _owner, address _referralAddress, bytes32 _fingerprint, address _augur, address _registry, address _registryV2, IERC20 _cash, IAffiliates _affiliates, IERC1155 _shareToken, address _createOrder, address _fillOrder, address _zeroXTrade) external beforeInitialized {
        endInitialization();
        domainSeparator = keccak256(abi.encode(DOMAIN_SEPARATOR_TYPEHASH, this));
        owner = _owner;
        registry = IAugurWalletRegistry(_registryV2);
        authorizedProxies[_registry] = true;
        authorizedProxies[_registryV2] = true;
        cash = _cash;

        _cash.approve(_augur, MAX_APPROVAL_AMOUNT);

        _cash.approve(_createOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_createOrder, true);

        _cash.approve(_fillOrder, MAX_APPROVAL_AMOUNT);
        _shareToken.setApprovalForAll(_fillOrder, true);

        _cash.approve(_zeroXTrade, MAX_APPROVAL_AMOUNT);

        _affiliates.setFingerprint(_fingerprint);

        if (_referralAddress != address(0)) {
            _affiliates.setReferrer(_referralAddress);
        }
    }

    function transferCash(address _to, uint256 _amount) external {
        require(authorizedProxies[msg.sender]);
        cash.transfer(_to, _amount);
    }

    function executeTransaction(address _to, bytes calldata _data, uint256 _value) external returns (bool) {
        require(authorizedProxies[msg.sender]);
        (bool _didSucceed, bytes memory _resultData) = address(_to).call.value(_value)(_data);
        return _didSucceed;
    }

    function addAuthorizedProxy(address _authorizedProxy) external returns (bool) {
        require(msg.sender == owner || authorizedProxies[msg.sender] || msg.sender == address(this));
        authorizedProxies[_authorizedProxy] = true;
        return true;
    }

    function removeAuthorizedProxy(address _authorizedProxy) external returns (bool) {
        require(msg.sender == owner || authorizedProxies[msg.sender] || msg.sender == address(this));
        authorizedProxies[_authorizedProxy] = false;
        return true;
    }

    function withdrawAllFundsAsDai(address _destination, uint256 _minExchangeRateInDai) external payable returns (bool) {
        require(msg.sender == owner);
        IUniswapV2Pair _ethExchange = registry.ethExchange();
        IWETH _weth = registry.WETH();
        bool _token0IsCash = registry.token0IsCash();
        uint256 _ethAmount = address(this).balance;
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = _ethExchange.getReserves();
        uint256 _cashAmount = getAmountOut(_ethAmount, _token0IsCash ? _reserve1 : _reserve0, _token0IsCash ? _reserve0 : _reserve1);
        uint256 _exchangeRate = _cashAmount.mul(10**18).div(_ethAmount);
        require(_minExchangeRateInDai <= _exchangeRate, "Exchange rate too low");
        _weth.deposit.value(_ethAmount)();
        _weth.transfer(address(_ethExchange), _ethAmount);
        _ethExchange.swap(_token0IsCash ? _cashAmount : 0, _token0IsCash ? 0 : _cashAmount, address(this), "");
        cash.transfer(_destination, cash.balanceOf(address(this)));
        return true;
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0);
        require(reserveIn > 0 && reserveOut > 0);
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function isValidSignature(bytes calldata _data, bytes calldata _signature) external view returns (bytes4) {
        bytes32 _messageHash = getMessageHash(_data);
        require(_signature.length >= 65, "Signature data length incorrect");
        bytes32 _r;
        bytes32 _s;
        uint8 _v;
        bytes memory _sig = _signature;

        assembly {
            _r := mload(add(_sig, 32))
            _s := mload(add(_sig, 64))
            _v := and(mload(add(_sig, 65)), 255)
        }

        require(owner == ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)), _v, _r, _s), "Invalid Signature");

        return EIP1271_MAGIC_VALUE;
    }

    /// @dev Returns hash of a message that can be signed by the owner.
    /// @param _message Message that should be hashed
    /// @return Message hash.
    function getMessageHash(bytes memory _message) public view returns (bytes32) {
        bytes32 safeMessageHash = keccak256(abi.encode(MSG_TYPEHASH, keccak256(_message)));
        return keccak256(abi.encodePacked(byte(0x19), byte(0x01), domainSeparator, safeMessageHash));
    }

    function () external payable {}
}
pragma solidity 0.5.15;

import 'ROOT/libraries/token/ERC20.sol';
import 'ROOT/matic/plasma/BaseStateSyncVerifier.sol';
import 'ROOT/matic/plasma/IStateReceiver.sol';

contract TradingCash is IStateReceiver, BaseStateSyncVerifier, ERC20 {
    uint256 public constant MAX_ALLOWANCE = 2 ** 256 - 1;

    address public childChain;
    address public rootToken;
    mapping(address => bool) public whitelistedSpenders;

    event Deposit(
        address indexed token,
        address indexed from,
        uint256 amount,
        uint256 input1,
        uint256 output1
    );

    event Withdraw(
        address indexed token,
        address indexed from,
        uint256 amount,
        uint256 input1,
        uint256 output1
    );

    event LogTransfer(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 input1,
        uint256 input2,
        uint256 output1,
        uint256 output2
    );

    event ChildChainChanged(
        address indexed previousAddress,
        address indexed newAddress
    );

    constructor(
      address _rootToken
    ) public {
      rootToken = _rootToken;
    }

    modifier onlyChildChain() {
        require(
            msg.sender == childChain,
            "Child token: caller is not the child chain contract"
        );
        _;
    }

    function setWhitelistedSpender(address _spender, bool _value) public onlyOwner {
        whitelistedSpenders[_spender] = _value;
    }

    function changeChildChain(address newAddress) public onlyOwner {
        require(
            newAddress != address(0),
            "Child token: new child address is the zero address"
        );

        emit ChildChainChanged(childChain, newAddress);
        childChain = newAddress;
    }

    function deposit(address user, uint256 amount) public onlyChildChain {
        require(amount > 0, "incorrect deposit amount");
        require(user != address(0x0), "incorrect deposit user");

        uint256 input1 = balanceOf(user);
        _mint(user, amount);

        emit Deposit(rootToken, user, amount, input1, balanceOf(user));
    }

    function withdraw(uint256 amount) public {
        _withdraw(msg.sender, amount);
    }

    function _withdraw(address user, uint256 amount) private {
      uint256 input = balanceOf(user);
      _burn(user, amount);

      emit Withdraw(rootToken, user, amount, input, balanceOf(user));
    }

    function onStateReceive(
        uint256, /* id */
        bytes calldata data
    ) external onlyStateSyncer {
        (address user, uint256 burnAmount) = abi.decode(
            data,
            (address, uint256)
        );

        uint256 balance = balanceOf(user);
        if (balance < burnAmount) {
            burnAmount = balance;
        }

        _withdraw(user, burnAmount);
    }

    /**
     * @dev Override it to check if the sender is whitelisted
     */
    function transferFrom(address _sender, address _recipient, uint256 _amount) public returns (bool) {
        require(_amount == 0 || whitelistedSpenders[msg.sender], "not whitelisted spender");
        _transfer(_sender, _recipient, _amount);
        return true;
    }

    /**
     * @dev Override to emit additional logs for proof creation
     */
    function _transfer(address _sender, address _recipient, uint256 _amount) internal {
        require(_sender != address(0), "ERC20: transfer from the zero address");
        require(_recipient != address(0), "ERC20: transfer to the zero address");

        uint256 input1 = balanceOf(_sender);
        uint256 input2 = balanceOf(_recipient);

        uint256 output1 = input1.sub(_amount);
        uint256 output2 = input2.add(_amount);

        balances[_sender] = output1;
        balances[_recipient] = output2;

        emit Transfer(_sender, _recipient, _amount);
        emit LogTransfer(
            rootToken,
            _sender,
            _recipient,
            _amount,
            input1,
            input2,
            output1,
            output2
        );
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}

    function allowance(address, address _sender) public view returns (uint256) {
        if (whitelistedSpenders[_sender]) {
            return MAX_ALLOWANCE;
        }

        return 0;
    }

    function approve(address, uint256) public returns (bool) {
        revert("approve disabled");
    }
}

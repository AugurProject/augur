pragma solidity 0.5.15;

import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/libraries/Pausable.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/gov/IStakingRewards.sol';
import 'ROOT/para/interfaces/IFeePot.sol';
import 'ROOT/gov/IGovToken.sol';


contract FeePotStakingRewards is IStakingRewards, ReentrancyGuard, Pausable {
    using SafeMathUint256 for uint256;

    /* ========== STATE VARIABLES ========== */

    IGovToken public rewardsToken;
    IFeePot public stakingToken;
    IERC20 public feeToken;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public rewardsDuration = 7 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    address public rewardsDistribution;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    uint256 constant internal magnitude = 2**128;
    uint256 public magnifiedFeesPerShare;
    mapping(address => uint256) public magnifiedFeesCorrections;
    uint256 public currentFees;

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        (magnifiedFeesPerShare, currentFees) = getNewMagnifiedFeesPerShareAndCurrentFees();
        _;
    }

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
        _;
    }

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _owner,
        address _rewardsDistribution,
        address _rewardsToken,
        address _stakingToken
    ) public {
        rewardsToken = IGovToken(_rewardsToken);
        stakingToken = IFeePot(_stakingToken);
        feeToken = stakingToken.cash();
        rewardsDistribution = _rewardsDistribution;
        owner = _owner;
    }

    /* ========== VIEWS ========== */

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp.min(periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(totalSupply)
            );
    }

    function earned(address account) public view returns (uint256) {
        return balanceOf[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    function getNewMagnifiedFeesPerShareAndCurrentFees() internal view returns (uint256, uint256) {
        uint256 _currentFees = stakingToken.withdrawableFeesOf(address(this));
        _currentFees = _currentFees.add(feeToken.balanceOf(address(this)));
        if (totalSupply == 0) {
            return (0, _currentFees);
        }
        uint256 _feesAdded = _currentFees.sub(currentFees);
        uint256 _magnifiedFeesPerShare = magnifiedFeesPerShare.add((_feesAdded).mul(magnitude) / totalSupply);
        return (_magnifiedFeesPerShare, _currentFees);
    }

    function withdrawableFees(address _account) public view returns (uint256) {
        (uint256 _magnifiedFeesPerShare, uint256 _currentFees) = getNewMagnifiedFeesPerShareAndCurrentFees();
        uint256 _balance = balanceOf[_account];
        uint256 _magnifiedFees = _magnifiedFeesPerShare.mul(_balance);
        return _magnifiedFees.sub(magnifiedFeesCorrections[_account]) / magnitude;
    }

    function earnedFees(address _account) public view returns (uint256) {
        uint256 _balance = balanceOf[_account];
        uint256 _magnifiedFees = magnifiedFeesPerShare.mul(_balance);
        return _magnifiedFees.sub(magnifiedFeesCorrections[_account]) / magnitude;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(uint256 amount) external nonReentrant notPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        totalSupply = totalSupply.add(amount);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);
        stakingToken.transferFrom(msg.sender, address(this), amount);
        magnifiedFeesCorrections[msg.sender] = magnifiedFeesCorrections[msg.sender].add(magnifiedFeesPerShare.mul(amount));
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        redeemFeesInternal(msg.sender);
        totalSupply = totalSupply.sub(amount);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(amount);
        stakingToken.transfer(msg.sender, amount);
        magnifiedFeesCorrections[msg.sender] = magnifiedFeesPerShare.mul(balanceOf[msg.sender]);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.mint(msg.sender, uint96(reward));
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        withdraw(balanceOf[msg.sender]);
        getReward();
    }

    function getFeeReward() public nonReentrant updateReward(msg.sender) {
        redeemFeesInternal(msg.sender);
        magnifiedFeesCorrections[msg.sender] =  magnifiedFeesPerShare.mul(balanceOf[msg.sender]);
    }

    function redeemFeesInternal(address _account) internal {
        stakingToken.redeem();
        uint256 _feesEarned = earnedFees(_account);(msg.sender);
        if (_feesEarned > 0) {
            feeToken.transfer(msg.sender, _feesEarned);
            currentFees = currentFees.sub(_feesEarned);
        }
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(uint256 reward) external onlyRewardsDistribution updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        // Ensure the provided reward amount is not more than the balance in the contract.
        // This keeps the reward rate in the right range, preventing overflows due to
        // very high values of rewardRate in the earned and rewardsPerToken functions;
        // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
        //uint balance = rewardsToken.mintAllowance(address(this));
        //require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit RewardAdded(reward);
    }

    // Added to support recovering LP Rewards from other systems to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        // Cannot recover the staking token or the rewards token
        require(
            tokenAddress != address(stakingToken) && tokenAddress != address(rewardsToken),
            "Cannot withdraw the staking or rewards tokens"
        );
        IERC20(tokenAddress).transfer(owner, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            periodFinish == 0 || block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    function setRewardsDistribution(address _rewardsDistribution) external onlyOwner {
        rewardsDistribution = _rewardsDistribution;
    }

    function onTransferOwnership(address, address) internal {}
}
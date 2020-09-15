---
title: Gov
---

<div class="contracts">

## Contracts

### `FeePotStakingRewards`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#FeePotStakingRewards.constructor(address,address,address,address)"><code class="function-signature">constructor(address _owner, address _rewardsDistribution, address _rewardsToken, address _stakingToken)</code></a></li><li><a href="#FeePotStakingRewards.lastTimeRewardApplicable()"><code class="function-signature">lastTimeRewardApplicable()</code></a></li><li><a href="#FeePotStakingRewards.rewardPerToken()"><code class="function-signature">rewardPerToken()</code></a></li><li><a href="#FeePotStakingRewards.earned(address)"><code class="function-signature">earned(address account)</code></a></li><li><a href="#FeePotStakingRewards.getRewardForDuration()"><code class="function-signature">getRewardForDuration()</code></a></li><li><a href="#FeePotStakingRewards.getNewMagnifiedFeesPerShareAndCurrentFees()"><code class="function-signature">getNewMagnifiedFeesPerShareAndCurrentFees()</code></a></li><li><a href="#FeePotStakingRewards.withdrawableFees(address)"><code class="function-signature">withdrawableFees(address _account)</code></a></li><li><a href="#FeePotStakingRewards.earnedFees(address)"><code class="function-signature">earnedFees(address _account)</code></a></li><li><a href="#FeePotStakingRewards.stake(uint256)"><code class="function-signature">stake(uint256 amount)</code></a></li><li><a href="#FeePotStakingRewards.withdraw(uint256)"><code class="function-signature">withdraw(uint256 amount)</code></a></li><li><a href="#FeePotStakingRewards.getReward()"><code class="function-signature">getReward()</code></a></li><li><a href="#FeePotStakingRewards.exit()"><code class="function-signature">exit()</code></a></li><li><a href="#FeePotStakingRewards.getFeeReward()"><code class="function-signature">getFeeReward()</code></a></li><li><a href="#FeePotStakingRewards.redeemFeesInternal(address)"><code class="function-signature">redeemFeesInternal(address _account)</code></a></li><li><a href="#FeePotStakingRewards.notifyRewardAmount(uint256)"><code class="function-signature">notifyRewardAmount(uint256 reward)</code></a></li><li><a href="#FeePotStakingRewards.recoverERC20(address,uint256)"><code class="function-signature">recoverERC20(address tokenAddress, uint256 tokenAmount)</code></a></li><li><a href="#FeePotStakingRewards.setRewardsDuration(uint256)"><code class="function-signature">setRewardsDuration(uint256 _rewardsDuration)</code></a></li><li><a href="#FeePotStakingRewards.setRewardsDistribution(address)"><code class="function-signature">setRewardsDistribution(address _rewardsDistribution)</code></a></li><li><a href="#FeePotStakingRewards.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="gov#Pausable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="gov#Pausable.setPaused(bool)"><code class="function-signature">setPaused(bool _paused)</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="gov#IStakingRewards.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="gov#IStakingRewards.balanceOf(address)"><code class="function-signature">balanceOf(address account)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#FeePotStakingRewards.RewardAdded(uint256)"><code class="function-signature">RewardAdded(uint256 reward)</code></a></li><li><a href="#FeePotStakingRewards.Staked(address,uint256)"><code class="function-signature">Staked(address user, uint256 amount)</code></a></li><li><a href="#FeePotStakingRewards.Withdrawn(address,uint256)"><code class="function-signature">Withdrawn(address user, uint256 amount)</code></a></li><li><a href="#FeePotStakingRewards.RewardPaid(address,uint256)"><code class="function-signature">RewardPaid(address user, uint256 reward)</code></a></li><li><a href="#FeePotStakingRewards.RewardsDurationUpdated(uint256)"><code class="function-signature">RewardsDurationUpdated(uint256 newDuration)</code></a></li><li><a href="#FeePotStakingRewards.Recovered(address,uint256)"><code class="function-signature">Recovered(address token, uint256 amount)</code></a></li><li class="inherited"><a href="gov#Pausable.PauseChanged(bool)"><code class="function-signature">PauseChanged(bool isPaused)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.constructor(address,address,address,address)"></a><code class="function-signature">constructor(address _owner, address _rewardsDistribution, address _rewardsToken, address _stakingToken)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.lastTimeRewardApplicable()"></a><code class="function-signature">lastTimeRewardApplicable() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.rewardPerToken()"></a><code class="function-signature">rewardPerToken() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.earned(address)"></a><code class="function-signature">earned(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.getRewardForDuration()"></a><code class="function-signature">getRewardForDuration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.getNewMagnifiedFeesPerShareAndCurrentFees()"></a><code class="function-signature">getNewMagnifiedFeesPerShareAndCurrentFees() <span class="return-arrow">→</span> <span class="return-type">uint256,uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.withdrawableFees(address)"></a><code class="function-signature">withdrawableFees(address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.earnedFees(address)"></a><code class="function-signature">earnedFees(address _account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.stake(uint256)"></a><code class="function-signature">stake(uint256 amount)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 amount)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.getReward()"></a><code class="function-signature">getReward()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.exit()"></a><code class="function-signature">exit()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.getFeeReward()"></a><code class="function-signature">getFeeReward()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.redeemFeesInternal(address)"></a><code class="function-signature">redeemFeesInternal(address _account)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.notifyRewardAmount(uint256)"></a><code class="function-signature">notifyRewardAmount(uint256 reward)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.recoverERC20(address,uint256)"></a><code class="function-signature">recoverERC20(address tokenAddress, uint256 tokenAmount)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.setRewardsDuration(uint256)"></a><code class="function-signature">setRewardsDuration(uint256 _rewardsDuration)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.setRewardsDistribution(address)"></a><code class="function-signature">setRewardsDistribution(address _rewardsDistribution)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.RewardAdded(uint256)"></a><code class="function-signature">RewardAdded(uint256 reward)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.Staked(address,uint256)"></a><code class="function-signature">Staked(address user, uint256 amount)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.Withdrawn(address,uint256)"></a><code class="function-signature">Withdrawn(address user, uint256 amount)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.RewardPaid(address,uint256)"></a><code class="function-signature">RewardPaid(address user, uint256 reward)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.RewardsDurationUpdated(uint256)"></a><code class="function-signature">RewardsDurationUpdated(uint256 newDuration)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="FeePotStakingRewards.Recovered(address,uint256)"></a><code class="function-signature">Recovered(address token, uint256 amount)</code><span class="function-visibility"></span></h4>





### `ICash`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li class="inherited"><a href="gov#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="gov#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="gov#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="gov#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="gov#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>





### `IERC20`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li><a href="#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li><a href="#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li><a href="#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li><a href="#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li><a href="#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IERC20.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.balanceOf(address)"></a><code class="function-signature">balanceOf(address owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transfer(address,uint256)"></a><code class="function-signature">transfer(address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address from, address to, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.allowance(address,address)"></a><code class="function-signature">allowance(address owner, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>







<h4><a class="anchor" aria-hidden="true" id="IERC20.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 value)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="IERC20.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 value)</code><span class="function-visibility"></span></h4>





### `IFeePot`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IFeePot.depositFees(uint256)"><code class="function-signature">depositFees(uint256 _amount)</code></a></li><li><a href="#IFeePot.withdrawableFeesOf(address)"><code class="function-signature">withdrawableFeesOf(address _owner)</code></a></li><li><a href="#IFeePot.redeem()"><code class="function-signature">redeem()</code></a></li><li><a href="#IFeePot.cash()"><code class="function-signature">cash()</code></a></li><li class="inherited"><a href="gov#IERC20.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li class="inherited"><a href="gov#IERC20.balanceOf(address)"><code class="function-signature">balanceOf(address owner)</code></a></li><li class="inherited"><a href="gov#IERC20.transfer(address,uint256)"><code class="function-signature">transfer(address to, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address from, address to, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 amount)</code></a></li><li class="inherited"><a href="gov#IERC20.allowance(address,address)"><code class="function-signature">allowance(address owner, address spender)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li class="inherited"><a href="gov#IERC20.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 value)</code></a></li><li class="inherited"><a href="gov#IERC20.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 value)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IFeePot.depositFees(uint256)"></a><code class="function-signature">depositFees(uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.withdrawableFeesOf(address)"></a><code class="function-signature">withdrawableFeesOf(address _owner) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.redeem()"></a><code class="function-signature">redeem() <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IFeePot.cash()"></a><code class="function-signature">cash() <span class="return-arrow">→</span> <span class="return-type">contract ICash</span></code><span class="function-visibility">external</span></h4>







### `IGovToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IGovToken.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IGovToken.getPriorVotes(address,uint256)"><code class="function-signature">getPriorVotes(address account, uint256 blockNumber)</code></a></li><li><a href="#IGovToken.mintAllowance(address)"><code class="function-signature">mintAllowance(address account)</code></a></li><li><a href="#IGovToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IGovToken.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IGovToken.getPriorVotes(address,uint256)"></a><code class="function-signature">getPriorVotes(address account, uint256 blockNumber) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IGovToken.mintAllowance(address)"></a><code class="function-signature">mintAllowance(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IGovToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>







### `IOwnable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IOwnable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#IOwnable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IOwnable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IOwnable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>







### `IStakingRewards`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#IStakingRewards.lastTimeRewardApplicable()"><code class="function-signature">lastTimeRewardApplicable()</code></a></li><li><a href="#IStakingRewards.rewardPerToken()"><code class="function-signature">rewardPerToken()</code></a></li><li><a href="#IStakingRewards.earned(address)"><code class="function-signature">earned(address account)</code></a></li><li><a href="#IStakingRewards.getRewardForDuration()"><code class="function-signature">getRewardForDuration()</code></a></li><li><a href="#IStakingRewards.totalSupply()"><code class="function-signature">totalSupply()</code></a></li><li><a href="#IStakingRewards.balanceOf(address)"><code class="function-signature">balanceOf(address account)</code></a></li><li><a href="#IStakingRewards.stake(uint256)"><code class="function-signature">stake(uint256 amount)</code></a></li><li><a href="#IStakingRewards.withdraw(uint256)"><code class="function-signature">withdraw(uint256 amount)</code></a></li><li><a href="#IStakingRewards.getReward()"><code class="function-signature">getReward()</code></a></li><li><a href="#IStakingRewards.exit()"><code class="function-signature">exit()</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.lastTimeRewardApplicable()"></a><code class="function-signature">lastTimeRewardApplicable() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.rewardPerToken()"></a><code class="function-signature">rewardPerToken() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.earned(address)"></a><code class="function-signature">earned(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.getRewardForDuration()"></a><code class="function-signature">getRewardForDuration() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.totalSupply()"></a><code class="function-signature">totalSupply() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.balanceOf(address)"></a><code class="function-signature">balanceOf(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.stake(uint256)"></a><code class="function-signature">stake(uint256 amount)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.withdraw(uint256)"></a><code class="function-signature">withdraw(uint256 amount)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.getReward()"></a><code class="function-signature">getReward()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="IStakingRewards.exit()"></a><code class="function-signature">exit()</code><span class="function-visibility">external</span></h4>







### `Ownable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Ownable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">public</span></h4>

The Ownable constructor sets the original `owner` of the contract to the sender
account.



<h4><a class="anchor" aria-hidden="true" id="Ownable.getOwner()"></a><code class="function-signature">getOwner() <span class="return-arrow">→</span> <span class="return-type">address</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Ownable.transferOwnership(address)"></a><code class="function-signature">transferOwnership(address _newOwner) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>

Allows the current owner to transfer control of the contract to a newOwner.




<h4><a class="anchor" aria-hidden="true" id="Ownable.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







### `Pausable`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Pausable.constructor()"><code class="function-signature">constructor()</code></a></li><li><a href="#Pausable.setPaused(bool)"><code class="function-signature">setPaused(bool _paused)</code></a></li><li class="inherited"><a href="#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li><li class="inherited"><a href="#Ownable.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Pausable.PauseChanged(bool)"><code class="function-signature">PauseChanged(bool isPaused)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Pausable.constructor()"></a><code class="function-signature">constructor()</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Pausable.setPaused(bool)"></a><code class="function-signature">setPaused(bool _paused)</code><span class="function-visibility">external</span></h4>

Only the contract owner may call this.





<h4><a class="anchor" aria-hidden="true" id="Pausable.PauseChanged(bool)"></a><code class="function-signature">PauseChanged(bool isPaused)</code><span class="function-visibility"></span></h4>





### `ReentrancyGuard`



<div class="contract-index"></div>





### `SafeMathUint256`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#SafeMathUint256.mul(uint256,uint256)"><code class="function-signature">mul(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.div(uint256,uint256)"><code class="function-signature">div(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sub(uint256,uint256)"><code class="function-signature">sub(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.subS(uint256,uint256,string)"><code class="function-signature">subS(uint256 a, uint256 b, string message)</code></a></li><li><a href="#SafeMathUint256.add(uint256,uint256)"><code class="function-signature">add(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.min(uint256,uint256)"><code class="function-signature">min(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.max(uint256,uint256)"><code class="function-signature">max(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.sqrt(uint256)"><code class="function-signature">sqrt(uint256 y)</code></a></li><li><a href="#SafeMathUint256.getUint256Min()"><code class="function-signature">getUint256Min()</code></a></li><li><a href="#SafeMathUint256.getUint256Max()"><code class="function-signature">getUint256Max()</code></a></li><li><a href="#SafeMathUint256.isMultipleOf(uint256,uint256)"><code class="function-signature">isMultipleOf(uint256 a, uint256 b)</code></a></li><li><a href="#SafeMathUint256.fxpMul(uint256,uint256,uint256)"><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base)</code></a></li><li><a href="#SafeMathUint256.fxpDiv(uint256,uint256,uint256)"><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.mul(uint256,uint256)"></a><code class="function-signature">mul(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.div(uint256,uint256)"></a><code class="function-signature">div(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sub(uint256,uint256)"></a><code class="function-signature">sub(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.subS(uint256,uint256,string)"></a><code class="function-signature">subS(uint256 a, uint256 b, string message) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.add(uint256,uint256)"></a><code class="function-signature">add(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.min(uint256,uint256)"></a><code class="function-signature">min(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.max(uint256,uint256)"></a><code class="function-signature">max(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.sqrt(uint256)"></a><code class="function-signature">sqrt(uint256 y) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Min()"></a><code class="function-signature">getUint256Min() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.getUint256Max()"></a><code class="function-signature">getUint256Max() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.isMultipleOf(uint256,uint256)"></a><code class="function-signature">isMultipleOf(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpMul(uint256,uint256,uint256)"></a><code class="function-signature">fxpMul(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="SafeMathUint256.fxpDiv(uint256,uint256,uint256)"></a><code class="function-signature">fxpDiv(uint256 a, uint256 b, uint256 base) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







### `GovToken`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#GovToken.constructor(address)"><code class="function-signature">constructor(address account)</code></a></li><li><a href="#GovToken.allowance(address,address)"><code class="function-signature">allowance(address account, address spender)</code></a></li><li><a href="#GovToken.approve(address,uint256)"><code class="function-signature">approve(address spender, uint256 _amount)</code></a></li><li><a href="#GovToken.balanceOf(address)"><code class="function-signature">balanceOf(address account)</code></a></li><li><a href="#GovToken.transfer(address,uint256)"><code class="function-signature">transfer(address dst, uint256 _amount)</code></a></li><li><a href="#GovToken.transferFrom(address,address,uint256)"><code class="function-signature">transferFrom(address src, address dst, uint256 _amount)</code></a></li><li><a href="#GovToken.delegate(address)"><code class="function-signature">delegate(address delegatee)</code></a></li><li><a href="#GovToken.delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"><code class="function-signature">delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)</code></a></li><li><a href="#GovToken.getCurrentVotes(address)"><code class="function-signature">getCurrentVotes(address account)</code></a></li><li><a href="#GovToken.getPriorVotes(address,uint256)"><code class="function-signature">getPriorVotes(address account, uint256 blockNumber)</code></a></li><li><a href="#GovToken._delegate(address,address)"><code class="function-signature">_delegate(address delegator, address delegatee)</code></a></li><li><a href="#GovToken._transferTokens(address,address,uint256)"><code class="function-signature">_transferTokens(address src, address dst, uint256 amount)</code></a></li><li><a href="#GovToken._moveDelegates(address,address,uint256)"><code class="function-signature">_moveDelegates(address srcRep, address dstRep, uint256 amount)</code></a></li><li><a href="#GovToken._writeCheckpoint(address,uint32,uint256,uint256)"><code class="function-signature">_writeCheckpoint(address delegatee, uint32 nCheckpoints, uint256 oldVotes, uint256 newVotes)</code></a></li><li><a href="#GovToken.safe32(uint256,string)"><code class="function-signature">safe32(uint256 n, string errorMessage)</code></a></li><li><a href="#GovToken.getChainId()"><code class="function-signature">getChainId()</code></a></li><li><a href="#GovToken.setMintAllowance(address,uint256)"><code class="function-signature">setMintAllowance(address _target, uint256 _mintAllowance)</code></a></li><li><a href="#GovToken.mint(address,uint256)"><code class="function-signature">mint(address _target, uint256 _amount)</code></a></li><li><a href="#GovToken.burn(address,uint256)"><code class="function-signature">burn(address _target, uint256 _amount)</code></a></li><li><a href="#GovToken.onTransferOwnership(address,address)"><code class="function-signature">onTransferOwnership(address, address)</code></a></li><li class="inherited"><a href="gov#Ownable.constructor()"><code class="function-signature">constructor()</code></a></li><li class="inherited"><a href="gov#Ownable.getOwner()"><code class="function-signature">getOwner()</code></a></li><li class="inherited"><a href="gov#Ownable.transferOwnership(address)"><code class="function-signature">transferOwnership(address _newOwner)</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#GovToken.DelegateChanged(address,address,address)"><code class="function-signature">DelegateChanged(address delegator, address fromDelegate, address toDelegate)</code></a></li><li><a href="#GovToken.DelegateVotesChanged(address,uint256,uint256)"><code class="function-signature">DelegateVotesChanged(address delegate, uint256 previousBalance, uint256 newBalance)</code></a></li><li><a href="#GovToken.Transfer(address,address,uint256)"><code class="function-signature">Transfer(address from, address to, uint256 amount)</code></a></li><li><a href="#GovToken.Approval(address,address,uint256)"><code class="function-signature">Approval(address owner, address spender, uint256 amount)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="GovToken.constructor(address)"></a><code class="function-signature">constructor(address account)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.allowance(address,address)"></a><code class="function-signature">allowance(address account, address spender) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.approve(address,uint256)"></a><code class="function-signature">approve(address spender, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>

This will overwrite the approval amount for `spender`
 and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)




<h4><a class="anchor" aria-hidden="true" id="GovToken.balanceOf(address)"></a><code class="function-signature">balanceOf(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.transfer(address,uint256)"></a><code class="function-signature">transfer(address dst, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.transferFrom(address,address,uint256)"></a><code class="function-signature">transferFrom(address src, address dst, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.delegate(address)"></a><code class="function-signature">delegate(address delegatee)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"></a><code class="function-signature">delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.getCurrentVotes(address)"></a><code class="function-signature">getCurrentVotes(address account) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.getPriorVotes(address,uint256)"></a><code class="function-signature">getPriorVotes(address account, uint256 blockNumber) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>

Block number must be a finalized block or else this function will revert to prevent misinformation.




<h4><a class="anchor" aria-hidden="true" id="GovToken._delegate(address,address)"></a><code class="function-signature">_delegate(address delegator, address delegatee)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken._transferTokens(address,address,uint256)"></a><code class="function-signature">_transferTokens(address src, address dst, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken._moveDelegates(address,address,uint256)"></a><code class="function-signature">_moveDelegates(address srcRep, address dstRep, uint256 amount)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken._writeCheckpoint(address,uint32,uint256,uint256)"></a><code class="function-signature">_writeCheckpoint(address delegatee, uint32 nCheckpoints, uint256 oldVotes, uint256 newVotes)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.safe32(uint256,string)"></a><code class="function-signature">safe32(uint256 n, string errorMessage) <span class="return-arrow">→</span> <span class="return-type">uint32</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.getChainId()"></a><code class="function-signature">getChainId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.setMintAllowance(address,uint256)"></a><code class="function-signature">setMintAllowance(address _target, uint256 _mintAllowance) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.mint(address,uint256)"></a><code class="function-signature">mint(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.burn(address,uint256)"></a><code class="function-signature">burn(address _target, uint256 _amount) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.onTransferOwnership(address,address)"></a><code class="function-signature">onTransferOwnership(address, address)</code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="GovToken.DelegateChanged(address,address,address)"></a><code class="function-signature">DelegateChanged(address delegator, address fromDelegate, address toDelegate)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.DelegateVotesChanged(address,uint256,uint256)"></a><code class="function-signature">DelegateVotesChanged(address delegate, uint256 previousBalance, uint256 newBalance)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.Transfer(address,address,uint256)"></a><code class="function-signature">Transfer(address from, address to, uint256 amount)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="GovToken.Approval(address,address,uint256)"></a><code class="function-signature">Approval(address owner, address spender, uint256 amount)</code><span class="function-visibility"></span></h4>





### `Governance`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Governance.quorumVotes()"><code class="function-signature">quorumVotes()</code></a></li><li><a href="#Governance.proposalThreshold()"><code class="function-signature">proposalThreshold()</code></a></li><li><a href="#Governance.proposalMaxOperations()"><code class="function-signature">proposalMaxOperations()</code></a></li><li><a href="#Governance.votingDelay()"><code class="function-signature">votingDelay()</code></a></li><li><a href="#Governance.votingPeriod()"><code class="function-signature">votingPeriod()</code></a></li><li><a href="#Governance.constructor(address,address)"><code class="function-signature">constructor(address _timelock, address _gov)</code></a></li><li><a href="#Governance.propose(address[],uint256[],string[],bytes[],string)"><code class="function-signature">propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description)</code></a></li><li><a href="#Governance.queue(uint256)"><code class="function-signature">queue(uint256 proposalId)</code></a></li><li><a href="#Governance._queueOrRevert(address,uint256,string,bytes,uint256)"><code class="function-signature">_queueOrRevert(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Governance.execute(uint256)"><code class="function-signature">execute(uint256 proposalId)</code></a></li><li><a href="#Governance.cancel(uint256)"><code class="function-signature">cancel(uint256 proposalId)</code></a></li><li><a href="#Governance.getActions(uint256)"><code class="function-signature">getActions(uint256 proposalId)</code></a></li><li><a href="#Governance.getReceipt(uint256,address)"><code class="function-signature">getReceipt(uint256 proposalId, address voter)</code></a></li><li><a href="#Governance.state(uint256)"><code class="function-signature">state(uint256 proposalId)</code></a></li><li><a href="#Governance.castVote(uint256,bool)"><code class="function-signature">castVote(uint256 proposalId, bool support)</code></a></li><li><a href="#Governance.castVoteBySig(uint256,bool,uint8,bytes32,bytes32)"><code class="function-signature">castVoteBySig(uint256 proposalId, bool support, uint8 v, bytes32 r, bytes32 s)</code></a></li><li><a href="#Governance._castVote(address,uint256,bool)"><code class="function-signature">_castVote(address voter, uint256 proposalId, bool support)</code></a></li><li><a href="#Governance.add256(uint256,uint256)"><code class="function-signature">add256(uint256 a, uint256 b)</code></a></li><li><a href="#Governance.sub256(uint256,uint256)"><code class="function-signature">sub256(uint256 a, uint256 b)</code></a></li><li><a href="#Governance.getChainId()"><code class="function-signature">getChainId()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Governance.ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"><code class="function-signature">ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endTime, string description)</code></a></li><li><a href="#Governance.VoteCast(address,uint256,bool,uint256)"><code class="function-signature">VoteCast(address voter, uint256 proposalId, bool support, uint256 votes)</code></a></li><li><a href="#Governance.ProposalCanceled(uint256)"><code class="function-signature">ProposalCanceled(uint256 id)</code></a></li><li><a href="#Governance.ProposalQueued(uint256,uint256)"><code class="function-signature">ProposalQueued(uint256 id, uint256 eta)</code></a></li><li><a href="#Governance.ProposalExecuted(uint256)"><code class="function-signature">ProposalExecuted(uint256 id)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Governance.quorumVotes()"></a><code class="function-signature">quorumVotes() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.proposalThreshold()"></a><code class="function-signature">proposalThreshold() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.proposalMaxOperations()"></a><code class="function-signature">proposalMaxOperations() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.votingDelay()"></a><code class="function-signature">votingDelay() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.votingPeriod()"></a><code class="function-signature">votingPeriod() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.constructor(address,address)"></a><code class="function-signature">constructor(address _timelock, address _gov)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.propose(address[],uint256[],string[],bytes[],string)"></a><code class="function-signature">propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.queue(uint256)"></a><code class="function-signature">queue(uint256 proposalId)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance._queueOrRevert(address,uint256,string,bytes,uint256)"></a><code class="function-signature">_queueOrRevert(address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.execute(uint256)"></a><code class="function-signature">execute(uint256 proposalId)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.cancel(uint256)"></a><code class="function-signature">cancel(uint256 proposalId)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.getActions(uint256)"></a><code class="function-signature">getActions(uint256 proposalId) <span class="return-arrow">→</span> <span class="return-type">address[],uint256[],string[],bytes[]</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.getReceipt(uint256,address)"></a><code class="function-signature">getReceipt(uint256 proposalId, address voter) <span class="return-arrow">→</span> <span class="return-type">struct Governance.Receipt</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.state(uint256)"></a><code class="function-signature">state(uint256 proposalId) <span class="return-arrow">→</span> <span class="return-type">enum Governance.ProposalState</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.castVote(uint256,bool)"></a><code class="function-signature">castVote(uint256 proposalId, bool support)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.castVoteBySig(uint256,bool,uint8,bytes32,bytes32)"></a><code class="function-signature">castVoteBySig(uint256 proposalId, bool support, uint8 v, bytes32 r, bytes32 s)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance._castVote(address,uint256,bool)"></a><code class="function-signature">_castVote(address voter, uint256 proposalId, bool support)</code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.add256(uint256,uint256)"></a><code class="function-signature">add256(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.sub256(uint256,uint256)"></a><code class="function-signature">sub256(uint256 a, uint256 b) <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.getChainId()"></a><code class="function-signature">getChainId() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Governance.ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"></a><code class="function-signature">ProposalCreated(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endTime, string description)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.VoteCast(address,uint256,bool,uint256)"></a><code class="function-signature">VoteCast(address voter, uint256 proposalId, bool support, uint256 votes)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.ProposalCanceled(uint256)"></a><code class="function-signature">ProposalCanceled(uint256 id)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.ProposalQueued(uint256,uint256)"></a><code class="function-signature">ProposalQueued(uint256 id, uint256 eta)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Governance.ProposalExecuted(uint256)"></a><code class="function-signature">ProposalExecuted(uint256 id)</code><span class="function-visibility"></span></h4>





### `ITimelock`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#ITimelock.delay()"><code class="function-signature">delay()</code></a></li><li><a href="#ITimelock.GRACE_PERIOD()"><code class="function-signature">GRACE_PERIOD()</code></a></li><li><a href="#ITimelock.acceptAdmin()"><code class="function-signature">acceptAdmin()</code></a></li><li><a href="#ITimelock.queuedTransactions(bytes32)"><code class="function-signature">queuedTransactions(bytes32 hash)</code></a></li><li><a href="#ITimelock.queueTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#ITimelock.cancelTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#ITimelock.executeTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="ITimelock.delay()"></a><code class="function-signature">delay() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.GRACE_PERIOD()"></a><code class="function-signature">GRACE_PERIOD() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.acceptAdmin()"></a><code class="function-signature">acceptAdmin()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.queuedTransactions(bytes32)"></a><code class="function-signature">queuedTransactions(bytes32 hash) <span class="return-arrow">→</span> <span class="return-type">bool</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.queueTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.cancelTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="ITimelock.executeTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">external</span></h4>







### `Timelock`



<div class="contract-index"><span class="contract-index-title">Functions</span><ul><li><a href="#Timelock.constructor(address)"><code class="function-signature">constructor(address admin_)</code></a></li><li><a href="#Timelock.fallback()"><code class="function-signature">fallback()</code></a></li><li><a href="#Timelock.setDelay(uint256)"><code class="function-signature">setDelay(uint256 delay_)</code></a></li><li><a href="#Timelock.acceptAdmin()"><code class="function-signature">acceptAdmin()</code></a></li><li><a href="#Timelock.setPendingAdmin(address)"><code class="function-signature">setPendingAdmin(address pendingAdmin_)</code></a></li><li><a href="#Timelock.setAdmin(address)"><code class="function-signature">setAdmin(address _newAdmin)</code></a></li><li><a href="#Timelock.queueTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Timelock.cancelTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Timelock.executeTransaction(address,uint256,string,bytes,uint256)"><code class="function-signature">executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Timelock.getBlockTimestamp()"><code class="function-signature">getBlockTimestamp()</code></a></li></ul><span class="contract-index-title">Events</span><ul><li><a href="#Timelock.NewAdmin(address)"><code class="function-signature">NewAdmin(address newAdmin)</code></a></li><li><a href="#Timelock.NewPendingAdmin(address)"><code class="function-signature">NewPendingAdmin(address newPendingAdmin)</code></a></li><li><a href="#Timelock.NewDelay(uint256)"><code class="function-signature">NewDelay(uint256 newDelay)</code></a></li><li><a href="#Timelock.CancelTransaction(bytes32,address,uint256,string,bytes,uint256)"><code class="function-signature">CancelTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Timelock.ExecuteTransaction(bytes32,address,uint256,string,bytes,uint256)"><code class="function-signature">ExecuteTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li><li><a href="#Timelock.QueueTransaction(bytes32,address,uint256,string,bytes,uint256)"><code class="function-signature">QueueTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code></a></li></ul></div>



<h4><a class="anchor" aria-hidden="true" id="Timelock.constructor(address)"></a><code class="function-signature">constructor(address admin_)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.fallback()"></a><code class="function-signature">fallback()</code><span class="function-visibility">external</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.setDelay(uint256)"></a><code class="function-signature">setDelay(uint256 delay_)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.acceptAdmin()"></a><code class="function-signature">acceptAdmin()</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.setPendingAdmin(address)"></a><code class="function-signature">setPendingAdmin(address pendingAdmin_)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.setAdmin(address)"></a><code class="function-signature">setAdmin(address _newAdmin)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.queueTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">queueTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) <span class="return-arrow">→</span> <span class="return-type">bytes32</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.cancelTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">cancelTransaction(address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.executeTransaction(address,uint256,string,bytes,uint256)"></a><code class="function-signature">executeTransaction(address target, uint256 value, string signature, bytes data, uint256 eta) <span class="return-arrow">→</span> <span class="return-type">bytes</span></code><span class="function-visibility">public</span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.getBlockTimestamp()"></a><code class="function-signature">getBlockTimestamp() <span class="return-arrow">→</span> <span class="return-type">uint256</span></code><span class="function-visibility">internal</span></h4>







<h4><a class="anchor" aria-hidden="true" id="Timelock.NewAdmin(address)"></a><code class="function-signature">NewAdmin(address newAdmin)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.NewPendingAdmin(address)"></a><code class="function-signature">NewPendingAdmin(address newPendingAdmin)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.NewDelay(uint256)"></a><code class="function-signature">NewDelay(uint256 newDelay)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.CancelTransaction(bytes32,address,uint256,string,bytes,uint256)"></a><code class="function-signature">CancelTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.ExecuteTransaction(bytes32,address,uint256,string,bytes,uint256)"></a><code class="function-signature">ExecuteTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility"></span></h4>





<h4><a class="anchor" aria-hidden="true" id="Timelock.QueueTransaction(bytes32,address,uint256,string,bytes,uint256)"></a><code class="function-signature">QueueTransaction(bytes32 txHash, address target, uint256 value, string signature, bytes data, uint256 eta)</code><span class="function-visibility"></span></h4>





</div>
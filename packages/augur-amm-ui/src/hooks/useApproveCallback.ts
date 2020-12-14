import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount, CurrencyAmount, ETHER, Token } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin, getTradeType, TradingDirection } from '../utils'
import { useTokenContract, useTokenERC1155Contract } from './useContract'
import { useActiveWeb3React } from './index'
import { useAmmFactoryAddress, useWethWrapper } from '../contexts/Application'
import { useSingleCallResult } from '../state/multicall/hooks'
import { TradeInfo } from './Trades'
import { useMarketCashTokens } from '../contexts/Markets'
import { ParaShareToken } from '@augurproject/sdk-lite/build'
import { AmmMarket, REMOVE_NEEDS_APPROVAL } from '../constants'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(() => (token && allowance ? new TokenAmount(token, allowance.toString()) : undefined), [
    token,
    allowance
  ])
}

export function useIsTokenApprovedForAll(account?: string, paraShareToken?: string, spender?: string): boolean | undefined {
  const contract = useTokenERC1155Contract(paraShareToken, false)

  const inputs = useMemo(() => [account, spender], [account, spender])
  const isApproved = useSingleCallResult(contract, 'isApprovedForAll', inputs).result

  return useMemo(() => (isApproved ? isApproved[0] : false), [
    paraShareToken,
    spender,
    isApproved
  ])
}

export function useApproveCallbackRemoveLiquidity(
  amountToApprove?: CurrencyAmount,
  ammExchange?: AmmMarket,
): [ApprovalState, () => Promise<void>] {
  const spender = useWethWrapper()
  const [approval, approveCallback] = useApproveCallback(amountToApprove, spender);
  const needsApproval = REMOVE_NEEDS_APPROVAL.includes(ammExchange?.cash?.name)

  if (!needsApproval) return [ApprovalState.APPROVED, null]

    return [approval, approveCallback]

}


export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency?.symbol || amountToApprove.currency?.name,
          approval: { tokenAddress: token.address, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

export function useApproveERC1155Callback(
  paraShareToken?: string,
  spender?: string,
  cash?: Token
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const pendingApproval = useHasPendingApproval(paraShareToken, spender)
  const isApproved = useIsTokenApprovedForAll(account, paraShareToken, spender)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    return isApproved
      ? ApprovalState.APPROVED
      : pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
  }, [paraShareToken, pendingApproval, spender, isApproved])

  const tokenContract = useTokenERC1155Contract(paraShareToken)
  const addTransaction = useTransactionAdder()
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!paraShareToken) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const estimatedGas = await tokenContract.estimateGas.setApprovalForAll(spender, true).catch(() => {
      return tokenContract.estimateGas.setApprovalForAll(spender, true)
    })

    return tokenContract
      .setApprovalForAll(spender, true, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + cash.symbol || cash?.name,
          approval: { tokenAddress: paraShareToken, spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, paraShareToken, tokenContract, spender, addTransaction])

  return [approvalState, approve]
}
// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(ammExchange) {
  const ammFactory = useAmmFactoryAddress()
  const cashes = useMarketCashTokens()
  const cash = cashes[ammExchange?.shareToken?.cash?.id]
  return useApproveERC1155Callback(ammExchange?.shareToken?.id, ammFactory, cash)
}

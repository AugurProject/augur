import { ApprovalState } from "../constants"
import { useActiveWeb3React } from '../ConnectAccount/hooks';
import { useMemo } from "react";
import { getERC20Allowance } from "../../utils/contract-calls";
import { BigNumber as BN } from 'bignumber.js'
import { useAppStatusStore } from "../stores/app-status";

export const useIsTokenApproved = (tokenAddress: string, spender: string): Promise<boolean> => {
  const { account, library } = useActiveWeb3React();

  return useMemo(async () => {
    const allowance = await getERC20Allowance(tokenAddress, library, account, spender);
    return allowance && new BN(allowance).gt(0) ? true : false
  }, [
    account,
    library,
    tokenAddress,
    spender,
  ])
}

const useHasPendingTransaction = (tokenAddress: string, spender: string): boolean => {
  const { transactions } = useAppStatusStore()
  if (!transactions || transactions.length === 0) return false;
  if (!tokenAddress || !spender) return false;

  return useMemo(() => {
    const tx = transactions.find(tx => tx.)
  }, [tokenAddress, spender, transactions])

}

export function useApproveCallback(
  tokenAddress: string,
  spender: string,
): [ApprovalState, () => Promise<void>] {
  const isApproved = useIsTokenApproved(tokenAddress, spender)
  const { transactions, actions: { addTransaction } } = useAppStatusStore()
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!tokenAddress || !spender) return ApprovalState.UNKNOWN

    return isApproved
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [isApproved, pendingApproval, spender])

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
          summary: 'Approve ' + amountToApprove.currency?.symbol || amountToApprove.currency?.name || 'for process',
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

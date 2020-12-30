import { ApprovalState } from "../constants"
import { useActiveWeb3React } from '../ConnectAccount/hooks';
import { useCallback, useMemo } from "react";
import { getERC20Allowance, getErc20Contract } from "../../utils/contract-calls";
import { BigNumber as BN } from 'bignumber.js'
import { useAppStatusStore } from "../stores/app-status";
import { TransactionResponse } from '@ethersproject/providers'

const APPROVAL_AMOUNT = String(new BN(2 ** 255).minus(1));

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

const useHasPendingTransaction = (account: string, tokenAddress: string, spender: string): boolean => {
  const { transactions } = useAppStatusStore()

  return useMemo(() => {
    if (!account || !tokenAddress || !spender) return false;
    const tx = Object.values(transactions).find(tx => tx.approval
      && !tx.receipt
      && tx?.approval?.spender === spender
      && tx?.approval?.tokenAddress === tokenAddress)
    return Boolean(tx);
  }, [account, tokenAddress, spender, transactions])

}

export function useApproveCallback(
  tokenAddress: string,
  approvingName: string,
  spender: string,
): [ApprovalState, () => Promise<void>] {
  const isApproved = useIsTokenApproved(tokenAddress, spender)
  const { chainId, account, library } = useActiveWeb3React()
  const pendingApproval = useHasPendingTransaction(account, tokenAddress, spender);
  const { actions: { addTransaction } } = useAppStatusStore()
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!tokenAddress || !spender) return ApprovalState.UNKNOWN


    return isApproved
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [isApproved, pendingApproval, spender, tokenAddress])

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const tokenContract = getErc20Contract(tokenAddress, library, account);
    const estimatedGas = await tokenContract.estimateGas.approve(spender, APPROVAL_AMOUNT).catch(() => {
      // general fallback for tokens who restrict approval amounts
      return tokenContract.estimateGas.approve(spender, APPROVAL_AMOUNT)
    })

    return tokenContract
      .approve(spender, APPROVAL_AMOUNT, {
        gasLimit: estimatedGas
      })
      .then((response: TransactionResponse) => {
        const { hash } = response;
        addTransaction({
          hash,
          chainId,
          from: account,
          summary: `Approve ${approvingName || 'for process'}`,
          approval: { tokenAddress: tokenAddress, spender: spender }
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, tokenAddress, spender, approvingName, account, library, addTransaction, chainId])

  return [approvalState, approve]
}

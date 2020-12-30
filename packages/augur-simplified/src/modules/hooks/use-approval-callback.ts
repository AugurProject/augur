import { ApprovalState, ETH } from "../constants"
import { useActiveWeb3React } from '../ConnectAccount/hooks';
import { useCallback, useMemo } from "react";
import { getERC1155ApprovedForAll, getErc1155Contract, getERC20Allowance, getErc20Contract } from "../../utils/contract-calls";
import { BigNumber as BN } from 'bignumber.js'
import { useAppStatusStore } from "../stores/app-status";
import { TransactionResponse } from '@ethersproject/providers'
import { AmmExchange, TradingDirection } from "../types";

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
          hash: {
            hash,
            chainId,
            from: account,
            summary: `Approve ${approvingName || 'for use'}`,
            approval: { tokenAddress: tokenAddress, spender: spender }
          },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, tokenAddress, spender, approvingName, account, library, addTransaction, chainId])

  return [approvalState, approve]
}

export const useIsTokenApprovedForAll = async (erc1155Address?: string, spender?: string): Promise<boolean | undefined> => {
  const { account, library } = useActiveWeb3React();

  return useMemo(async () => {
    const isApproved = await getERC1155ApprovedForAll(erc1155Address, library, account, spender);
    return isApproved;
  }, [
    erc1155Address,
    spender,
    account,
    library
  ])
}

export function useApproveERC1155Callback(
  erc1155Address?: string,
  approvingName?: string,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account, library } = useActiveWeb3React();
  const { actions: { addTransaction } } = useAppStatusStore()
  const pendingApproval = useIsTokenApproved(erc1155Address, spender)
  const isApproved = useIsTokenApprovedForAll(erc1155Address, spender)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    return isApproved
      ? ApprovalState.APPROVED
      : pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
  }, [pendingApproval, isApproved])

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!erc1155Address) {
      console.error('no token')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    const tokenContract = getErc1155Contract(erc1155Address, library, account);
    const estimatedGas = await tokenContract.estimateGas.setApprovalForAll(spender, true).catch(() => {
      return tokenContract.estimateGas.setApprovalForAll(spender, true)
    })

    return tokenContract
      .setApprovalForAll(spender, true, {
        gasLimit: estimatedGas
      })
      .then((response: TransactionResponse) => {
        const { hash } = response;
        addTransaction({
          [hash]: {
            hash,
            from: account,
            summary: `Approve ${approvingName || 'for use'}`,
            approval: { tokenAddress: erc1155Address, spender }
          },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, erc1155Address, account, spender, addTransaction, approvingName, library])

  return [approvalState, approve]
}

/*
# AMM Middleware: Approvals Needed for Methods
method                  | USDx                  | ETH
----------------------------------------------------------------
doAddLiquidity          | cash: factory         | none
doRemoveLiquidity       | none                  | amm: wrapper
doEnterPosition         | cash: factory         | none
doExitPosition          | share: factory        | share: wrapper
doSwap                  | share: factory        | share: factory
*/

// wraps useApproveCallback in the context of a swap
export const useApproveCallbackForTrade = (ammExchange: AmmExchange, isEnter: boolean): [ApprovalState, () => Promise<void>] => {
  const { paraConfig: { addresses } } = useAppStatusStore()
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const { cash } = ammExchange;
  const { shareToken } = cash;
  const approvingName = cash.symbol;
  const isETH = cash.symbol === ETH;

  const [approveShareWrapperStatus, approveShareWrapper] = useApproveERC1155Callback(shareToken, approvingName, WethWrapperForAMMExchange);
  const [approveShareFactoryStatus, approveShareFactory] = useApproveERC1155Callback(shareToken, approvingName, AMMFactory);
  const [approveFactoryStatus, approveFactory] = useApproveCallback(cash.address, approvingName, AMMFactory);

  if (isEnter) {
    if (isETH) return [ApprovalState.APPROVED, () => null]
    return [approveShareFactoryStatus, approveShareFactory]
  }
  if (isETH) {
    return [approveShareWrapperStatus, approveShareWrapper]
  }
  return [approveFactoryStatus, approveFactory]
}

// wraps useApproveCallback in the context of a swap
export const useApproveCallbackForLiquidity = (ammExchange: AmmExchange, isAdd: boolean): [ApprovalState, () => Promise<void>] => {
  const { paraConfig: { addresses } } = useAppStatusStore()
  const { AMMFactory, WethWrapperForAMMExchange } = addresses;
  const { cash } = ammExchange;
  const approvingName = cash.symbol;
  const isETH = cash.symbol === ETH;

  const [approveCashFactoryStatus, approveCashFactory] = useApproveCallback(cash.address, approvingName, AMMFactory);
  const [approveAmmWrapperStatus, approveAmmWrapper] = useApproveCallback(ammExchange.id, approvingName, WethWrapperForAMMExchange);

  if (isAdd) {
    if (isETH) return [ApprovalState.APPROVED, () => null]
    return [approveCashFactoryStatus, approveCashFactory]
  }
  if (isETH) {
    return [approveAmmWrapperStatus, approveAmmWrapper]
  }
  return [ApprovalState.APPROVED, () => null]
}

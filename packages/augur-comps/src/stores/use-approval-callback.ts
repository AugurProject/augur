import { ApprovalState, ETH, TX_STATUS } from '../utils/constants';
import { useActiveWeb3React } from '../components/ConnectAccount/hooks';
import { useCallback, useMemo } from 'react';
import {
  getERC1155ApprovedForAll,
  getErc1155Contract,
  getERC20Allowance,
  getErc20Contract,
} from '../utils/contract-calls';
import { BigNumber as BN } from 'bignumber.js';
import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { AmmExchange, LoginAccount, TransactionDetails } from '../utils/types';
import { useUserStore } from './user';
import { PARA_CONFIG } from './constants';

const APPROVAL_AMOUNT = String(new BN(2 ** 255).minus(1));

export const useIsTokenApproved = (tokenAddress: string): Promise<boolean> => {
  const { loginAccount } = useUserStore();

  return useMemo(async () => {
    if (loginAccount) {
      const allowance = await getERC20Allowance(
        tokenAddress,
        loginAccount.library,
        loginAccount.account,
        loginAccount.account
      );
      return allowance && new BN(allowance).gt(0) ? true : false;
    }
    return false;
  }, [loginAccount, tokenAddress]);
};

export const useIsTokenApprovedSpender = (
  tokenAddress: string,
  spender: string
): Promise<boolean> => {
  const { account, library } = useActiveWeb3React();

  return useMemo(async () => {
    const allowance = await getERC20Allowance(
      tokenAddress,
      library,
      account,
      spender
    );
    return allowance && new BN(allowance).gt(0) ? true : false;
  }, [account, library, tokenAddress, spender]);
};

const useHasPendingTransaction = (
  account: string,
  tokenAddress: string,
  spender: string
): boolean => {
  const { transactions } = useUserStore();

  return useMemo(() => {
    if (!account || !tokenAddress || !spender) return false;
    const tx = Object.values(transactions).find(
      (tx) =>
        tx.approval &&
        tx.status === TX_STATUS.PENDING &&
        tx?.approval?.spender === spender &&
        tx?.approval?.tokenAddress === tokenAddress
    );
    return Boolean(tx);
  }, [account, tokenAddress, spender, transactions]);
};

export function useApproveCallback(
  tokenAddress: string,
  approvingName: string,
  spender: string
): [ApprovalState, () => Promise<void>] {
  const isApproved = useIsTokenApprovedSpender(tokenAddress, spender);
  const { chainId, account, library } = useActiveWeb3React();
  const pendingApproval = useHasPendingTransaction(
    account,
    tokenAddress,
    spender
  );
  const {
    actions: { addTransaction },
  } = useUserStore();
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!tokenAddress || !spender) return ApprovalState.UNKNOWN;

    return isApproved
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [isApproved, pendingApproval, spender, tokenAddress]);

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    const tokenContract = getErc20Contract(tokenAddress, library, account);
    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, APPROVAL_AMOUNT)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        return tokenContract.estimateGas.approve(spender, APPROVAL_AMOUNT);
      });

    return tokenContract
      .approve(spender, APPROVAL_AMOUNT, {
        gasLimit: estimatedGas,
      })
      .then((response: TransactionResponse) => {
        const { hash } = response;
        addTransaction({
          hash,
          chainId,
          addedTime: new Date().getTime(),
          from: account,
          summary: `Approve ${approvingName || 'for use'}`,
          approval: { tokenAddress: tokenAddress, spender: spender },
        });
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error);
        throw error;
      });
  }, [
    approvalState,
    tokenAddress,
    spender,
    approvingName,
    account,
    library,
    addTransaction,
    chainId,
  ]);

  return [approvalState, approve];
}

export const useIsTokenApprovedForAll = async (
  erc1155Address?: string,
  spender?: string
): Promise<boolean | undefined> => {
  const { account, library } = useActiveWeb3React();

  return useMemo(async () => {
    const isApproved = await getERC1155ApprovedForAll(
      erc1155Address,
      library,
      account,
      spender
    );
    return isApproved;
  }, [erc1155Address, spender, account, library]);
};

export function useApproveERC1155Callback(
  erc1155Address?: string,
  approvingName?: string,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { chainId, account, library } = useActiveWeb3React();
  const {
    actions: { addTransaction },
  } = useUserStore();
  const pendingApproval = useIsTokenApprovedSpender(erc1155Address, spender);
  const isApproved = useIsTokenApprovedForAll(erc1155Address, spender);
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    return isApproved
      ? ApprovalState.APPROVED
      : pendingApproval
      ? ApprovalState.PENDING
      : ApprovalState.NOT_APPROVED;
  }, [pendingApproval, isApproved]);

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!erc1155Address) {
      console.error('no token');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    const tokenContract = getErc1155Contract(erc1155Address, library, account);
    const estimatedGas = await tokenContract.estimateGas
      .setApprovalForAll(spender, true)
      .catch(() => {
        return tokenContract.estimateGas.setApprovalForAll(spender, true);
      });

    return tokenContract
      .setApprovalForAll(spender, true, {
        gasLimit: estimatedGas,
      })
      .then((response: TransactionResponse) => {
        const { hash } = response;
        addTransaction({
          hash,
          chainId,
          from: account,
          addedTime: new Date().getTime(),
          summary: `Approve ${approvingName || 'for use'}`,
          approval: { tokenAddress: erc1155Address, spender },
        });
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error);
        throw error;
      });
  }, [
    approvalState,
    erc1155Address,
    account,
    spender,
    addTransaction,
    approvingName,
    library,
    chainId,
  ]);

  return [approvalState, approve];
}

/*
# AMM Middleware: Approvals Needed for Methods
method                  | USDx                  | ETH
----------------------------------------------------------------
doAddLiquidity          | cash: factory         | none
doRemoveLiquidity (1)   | bal pool: factory     | bal pool: factory
doRemoveLiquidity (2)   | amm: factory          | amm: factory
doEnterPosition         | cash: factory         | none
doExitPosition          | share: factory        | share: wrapper
doSwap                  | share: factory        | share: factory
claim winnings          | none                  | share: wrapper
*/

// wraps useApproveCallback in the context of a swap
export const useApproveCallbackForTrade = (
  ammExchange: AmmExchange,
  isEnter: boolean
): [ApprovalState, () => Promise<void>] => {
  const {
    addresses: { AMMFactory, WethWrapperForAMMExchange },
  } = PARA_CONFIG;
  const { cash } = ammExchange;
  const { shareToken } = cash;
  const approvingName = cash.name;
  const isETH = cash.name === ETH;

  const [
    approveShareWrapperStatus,
    approveShareWrapper,
  ] = useApproveERC1155Callback(
    shareToken,
    approvingName,
    WethWrapperForAMMExchange
  );
  const [
    approveShareFactoryStatus,
    approveShareFactory,
  ] = useApproveERC1155Callback(shareToken, approvingName, AMMFactory);
  const [approveFactoryStatus, approveFactory] = useApproveCallback(
    cash?.address,
    approvingName,
    AMMFactory
  );

  if (isEnter) {
    if (isETH) return [ApprovalState.APPROVED, () => null];
    return [approveShareFactoryStatus, approveShareFactory];
  }
  if (isETH) {
    return [approveShareWrapperStatus, approveShareWrapper];
  }
  return [approveFactoryStatus, approveFactory];
};

// wraps useApproveCallback in the context of a swap
export const useApproveCallbackForLiquidity = (
  ammExchange: AmmExchange,
  isAdd: boolean
): [ApprovalState, () => Promise<void>] => {
  const {
    addresses: { AMMFactory, WethWrapperForAMMExchange },
  } = PARA_CONFIG;
  const { cash } = ammExchange;
  const approvingName = cash.name;
  const isETH = cash.name === ETH;

  const [approveCashFactoryStatus, approveCashFactory] = useApproveCallback(
    cash?.address,
    approvingName,
    AMMFactory
  );
  const [approveAmmWrapperStatus, approveAmmWrapper] = useApproveCallback(
    ammExchange.id,
    approvingName,
    WethWrapperForAMMExchange
  );

  if (isAdd) {
    if (isETH) return [ApprovalState.APPROVED, () => null];
    return [approveCashFactoryStatus, approveCashFactory];
  }
  if (isETH) {
    return [approveAmmWrapperStatus, approveAmmWrapper];
  }
  return [ApprovalState.APPROVED, () => null];
};

export const hasPendingTransaction = async (
  transactions: TransactionDetails[],
  account: string,
  tokenAddress: string,
  spender: string
): Promise<boolean> => {
  if (!account || !tokenAddress || !spender) return false;
  const tx = Object.values(transactions).find(
    (tx) =>
      tx.approval &&
      !tx.receipt &&
      tx?.approval?.spender === spender &&
      tx?.approval?.tokenAddress === tokenAddress
  );
  return Boolean(tx);
};

export async function checkAllowance(
  tokenAddress: string,
  spender: string,
  loginAccount: LoginAccount,
  transactions: TransactionDetails[]
): Promise<ApprovalState> {
  const { account, library } = loginAccount;
  const allowance = await getERC20Allowance(
    tokenAddress,
    library,
    account,
    spender
  );
  if (allowance && new BN(allowance).gt(0)) {
    return ApprovalState.APPROVED;
  }
  const isPending = await hasPendingTransaction(
    transactions,
    account,
    tokenAddress,
    spender
  );
  return isPending ? ApprovalState.PENDING : ApprovalState.NOT_APPROVED;
}

export const checkIsERC20Approved = async (
  erc20TokenAddress: string,
  spender: string,
  account: string,
  library: Web3Provider
) => {
  const allowance = await getERC20Allowance(
    erc20TokenAddress,
    library,
    account,
    spender
  );
  return new BN(allowance || '0').gt(0);
};

export const checkIsERC1155Approved = async (
  erc1155Address: string,
  spender: string,
  account: string,
  library: Web3Provider
) => await getERC1155ApprovedForAll(erc1155Address, library, account, spender);

export const isERC1155ContractApproved = async (
  erc1155Address: string,
  spender: string,
  loginAccount: LoginAccount,
  transactions: TransactionDetails[]
) => {
  const { account, library } = loginAccount;
  const isPending = await hasPendingTransaction(
    transactions,
    loginAccount.account,
    erc1155Address,
    spender
  );
  const isApproved = await getERC1155ApprovedForAll(
    erc1155Address,
    library,
    account,
    spender
  );

  return isApproved
    ? ApprovalState.APPROVED
    : isPending
    ? ApprovalState.PENDING
    : ApprovalState.NOT_APPROVED;
};

export const approveERC20Contract = async (
  tokenAddress: string,
  approvingName: string,
  spender: string,
  loginAccount: LoginAccount
) => {
  const { chainId, account, library } = loginAccount;
  if (!spender) {
    console.error('no spender');
    return null;
  }

  const tokenContract = getErc20Contract(tokenAddress, library, account);
  const estimatedGas = await tokenContract.estimateGas
    .approve(spender, APPROVAL_AMOUNT)
    .catch(() => {
      // general fallback for tokens who restrict approval amounts
      return tokenContract.estimateGas.approve(spender, APPROVAL_AMOUNT);
    });

  try {
    const response: TransactionResponse = await tokenContract.approve(
      spender,
      APPROVAL_AMOUNT,
      {
        gasLimit: estimatedGas,
      }
    );
    const { hash } = response;
    return {
      hash,
      chainId,
      addedTime: new Date().getTime(),
      seen: false,
      status: TX_STATUS.PENDING,
      marketDescription: null,
      from: account,
      message: `Approve ${approvingName || 'for use'}`,
      approval: { tokenAddress: tokenAddress, spender: spender },
    };
  } catch (error) {
    console.debug('Failed to approve token', error);
    throw error;
  }
};

export const approveERC1155Contract = async (
  erc1155Address: string,
  approvingName: string,
  spender: string,
  loginAccount: LoginAccount
) => {
  const { chainId, account, library } = loginAccount;

  const tokenContract = getErc1155Contract(erc1155Address, library, account);
  const estimatedGas = await tokenContract.estimateGas
    .setApprovalForAll(spender, true)
    .catch(() => {
      return tokenContract.estimateGas.setApprovalForAll(spender, true);
    });

  try {
    const response: TransactionResponse = await tokenContract.setApprovalForAll(
      spender,
      true,
      {
        gasLimit: estimatedGas,
      }
    );

    const { hash } = response;
    return {
      hash,
      chainId,
      addedTime: new Date().getTime(),
      seen: false,
      status: TX_STATUS.PENDING,
      marketDescription: null,
      from: account,
      message: `Approve ${approvingName || 'for use'}`,
      approval: { tokenAddress: erc1155Address, spender },
    };
  } catch (error) {
    console.debug('Failed to approve token', error);
    throw error;
  }
};

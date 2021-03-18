import { useEffect } from 'react';
import { TransactionDetails } from '../types';
import { PARA_CONFIG } from './constants';
import { useUserStore } from '@augurproject/augur-comps';
import { useMigrationStore } from './migration-store';
import {
  getLegacyRepBalance,
  getRepBalance,
  isRepV2Approved,
  getRepTotalMigrated,
} from '../../utils/contract-calls';
import { TX_STATUS } from '../../../../augur-simplified/src/modules/constants';

export async function getRepBalances(provider, address) {
  const rep = await getRepBalance(provider, address);
  const legacyRep = await getLegacyRepBalance(provider, address);
  return {
    rep: rep.toString(),
    legacyRep: legacyRep.toString(),
  };
}

export function useUserBalances() {
  const {
    loginAccount,
    actions: { updateUserBalances },
  } = useUserStore();
  const { timestamp, isMigrated } = useMigrationStore();
  useEffect(() => {
    let isMounted = true;
    const fetchUserBalances = (library, account) =>
      getRepBalances(library, account);
    if (loginAccount?.library && loginAccount?.account) {
      fetchUserBalances(loginAccount.library, loginAccount.account).then(
        (userBalances) => isMounted && updateUserBalances(userBalances)
      );
    }

    return () => {
      isMounted = false;
    };
  }, [
    loginAccount?.account,
    loginAccount?.library,
    PARA_CONFIG,
    timestamp,
    isMigrated,
  ]);
}

export async function getRepMigrated() {
  const rep = await getRepTotalMigrated();
  return rep;
}

export function useRepMigrated() {
  const {
    timestamp,
    isMigrated,
    actions: { updateTotalRepMigrated },
  } = useMigrationStore();
  useEffect(() => {
    let isMounted = true;
    const fetchRepMigrated = () => getRepMigrated();
    fetchRepMigrated().then(
      (repMigrated) => isMounted && updateTotalRepMigrated(repMigrated)
    );

    return () => {
      isMounted = false;
    };
  }, [PARA_CONFIG, timestamp, isMigrated]);
}

export function useFinalizeUserTransactions() {
  const {
    loginAccount,
    transactions,
    actions: { finalizeTransaction },
  } = useUserStore();
  const {
    actions: { updateMigrated },
  } = useMigrationStore();
  const { timestamp } = useMigrationStore();
  useEffect(() => {
    if (loginAccount?.account && transactions?.length > 0) {
      transactions
        .filter((t) => t.status === TX_STATUS.PENDING)
        .forEach((t: TransactionDetails) => {
          loginAccount.library.getTransactionReceipt(t.hash).then((receipt) => {
            if (receipt && t.type === 'MIGRATE') {
              updateMigrated(true);
            }
            if (receipt) {
              finalizeTransaction(t.hash, receipt.status ? TX_STATUS.CONFIRMED : TX_STATUS.FAILURE);
            }
          });
        });
    }
  }, [loginAccount, timestamp, transactions]);
}

export function useUpdateApprovals() {
  const { loginAccount } = useUserStore();
  const {
    actions: { updateApproval },
  } = useMigrationStore();
  const { timestamp } = useMigrationStore();
  useEffect(() => {
    let isMounted = true;
    const checkApproval = (library, account) =>
      isRepV2Approved(library, account);
    if (loginAccount?.library && loginAccount?.account) {
      checkApproval(loginAccount.library, loginAccount.account).then(
        (isApproved) => isMounted && updateApproval(isApproved)
      );
    }
    return () => {
      isMounted = false;
    };
  }, [loginAccount?.account, loginAccount?.library, PARA_CONFIG, timestamp]);
}

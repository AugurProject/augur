import { useCallback } from "react";
import { TransactionResponse } from '@ethersproject/providers'
import { AmmMarket } from "../constants";
import { ParaShareToken } from '@augurproject/sdk-lite'
import { useTransactionAdder } from '../state/transactions/hooks'
import { getContract } from "../utils";
import { useActiveWeb3React } from ".";
import { ethers } from "ethers";

export function useClaimTradingProceeds() {
  const { library, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder();

  const claimWinnings = useCallback(async (paraShareToken?: string, market?: AmmMarket): Promise<void> => {
    const contract = getContract(paraShareToken, ParaShareToken.ABI, library, account);
    return contract
    .claimTradingProceeds(market?.id, account, ethers.utils.formatBytes32String('11'))
    .then((response: TransactionResponse) => {
      addTransaction(response, {
        summary: 'Claimed winnings ' + market.description,
        claim: { recipient: account }
      })
    })
    .catch((error: Error) => {
      console.debug('Failed to claim winnings', error)
      throw error
    })}, [account])

  return { claimWinnings }
}

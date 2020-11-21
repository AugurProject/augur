import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { SwapParameters, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { doTrade, formatShares, isMarketCurrency } from '../utils'
import { useActiveWeb3React } from './index'
import { TradeInfo } from './Trades'
import { useAugurClient } from '../contexts/Application'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}


// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: TradeInfo | undefined, // trade to execute, required
  outputAmount: TokenAmount,
  minAmount: string
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const augurClient = useAugurClient()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (outputAmount) {
      return {
        state: SwapCallbackState.VALID,
        callback: async function onSwap(): Promise<string> {
          return doTrade(augurClient, trade, minAmount)
            .then((response: any) => {
              console.log('tx response', JSON.stringify(response))
              const inputSymbol = trade?.inputAmount?.currency?.symbol
              const outputSymbol = trade?.currencyOut?.symbol
              const inputAmount = trade?.inputAmount?.toSignificant(6)
              let oAmount = outputAmount?.toSignificant(6)
              if (isMarketCurrency(outputAmount?.currency)) {
                oAmount = formatShares(String(outputAmount.raw), String(outputAmount?.currency?.decimals))
              }

              addTransaction(response, {
                summary: `Swap ${inputAmount} ${inputSymbol} for ${oAmount} ${outputSymbol}`
              })

              return response.hash
            })
            .catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error('Transaction rejected.')
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error)
                throw new Error(`Swap failed: ${error.message}`)
              }
            })
        },
        error: null
      }
    } else {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Currently Estimating' }
    }
  }, [augurClient, trade, library, account, chainId, addTransaction, outputAmount, minAmount])
}

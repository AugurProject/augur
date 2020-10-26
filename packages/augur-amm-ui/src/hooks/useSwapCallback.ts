import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, TokenAmount, Trade, TradeType } from '@uniswap/sdk'
import { useMemo } from 'react'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, doTrade, isAddress, shortenAddress } from '../utils'
import isZero from '../utils/isZero'
import { useActiveWeb3React } from './index'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './useENS'
import { TradeInfo } from './Trades'
import { useAugurClient } from '../contexts/Application'
import { BigNumber as BN } from 'bignumber.js'

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

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    // TODO need to just use augurClient
    const contract: Contract | null = null // useAmmFactoryAddress()
    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber()
      })
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber()
        })
      )
    }
    return swapMethods.map(parameters => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade])
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
              const inputSymbol = trade.inputAmount.currency.symbol
              const outputSymbol = trade.currencyOut?.symbol
              const inputAmount = trade.inputAmount.toSignificant(6)
              const oAmount = outputAmount?.toSignificant(6)

              const base = `Swap ${inputAmount} ${inputSymbol} for ${oAmount} ${outputSymbol}`
              const withRecipient = base

              addTransaction(response, {
                summary: withRecipient
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
  }, [trade, library, account, chainId, addTransaction, outputAmount, minAmount])
}

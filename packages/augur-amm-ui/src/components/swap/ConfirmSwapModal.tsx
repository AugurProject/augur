import { TokenAmount } from '@uniswap/sdk'
import React, { useCallback } from 'react'
import { TradeInfo } from '../../hooks/Trades'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'


export default function ConfirmSwapModal({
  trade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  minAmount,
  outputAmount,
}: {
  isOpen: boolean
  trade: TradeInfo | undefined
  originalTrade: TradeInfo | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void,
  minAmount: string,
  outputAmount: TokenAmount
}) {
  const showAcceptChanges = false

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        outputAmount={outputAmount}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, outputAmount])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        minAmount={minAmount}
        outputAmount={outputAmount}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, swapErrorMessage, trade, outputAmount, minAmount])

  // text to show while loading
  const pendingText = `Swapping ${trade?.inputAmount?.toSignificant(6)} ${
    trade?.currencyIn?.symbol
  } for ${outputAmount?.toSignificant(6)} ${trade?.currencyOut?.symbol}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Swap"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

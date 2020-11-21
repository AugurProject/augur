import { CurrencyAmount, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonError, ButtonGray, ButtonConfirmed } from '../../components/ButtonStyled'
import Card, { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import ProgressSteps from '../../components/ProgressSteps'
import { withRouter } from 'react-router-dom'
import { BigNumber as BN } from 'bignumber.js'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../Theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import Loader from '../../components/Loader'
import { RouteComponentProps } from 'react-router-dom'
import { TradeInfo } from '../../hooks/Trades'
import { estimateTrade, formatShares, formatToDisplayValue, toPercent } from '../../utils'
import { useAugurClient } from '../../contexts/Application'
import { useMarketAmm } from '../../contexts/Markets'
import { useMarketBalance } from '../../state/wallet/hooks'

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text1};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

function Swap({ marketId, amm }: RouteComponentProps<{ inputCurrencyId?: string; outputCurrencyId?: string }>) {
  const { chainId } = useActiveWeb3React()
  const augurClient = useAugurClient()
  const theme = useContext(ThemeContext)

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
  const { account } = useActiveWeb3React()
  const ammExchange = useMarketAmm(marketId, amm)
  const userCashBalances = useMarketBalance(marketId, ammExchange?.shareToken?.cash?.id)

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  const [minAmount, setMinAmount] = useState(null)
  const [outputAmount, setOutputAmount] = useState(null)
  const [realizedLPFee, setRealizedLPFee] = useState("0")

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade: trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo(
    account,
    ammExchange,
    userCashBalances
   )

  useEffect(() => {
    async function estimate(augurClient, trade) {
      try {
        const resultWithFee = await estimateTrade(augurClient, trade, true);
        if (resultWithFee) {
          console.log('estimate trade with fee', resultWithFee, trade.currencyOut.decimals, trade)
          const outToken = new Token(
            chainId,
            trade.marketId,
            trade.currencyOut.decimals,
            trade.currencyOut.symbol,
            trade.currencyOut.name
          )
          const estCurrency = resultWithFee === '0' ? null : new TokenAmount(outToken, JSBI.BigInt(String(resultWithFee)))
          setOutputAmount(estCurrency)
        }
        const resultWithoutFee = await estimateTrade(augurClient, trade, false);
        console.log('estimate trade without fee', resultWithoutFee, trade)
        let feeValue = "0";
        if (resultWithoutFee) feeValue = String(resultWithoutFee)
        // TODO: get currency the fee will be paid in
        setRealizedLPFee(formatToDisplayValue(feeValue, trade.currencyOut.decimals))
      } catch (e) {
        console.error("Estimate trade error:", e)
        setOutputAmount(null)
      }
    }
    if (trade && trade.currencyIn) {
      estimate(augurClient, trade)
    }
  }, [trade])

  useEffect(() => {
    if (outputAmount) {
      const slippage = new BN(allowedSlippage).div(100).div(100)
      const slipAmount = new BN(String(outputAmount.raw))
        .minus(new BN(String(outputAmount.raw)).multipliedBy(slippage))
        .decimalPlaces(0)
      setMinAmount(String(slipAmount))
    }
  }, [trade, outputAmount, allowedSlippage, setMinAmount])

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : outputAmount
  }

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: TradeInfo | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(ammExchange)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, outputAmount, minAmount)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action: 'Swap w/o Send',
          label: [trade?.inputAmount?.currency?.symbol, trade?.currencyOut?.symbol, 'version x.x'].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, priceImpactWithoutFee, showConfirm, swapCallback, trade])

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  return (
    <>
      <AppBody>
        <SwapPoolTabs token={marketId} />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
            minAmount={minAmount}
            outputAmount={outputAmount}
            realizedLPFee={realizedLPFee}
          />

          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable={false}>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      //setApprovalSubmitted(false) // reset 2 step UI for approvals
                      //onSwitchTokens()
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={Boolean(outputAmount) ? formatShares(String(outputAmount.raw), outputAmount.token.decimals) : ''}
              onUserInput={handleTypeOutput}
              label={'To (estimated)'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              disableInput={true}
              id="swap-currency-output"
            />
            <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
              <AutoColumn gap="4px">
                {Boolean(trade) && (
                  <RowBetween align="center">
                    <Text fontWeight={500} fontSize={14} color={theme.text2}>
                      Avg Price
                    </Text>
                    <TradePrice trade={trade} estTokenAmount={outputAmount} />
                  </RowBetween>
                )}
                <RowBetween align="center">
                  <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                    Slippage Tolerance
                  </ClickableText>
                  <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                    {allowedSlippage / 100}%
                  </ClickableText>
                </RowBetween>
                <RowBetween align="center">
                  <Text fontWeight={500} fontSize={14} color={theme.text2}>
                    Trading Fee
                  </Text>
                  <Text fontWeight={500} fontSize={14} color={theme.text2} >
                    {toPercent(ammExchange?.feePercent)}%
                  </Text>
                </RowBetween>
              </AutoColumn>
            </Card>
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonGray onClick={toggleWalletModal}>Connect Wallet</ButtonGray>
            ) : !Boolean(outputAmount) && !swapInputError ? (
              <GreyCard style={{ textAlign: 'center' }}>
                <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
              </GreyCard>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                        'Approve ' + currencies[Field.INPUT]?.symbol
                      )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined
                    })
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={!isValid || approval !== ApprovalState.APPROVED || priceImpactSeverity > 3}
                  error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={16} fontWeight={500}>
                    {priceImpactSeverity > 3 ? `Price Impact High` : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                  </Text>
                </ButtonError>
              </RowBetween>
            ) : (
                    <ButtonError
                      onClick={() => {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined
                        })
                      }}
                      id="swap-button"
                      disabled={!isValid || priceImpactSeverity > 3 || !!swapCallbackError}
                      error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                    >
                      <Text fontSize={20} fontWeight={500}>
                        {swapInputError
                          ? swapInputError
                          : priceImpactSeverity > 3
                            ? `Price Impact Too High`
                            : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                      </Text>
                    </ButtonError>
                  )}
            {showApproveFlow && (
              <Column style={{ marginTop: '1rem' }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
      <AdvancedSwapDetailsDropdown trade={trade} allowedSlippage={allowedSlippage} minAmount={minAmount} outputAmount={outputAmount} />
    </>
  )
}

export default withRouter(Swap)

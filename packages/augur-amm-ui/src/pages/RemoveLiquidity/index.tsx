import { TransactionResponse } from '@ethersproject/providers'
import React, { useCallback, useContext, useState } from 'react'
import { ArrowDown, Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonPrimary, ButtonGray, ButtonError, ButtonConfirmed } from '../../components/ButtonStyled'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { BigNumber as BN } from 'bignumber.js'
import Slider from '../../components/Slider'
import TokenLogo from '../../components/TokenLogo'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useToken } from '../../hooks/Tokens'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { TYPE } from '../../Theme'
import { useTransactionAdder } from '../../state/transactions/hooks'

import AppBody from '../AppBody'
import { MaxButton, Wrapper } from '../../components/swap/styleds'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { Dots } from '../../components/swap/styleds'
import { getRemoveLiquidityBreakdown } from '../../state/burn/hooks'
import { useAmmFactoryAddress, useAugurClient } from '../../contexts/Application'
import { withRouter } from 'react-router-dom'
import LiquidityPage from '../LiquidityPage'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useLPTokenBalances } from '../../state/wallet/hooks'
import { useMarketAmm } from '../../contexts/Markets'
import { tryParseAmount } from '../../state/swap/hooks'
import { removeAmmLiquidity } from '../../utils'

function RemoveLiquidity({
  ammExchangeId,
  marketId
}: RouteComponentProps<{ ammExchangeId: string; marketId: string }>) {
  const augurClient = useAugurClient()
  const { account, chainId, library } = useActiveWeb3React()
  const [userTokenBalances, loading] = useLPTokenBalances()
  const ammExchange = useMarketAmm(marketId, ammExchangeId)
  const currencyA = useCurrency(ammExchange.cash)
  const currencyLP = useCurrency(ammExchangeId)
  const tokenLp = useToken(ammExchangeId)
  const ammFactory = useAmmFactoryAddress()
  const [liquidity, setLiquidity] = useState('0')
  const [breakdown, setBreakdown] = useState({ noShares: '0', yesShares: '0', cashShares: '0' })
  const [liquidityPercentage, setLiquidityPercentage] = useState('0')
  const [error, setError] = useState('Enter an amount')
  const [approval, approveCallback] = useApproveCallback(
    tryParseAmount(userTokenBalances[ammExchangeId], currencyLP),
    ammFactory
  )

  const theme = useContext(ThemeContext)

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  // tx sending
  const addTransaction = useTransactionAdder()
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')

    if (!liquidity) {
      throw new Error('missing currency amounts')
    }

    if (!currencyA) throw new Error('missing tokens')
    const liquidityAmount = liquidity
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    setAttemptingTxn(true)
    await removeAmmLiquidity({ ammAddress: ammExchange.id, augurClient, lpTokens: liquidity })
      .then((response: TransactionResponse) => {
        setAttemptingTxn(false)

        addTransaction(response, {
          summary: 'Remove ' + liquidity
        })

        setTxHash(response.hash)

        ReactGA.event({
          category: 'Liquidity',
          action: 'Remove',
          label: currencyA?.symbol
        })
      })
      .catch((error: Error) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        console.error(error)
      })
  }

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <RowBetween align="flex-end">
          <Text fontSize={12} fontWeight={500}>
            Yes Shares:
          </Text>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {breakdown.yesShares}
          </Text>
        </RowBetween>

        <RowBetween align="flex-end">
          <Text fontSize={12} fontWeight={500}>
            No Shares:
          </Text>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {breakdown.noShares}
          </Text>
        </RowBetween>

        <RowBetween align="flex-end">
          <Text fontSize={12} fontWeight={500}>
            <TokenLogo tokenInfo={ammExchange.cash} showSymbol size={'12px'} />
          </Text>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {breakdown.cashShares}
          </Text>
        </RowBetween>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Text color={theme.text2} fontWeight={500} fontSize={16}>
            LP Tokens Burned
          </Text>
          <Text fontWeight={500} fontSize={16}>
            {liquidity}
          </Text>
        </RowBetween>

        <ButtonPrimary disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)} onClick={onRemove}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Removing ${liquidity} ${currencyA?.symbol}`

  const updateLiquidityPercent = (value: number) => {
    if (value === 0) return setError('Enter an amount')
    setLiquidityPercentage(String(value))
    const fullLiquidity = userTokenBalances[ammExchangeId]
    const fraction = Number(value) / 100
    console.log('value value', fraction, value, fullLiquidity)
    const newLiquidity = String(Math.floor(fraction * Number(fullLiquidity)))

    console.log('setting liquidity', newLiquidity)
    setLiquidity(newLiquidity)
    getRemoveLiquidityBreakdown(augurClient, tokenLp, newLiquidity, result => {
      setBreakdown(result)
      setError(null)
    })
    if (newLiquidity === '0') setError('Enter an amount')
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setLiquidityPercentage('0')
    }
    setTxHash('')
  }, [setLiquidityPercentage, txHash])

  if (!account) {
    setError('Connect Wallet')
  }

  return (
    <LiquidityPage>
      <AppBody>
        <AddRemoveTabs creating={false} adding={false} token={marketId} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash ? txHash : ''}
            content={() => (
              <ConfirmationModalContent
                title={'You will receive'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="md">
            <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Text color={theme.text2} fontWeight={500}>
                    Amount
                  </Text>
                </RowBetween>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Text color={theme.text2} fontSize={72} fontWeight={500}>
                    {liquidityPercentage}%
                  </Text>
                </Row>
                <>
                  <Slider value={Number(liquidityPercentage)} onChange={updateLiquidityPercent} />
                  <RowBetween>
                    <MaxButton onClick={() => updateLiquidityPercent(25)} width="20%">
                      25%
                    </MaxButton>
                    <MaxButton onClick={() => updateLiquidityPercent(50)} width="20%">
                      50%
                    </MaxButton>
                    <MaxButton onClick={() => updateLiquidityPercent(75)} width="20%">
                      75%
                    </MaxButton>
                    <MaxButton onClick={() => updateLiquidityPercent(100)} width="20%">
                      Max
                    </MaxButton>
                  </RowBetween>
                </>
              </AutoColumn>
            </LightCard>
            <>
              <ColumnCenter>
                <ArrowDown size="16" color={theme.text2} />
              </ColumnCenter>
              <LightCard>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <Text fontSize={12} fontWeight={500}>
                      LP Tokens:
                    </Text>
                    <Text fontSize={12}>{liquidity}</Text>
                  </RowBetween>
                  <RowBetween>
                    <Text fontSize={12} fontWeight={500}>
                      Yes Shares:
                    </Text>
                    <Text fontSize={12}>{breakdown?.yesShares}</Text>
                  </RowBetween>
                  <RowBetween>
                    <Text fontSize={12} fontWeight={500}>
                      No Shares:
                    </Text>
                    <Text fontSize={12}>{breakdown?.noShares}</Text>
                  </RowBetween>
                  <RowBetween>
                    <TokenLogo showSymbol size={'12px'} tokenInfo={ammExchange.cash} />
                    <Text fontSize={12}>{breakdown?.cashShares}</Text>
                  </RowBetween>
                </AutoColumn>
              </LightCard>
            </>
            <div style={{ position: 'relative' }}>
              {!account ? (
                <ButtonGray onClick={toggleWalletModal}>Connect Wallet</ButtonGray>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={approveCallback}
                    confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                    disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                    mr="0.5rem"
                    fontWeight={500}
                    fontSize={16}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>Approving</Dots>
                    ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                      'Approved'
                    ) : (
                      'Approve'
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      setShowConfirm(true)
                    }}
                    disabled={approval !== ApprovalState.APPROVED || liquidity === '0'}
                    error={false}
                  >
                    <Text fontSize={16} fontWeight={500}>
                      {error || 'Remove'}
                    </Text>
                  </ButtonError>
                </RowBetween>
              )}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </LiquidityPage>
  )
}

export default withRouter(RemoveLiquidity)

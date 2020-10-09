import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, ETHER, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useContext, useState } from 'react'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonGray, ButtonPrimary } from '../../components/ButtonStyled'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
//import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFlat } from '../../components/Row'

import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../Theme'
import { calculateSlippageAmount, getAMMExchangeContract, getAMMFactoryContract, addAmmLiquidity, useAmmFactory, calcShareAmounts } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../../components/swap/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { PoolPriceBar } from './PoolPriceBar'
import { getAmmFactoryAddress, useAugurClient } from '../../contexts/Application'
import { withRouter } from 'react-router-dom'
import LiquidityPage from '../LiquidityPage'
import { useMarketAmm, useShareTokens, useMarket } from '../../contexts/Markets'
import CashInputPanel from '../../components/CashInputPanel'
import DistributionPanel from '../../components/DistributionPanel'
import { useWalletModalToggle } from '../../state/application/hooks'

function AddLiquidity({
  amm,
  marketId,
  cash,
  history
}: RouteComponentProps<{ amm?: string; marketId: string; cash: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const ammFactoryContract = useAmmFactory()
  const augurClient = useAugurClient()
  const ammFactory = getAmmFactoryAddress()
  const theme = useContext(ThemeContext)
  // share token is undefined for isCreate
  const sharetoken = useShareTokens(cash)
  const ammData = useMarketAmm(marketId, amm)
  const market = useMarket(marketId)
  const isCreate = !ammData.id
  const currencyA = useCurrency(cash)
  console.log('currencyA token', JSON.stringify(currencyA))

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')
  const [currentDistribution, setCurrentDistribution] = useState<number[]>([50, 50])

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ammFactory)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    console.log('onAdd called')
    if (!chainId || !account || !library || !sharetoken || !augurClient) return

    const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts
    if (!parsedAmountA || !currencyA || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
    }
    let contract = null
    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null

    if (isCreate) {
      contract = getAMMFactoryContract(library, account)
      estimate = contract.estimateGas.addAMMWithLiquidity
      method = contract.addAMMWithLiquidity
      args = [
        marketId,
        sharetoken,
        //amountsMin[Field.CURRENCY_A].toString(), // token min
        parsedAmountA.raw.toString(), // setsToBuy
        false, // swapForYes
        BigNumber.from(0).toString(), // swapHowMuch
      ]
      // this will be needed for using ETHER
      //value = BigNumber.from((parsedAmountA).raw.toString())
      value = null
    } else {
      console.log('sets to buy', parsedAmountA.raw.toString())
      contract = getAMMExchangeContract(ammData.id, library, account)
      estimate = contract.estimateGas.addLiquidity
      method = contract.addLiquidity
      args = [
        marketId,
        parsedAmountA.raw.toString(),
        //amountsMin[Field.CURRENCY_A].toString(),
        false, // swapForYes
        BigNumber.from(0).toString(), // swapHowMuch
      ]
      value = null
    }

    setAttemptingTxn(true)
    const [yesShares, noShares] = calcShareAmounts(currentDistribution, parsedAmountA.raw.toString())
    await addAmmLiquidity(augurClient, marketId, sharetoken, yesShares, noShares)
    .then(response => {
      setAttemptingTxn(false)

      addTransaction(response, {
        summary:
          'Add ' +
          parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
          ' ' +
          currencies[Field.CURRENCY_A]?.symbol
      })

      setTxHash(response.hash)

      ReactGA.event({
        category: 'Liquidity',
        action: 'Add',
        label: [currencies[Field.CURRENCY_A]?.symbol].join('/')
      })
    })
    .catch(error => {
      setAttemptingTxn(false)
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
      }
    })
/*
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
      */
  }

  const modalHeader = () => (
      <AutoColumn gap="20px" justify="center">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <TYPE.body fontSize="12px" fontWeight={500} marginRight={10}>
              {market?.description}
            </TYPE.body>
          </RowFlat>
        </LightCard>
      </AutoColumn>
    )


  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={isCreate}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
        distribution={currentDistribution}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])


  return (
    <LiquidityPage>
      <AppBody>
        <AddRemoveTabs creating={isCreate} adding={true} token={marketId} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={isCreate ? 'You are creating a pool and supplying liquidity' : 'You are adding liquidity'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
          />
          <AutoColumn gap="20px">
            {noLiquidity ||
              (false && (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={'primaryText1'}>
                        You are the first liquidity provider.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        The ratio of tokens you add will set the price of this pool.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        Once you are happy with the rate click supply to review.
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ))}
            <CashInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              label={'How much do you want to put in?'}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              currencyAddress={cash}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter>
              <TYPE.small>Distribution</TYPE.small>
            </ColumnCenter>
            <DistributionPanel
              updateDistribution={setCurrentDistribution}
              disableInputs={!isCreate}
              currentDistribution={currentDistribution}
              id={marketId}
            />
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <LightCard padding="0px" borderRadius={'20px'}>
                  <RowBetween padding="1rem">
                    <TYPE.subHeader fontWeight={500} fontSize={14}>
                      {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                    </TYPE.subHeader>
                  </RowBetween>{' '}
                  <LightCard padding="1rem" borderRadius={'20px'}>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </LightCard>
                </LightCard>
              </>
            )}

            {!account ? (
              <ButtonGray onClick={toggleWalletModal}>Connect Wallet</ButtonGray>
            ) : (
              <AutoColumn gap={'md'}>
                {isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={'100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    setShowConfirm(true)
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED}
                  error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {error ?? 'Supply'}
                  </Text>
                </ButtonError>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </LiquidityPage>
  )
}

export default withRouter(AddLiquidity)

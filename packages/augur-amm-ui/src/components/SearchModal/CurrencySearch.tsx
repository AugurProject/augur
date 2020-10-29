import { Currency } from '@uniswap/sdk'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import { useAllMarketTokens } from '../../hooks/Tokens'
import { CloseIcon} from '../../Theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { PaddedColumn, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useSwapQueryParam } from '../../state/swap/hooks'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React()
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { marketId, cash, amm } = useSwapQueryParam()
  const allMarketTokens = useAllMarketTokens(marketId, cash, amm)

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  // not showing ether for this initial release
  const showETH: boolean = false

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      console.log('handleCurrencySelect aa', currency)
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])


  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
      </PaddedColumn>
      <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
            <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={showETH}
              currencies={allMarketTokens}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
    </Column>
  )
}

import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import Row, { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { Search as SearchIcon, X } from 'react-feather'
import { BasicLink } from '../Link'

import { useAllTokenData, useTokenData } from '../../contexts/TokenData'
import { useAllMarketData } from '../../contexts/Markets'
import { useAllTokensInUniswap } from '../../contexts/GlobalData'
import { OVERVIEW_TOKEN_BLACKLIST, PAIR_BLACKLIST } from '../../constants'

import { transparentize } from 'polished'
import { client } from '../../apollo/client'
import { TOKEN_SEARCH } from '../../apollo/queries'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'

const Container = styled.div`
  height: 48px;
  z-index: 1;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0;
  border-radius: 12px;
  background: ${({ theme, small, open }) =>
    small ? (open ? transparentize(0.4, theme.bg1) : 'none') : transparentize(0.4, theme.bg6)};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '12px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '12px')};
  z-index: 1;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
    !open && !small
      ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
      : 'none'};
  @media screen and (max-width: 500px) {
    background: ${({ theme }) => transparentize(0.4, theme.bg1)};
    box-shadow: ${({ open }) =>
      !open
        ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
        : 'none'};
  }
`
const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
  padding: 1rem;
  font-size: ${({ large }) => (large ? '20px' : '14px')};
  color: ${({ theme }) => theme.text3};

  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.3);
  border-radius: 8px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  pointer-events: none;
  padding: 0.25rem;
  color: ${({ theme }) => theme.text3};
`

const CloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  right: 10px;
  color: ${({ theme }) => theme.text3};
  :hover {
    cursor: pointer;
  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 40px;
  position: absolute;
  max-height: 540px;
  overflow: scroll;
  left: 0;
  padding-bottom: 20px;
  background: ${({ theme }) => theme.menu};
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => hide && 'none'};
`

const MenuItem = styled(Row)`
  padding: 1rem;
  font-size: 0.85rem;
  & > * {
    margin-right: 6px;
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const Heading = styled(Row)`
  padding: 1rem;
  display: ${({ hide = false }) => hide && 'none'};
`

const Gray = styled.span`
  color: #888d9b;
`

const Blue = styled.span`
  color: #2172e5;
  :hover {
    cursor: pointer;
  }
`

export const Search = ({ small = false }) => {
  let allTokens = useAllTokensInUniswap()
  const allTokenData = useAllTokenData()
  const { markets } = useAllMarketData()

  const [showMenu, toggleMenu] = useState(false)
  const [value, setValue] = useState('')
  const [, toggleShadow] = useState(false)

  // fetch new data on tokens and pairs if needed
  useTokenData(value)

  //const below700 = useMedia('(max-width: 700px)')
  //const below470 = useMedia('(max-width: 470px)')
  //const below410 = useMedia('(max-width: 410px)')

  useEffect(() => {
    if (value !== '') {
      toggleMenu(true)
    } else {
      toggleMenu(false)
    }
  }, [value])

  const [searchedTokens, setSearchedTokens] = useState([])
  //const [searchedPairs, setSearchedPairs] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        if (value?.length > 0) {
          let tokens = await client.query({
            variables: {
              value: value ? value.toUpperCase() : '',
              id: value
            },
            query: TOKEN_SEARCH
          })
          let foundTokens = tokens.data.asSymbol.concat(tokens.data.asAddress).concat(tokens.data.asName)
          setSearchedTokens(foundTokens)
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [value])

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  // add the searched tokens to the list if now found yet
  allTokens = allTokens.concat(
    searchedTokens.filter(searchedToken => {
      let included = false
      allTokens.map(token => {
        if (token.id === searchedToken.id) {
          included = true
        }
        return true
      })
      return !included
    })
  )

  let uniqueTokens = []
  let found = {}
  allTokens &&
    allTokens.map(token => {
      if (!found[token.id]) {
        found[token.id] = true
        uniqueTokens.push(token)
      }
      return true
    })

  let uniquePairs = []

  // TODO Add better market filtering / searching
  const filteredMarketsList = markets
    ? markets.filter(market => {
        if (value !== '') {
          const re = new RegExp(value, 'i')
          if ((value.length === 42 && re.test(market.id)) || re.test(market.description)) {
            return true
          }
        }
        return false
      })
    : []

  const filteredTokenList = useMemo(() => {
    return uniqueTokens
      ? uniqueTokens
          .sort((a, b) => {
            if (OVERVIEW_TOKEN_BLACKLIST.includes(a.id)) {
              return 1
            }
            if (OVERVIEW_TOKEN_BLACKLIST.includes(b.id)) {
              return -1
            }
            const tokenA = allTokenData[a.id]
            const tokenB = allTokenData[b.id]
            if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1
            }
            if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
              return -1
            }
            if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1
            }
            return 1
          })
          .filter(token => {
            if (OVERVIEW_TOKEN_BLACKLIST.includes(token.id)) {
              return false
            }
            const regexMatches = Object.keys(token).map(tokenEntryKey => {
              const isAddress = value.slice(0, 2) === '0x'
              if (tokenEntryKey === 'id' && isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'symbol' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              if (tokenEntryKey === 'name' && !isAddress) {
                return token[tokenEntryKey].match(new RegExp(escapeRegExp(value), 'i'))
              }
              return false
            })
            return regexMatches.some(m => m)
          })
      : []
  }, [allTokenData, uniqueTokens, value])

  useEffect(() => {
    if (Object.keys(filteredTokenList).length > 2) {
      toggleShadow(true)
    } else {
      toggleShadow(false)
    }
  }, [filteredTokenList])

  const [marketsShown, setMarketsShown] = useState(3)

  function onDismiss() {
    setMarketsShown(3)
    toggleMenu(false)
    setValue('')
  }

  // refs to detect clicks outside modal
  const wrapperRef = useRef()
  const menuRef = useRef()

  const handleClick = e => {
    if (
      !(menuRef.current && menuRef.current.contains(e.target)) &&
      !(wrapperRef.current && wrapperRef.current.contains(e.target))
    ) {
      setMarketsShown(3)
      toggleMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  return (
    <Container small={small}>
      <Wrapper open={showMenu} shadow={true} small={small}>
        <Input
          large={!small}
          type={'text'}
          ref={wrapperRef}
          placeholder={'Search markets ...'}
          value={value}
          onChange={e => {
            setValue(e.target.value)
          }}
          onFocus={() => {
            if (!showMenu) {
              toggleMenu(true)
            }
          }}
        />
        {!showMenu ? <SearchIconLarge /> : <CloseIcon onClick={() => toggleMenu(false)} />}
      </Wrapper>
      <Menu hide={!showMenu} ref={menuRef}>
        <Heading>
          <Gray>Markets</Gray>
        </Heading>
        <div>
          {Object.keys(filteredMarketsList).length === 0 && (
            <MenuItem>
              <TYPE.body>No results</TYPE.body>
            </MenuItem>
          )}
          {filteredMarketsList.slice(0, marketsShown).map(market => {
            return (
              <div key={market.id}>
                <BasicLink to={'/market/' + market.id} onClick={onDismiss}>
                  <MenuItem>
                    <RowFixed>
                      <TokenLogo tokenInfo={market.id} style={{ marginRight: '10px' }} />
                      <FormattedName
                        text={market.description}
                        maxCharacters={180}
                        style={{ marginRight: '6px', flexGrow: '1', paddingLeft: '0.5rem' }}
                      />
                      <FormattedName text={'ETH'} maxCharacters={6} />
                    </RowFixed>
                  </MenuItem>
                </BasicLink>
              </div>
            )
          })}

          <Heading
            hide={
              !(Object.keys(filteredMarketsList).length > 3 && Object.keys(filteredMarketsList).length >= marketsShown)
            }
          >
            <Blue
              onClick={() => {
                setMarketsShown(marketsShown + 5)
              }}
            >
              See more...
            </Blue>
          </Heading>
        </div>
      </Menu>
    </Container>
  )
}

export default Search

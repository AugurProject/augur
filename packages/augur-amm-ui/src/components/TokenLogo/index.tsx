import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import market from '../../assets/market.png'
import { getCashInfo, getCashInfoBySymbol } from '../../contexts/Application'
import { TYPE } from '../../Theme'

const BAD_IMAGES = {}

const Image = styled.img<{ size }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: #2b2c2c;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledLogo = styled.div<{ size }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    background: #2b2c2c;
  }
`

export default function TokenLogo({ tokenInfo, showSymbol = false, customErrorLabel = null, uppercase = true, size = '24px', ...rest }) {
  let cashtoken = getCashInfo(typeof tokenInfo === 'string' ? tokenInfo : tokenInfo ? tokenInfo.address : null)
  if (!cashtoken) {
    cashtoken = getCashInfoBySymbol(typeof tokenInfo === 'string' ? tokenInfo : tokenInfo ? tokenInfo.symbol : null)
  }
  const address = cashtoken ? cashtoken.address : tokenInfo
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (cashtoken && cashtoken.address) {
    return (
      <StyledLogo size={size} {...rest}>
        <img src={require(`../../assets/${cashtoken.asset}`)} style={{ borderRadius: '24px' }} alt="Trading token" />
        <TYPE.light style={{ fontSize: size, paddingLeft: '0.25rem', fontWeight: '500', textTransform: 'uppercase' }}>
          {showSymbol ? <span style={{ paddingLeft: '0.15rem' }}>{cashtoken.symbol || tokenInfo?.symbol}</span> : ''}
        </TYPE.light>
      </StyledLogo>
    )
  }

  if (error || BAD_IMAGES[address]) {
    return (
      <StyledLogo size={size} {...rest}>
        <Image src={market} size={size} style={{ borderRadius: '24px' }} alt="Augur Market" />
        <TYPE.light style={{ fontSize: size, paddingLeft: '0.25rem', fontWeight: '500', textTransform: uppercase ? 'uppercase' : 'capitalize' }}>
          {showSymbol ? <span style={{ paddingLeft: '0.15rem' }}>{tokenInfo?.symbol}</span> : customErrorLabel ? customErrorLabel : ''}
        </TYPE.light>
      </StyledLogo>
    )
  }

  const path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`

  return (
    <StyledLogo size={size} {...rest}>
      <Image
        {...rest}
        alt={''}
        src={path}
        size={size}
        onError={event => {
          BAD_IMAGES[address] = true
          setError(true)
          event.preventDefault()
        }}
      />
    </StyledLogo>
  )
}

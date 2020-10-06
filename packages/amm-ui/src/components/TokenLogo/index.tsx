import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import market from '../../assets/market.png'
import { getCashInfo } from '../../contexts/Application'
import { TYPE } from '../../Theme'

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img<{ size }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: #2b2c2c;
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

const StyledEthereumLogo = styled.div<{ size }>`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    background: #2b2c2c;
  }
`

export default function TokenLogo({ tokenInfo, showSymbol = false, size = '24px', ...rest }) {
  const cashtoken = getCashInfo(typeof tokenInfo === 'string' ? tokenInfo : tokenInfo ? tokenInfo.address : null)
  const address = cashtoken ? cashtoken.address : tokenInfo
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (cashtoken && cashtoken.address) {
    return (
      <StyledEthereumLogo size={size} {...rest}>
        <img src={require(`../../assets/${cashtoken.asset}`)} style={{ borderRadius: '24px' }} alt="Trading token" />
        <TYPE.light style={{ fontSize: size, paddingLeft: '0.25rem', fontWeight: '500' }}>
          {showSymbol ? cashtoken.symbol : ''}
        </TYPE.light>
      </StyledEthereumLogo>
    )
  }

  if (error || BAD_IMAGES[address]) {
    return (
      <Inline>
        <Image src={market} size={size} style={{ borderRadius: '24px' }} alt="Augur Market" />
      </Inline>
    )
  }

  const path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`

  return (
    <Inline>
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
    </Inline>
  )
}

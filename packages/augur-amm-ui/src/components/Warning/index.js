import React from 'react'
import 'feather-icons'
import styled from 'styled-components'
import { Text } from 'rebass'
import { AlertTriangle } from 'react-feather'
import { RowBetween, RowFixed } from '../Row'
import { ButtonSecondary } from '../ButtonStyled'
import { AutoColumn } from '../Column'
import { Hover } from '..'
import Link from '../Link'
import { useMedia } from 'react-use'

const WarningWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: rgba(248, 45, 58, 0.05);
  padding: 1rem;
  color: #f82d3a;
  display: ${({ show }) => !show && 'none'};
  margin: 0 2rem 2rem 2rem;
  position: relative;

  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`

const StyledWarningIcon = styled(AlertTriangle)`
  min-height: 20px;
  min-width: 20px;
  stroke: red;
`

export default function Warning({ type, show, setShow, address }) {
  const below800 = useMedia('(max-width: 800px)')

  const textContent = below800 ? (
    <div>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        Anyone can create and name any ERC20 token on Ethereum, including creating fake versions of existing tokens and
        tokens that claim to represent projects that do not have a token.
      </Text>
      <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
        Similar to Etherscan, this site automatically tracks analytics for all ERC20 tokens independent of token
        integrity. Please do your own research before interacting with any ERC20 token.
      </Text>
    </div>
  ) : (
    <Text fontWeight={500} lineHeight={'145.23%'} mt={'10px'}>
      Anyone can create and name any ERC20 token on Ethereum, including creating fake versions of existing tokens and
      tokens that claim to represent projects that do not have a token. Similar to Etherscan, this site automatically
      tracks analytics for all ERC20 tokens independent of token integrity. Please do your own research before
      interacting with any ERC20 token.
    </Text>
  )

  return (
    <WarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <StyledWarningIcon />
          <Text fontWeight={600} lineHeight={'145.23%'} ml={'10px'}>
            Token Safety Alert
          </Text>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: '10px' }}>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#2172E5'}
                href={'https://etherscan.io/address/' + address}
                target="_blank"
              >
                View {type === 'token' ? 'token' : 'pair'} contract on Etherscan
              </Link>
            </Hover>
            <RowBetween style={{ marginTop: '20px' }}>
              <div />
              <ButtonSecondary color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
                I understand
              </ButtonSecondary>
            </RowBetween>
          </div>
        ) : (
          <RowBetween style={{ marginTop: '10px' }}>
            <Hover>
              <Link
                fontWeight={500}
                lineHeight={'145.23%'}
                color={'#2172E5'}
                href={'https://etherscan.io/address/' + address}
                target="_blank"
              >
                View {type === 'token' ? 'token' : 'pair'} contract on Etherscan
              </Link>
            </Hover>
            <ButtonSecondary color={'#f82d3a'} style={{ minWidth: '140px' }} onClick={() => setShow(false)}>
              I understand
            </ButtonSecondary>
          </RowBetween>
        )}
      </AutoColumn>
    </WarningWrapper>
  )
}

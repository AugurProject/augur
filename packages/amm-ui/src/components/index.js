import React from 'react'
import styled from 'styled-components'
import { Text, Box } from 'rebass'

import Link from './Link'

import { urls } from '../utils'

const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.divider};
`

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const Hint = ({ children, ...rest }) => (
  <Text fontSize={16} weight={500} {...rest}>
    {children}
  </Text>
)

const Address = ({ address, token, ...rest }) => (
  <Link
    color="button"
    href={token ? urls.showToken(address) : urls.showAddress(address)}
    external
    style={{ wordBreak: 'break-all' }}
    {...rest}
  >
    {address}
  </Link>
)

export const Hover = styled.div`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && '0.7'};
  }
`

export const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text1};
`

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  height: ${({ height }) => height && height};
`

export const SideBar = styled.span`
  display: grid;
  grid-gap: 24px;
  position: sticky;
  top: 4rem;
`

export const SubNav = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin-bottom: 2rem;
`
export const SubNavEl = styled.li`
  list-style: none;
  display: flex;
  padding-bottom: 0.5rem;
  margin-right: 1rem;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  :hover {
    cursor: pointer;
    border-bottom: 1px solid ${({ theme }) => theme.bg3};
  }
`

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 36px;
  padding-bottom: 80px;
  width: 100%;
  align-content: center;
  justify-content: center;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 12px;
    }
  }
`
export const DetailPageWrapper = styled(PageWrapper)`
  justify-content: center;
  align-content: center;
`

export const ContentWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const ContentWrapperLarge = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  padding: 0 2rem;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 1440px;
  width: 100%;

  @media screen and (max-width: 1282px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const FullWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;

  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`

export const FixedMenu = styled.div`
  z-index: 99;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 2rem;
  max-width: 100vw;

  @media screen and (max-width: 800px) {
    margin-bottom: 0;
  }
`

export { Hint, Divider, Address, EmptyCard }

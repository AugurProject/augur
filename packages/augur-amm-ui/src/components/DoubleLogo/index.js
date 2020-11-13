import React from 'react'
import styled from 'styled-components'
import TokenLogo from '../TokenLogo'
import { useDarkModeManager } from '../../contexts/LocalStorage'

export default function DoubleTokenLogo({ token0, token1, size = 24, margin = false }) {
  const [darkMode] = useDarkModeManager()
  const TokenWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
  `

  const HigherLogo = styled(TokenLogo)`
    z-index: 2;
    border-radius: 50%;
  `

  const CoveredLogo = styled(TokenLogo)`
    position: absolute;
    left: ${({ sizeraw }) => (sizeraw / 2).toString() + 'px'};
    border-radius: 50%;
  `

  return (
    <TokenWrapper darkMode={darkMode} sizeraw={size} margin={margin}>
      <HigherLogo darkMode={darkMode} tokenInfo={token0} size={size.toString() + 'px'} sizeraw={size} />
      <CoveredLogo darkMode={darkMode} tokenInfo={token1} size={size.toString() + 'px'} sizeraw={size} />
    </TokenWrapper>
  )
}

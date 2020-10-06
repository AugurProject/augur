import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const rotate = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Loader = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  animation: ${rotate} 800ms linear infinite;
  & > * {
    width: 72px;
  }
  ${props =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const LocalLoader = ({ fill }) => {
  const [darkMode] = useDarkModeManager()

  return (
    <Loader fill={fill}>
      <img src={require(darkMode ? '../../assets/logo_white.svg' : '../../assets/logo.svg')} alt="loading-icon" />
    </Loader>
  )
}

export default LocalLoader

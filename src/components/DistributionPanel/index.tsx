import React, { useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { TYPE } from '../../Theme'
import { Input as NumericalInput } from '../NumericalInput'
import { AutoColumn } from '../Column'

const InputPanel = styled.div<{ disabled?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  border-radius: 20px;
  color: ${({ disabled, theme }) => (disabled ? darken(0.5, theme.text2) : theme.text2)};
  border: ${({ theme }) => `1px solid ${theme.bg2}`};
  z-index: 1;
  height: 78px;
  width: 200px;
`

interface DistributionPanelProps {
  updateDistribution: Function
  disableInputs?: boolean
  currentDistribution: number[]
  id: string
}

export default function DistributionPanel({
  updateDistribution,
  disableInputs = false,
  currentDistribution = [50, 50],
  id
}: DistributionPanelProps) {
  const YES = 'YES'
  const YES_ID = 0
  const NO = 'NO'
  const NO_ID = 1

  const [yesInput, setYesInput] = useState(currentDistribution[YES_ID])
  const [noInput, setNoInput] = useState(currentDistribution[NO_ID])

  const setDistributionInput = (value: number, type) => {
    console.log(value)
    if (isNaN(value) || value > 100) {
      setYesInput(0)
      setNoInput(0)
      return
    }
    if (type === YES) {
      setYesInput(value)
      setNoInput(100 - value)
    }

    if (type === NO) {
      setNoInput(value)
      setYesInput(100 - value)
    }
    updateDistribution([yesInput, noInput])
  }
  return (
    <>
      <RowBetween>
        <AutoColumn>
          <InputPanel>
            <TYPE.light fontSize={12} style={{ padding: '0.75rem' }} disabled={disableInputs}>
              Yes
            </TYPE.light>
            <RowBetween style={{ padding: '0.25rem 0.75rem' }}>
              <NumericalInput
                disabled={disableInputs}
                style={disableInputs ? { color: 'grey', fontSize: '24px' } : { fontSize: '24px' }}
                value={yesInput}
                min={0}
                max={100}
                onUserInput={val => {
                  if (!isNaN(Number(val))) setDistributionInput(Number(val), YES)
                }}
              />
              <TYPE.light fontSize={18} disabled={disableInputs}>
                %
              </TYPE.light>
            </RowBetween>
          </InputPanel>
        </AutoColumn>
        <AutoColumn>
          <InputPanel>
            <TYPE.light fontSize={12} style={{ padding: '0.75rem' }} disabled={disableInputs}>
              No
            </TYPE.light>
            <RowBetween style={{ padding: '0.25rem 0.75rem' }}>
              <NumericalInput
                disabled={disableInputs}
                style={disableInputs ? { color: 'grey', fontSize: '24px' } : { fontSize: '24px' }}
                value={noInput}
                min={0}
                max={100}
                onUserInput={val => {
                  if (!isNaN(Number(val))) setDistributionInput(Number(val), NO)
                }}
              />
              <TYPE.light fontSize={18} disabled={disableInputs}>
                %
              </TYPE.light>
            </RowBetween>
          </InputPanel>
        </AutoColumn>
      </RowBetween>
    </>
  )
}

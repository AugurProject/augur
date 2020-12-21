import React, { useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { TYPE } from '../../Theme'
import { Input as NumericalInput } from '../NumericalInput'
import { AutoColumn } from '../Column'
import { DISTRO_NO_ID, DISTRO_YES_ID } from '../../constants'

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
  distroPercentage: number[]
  id: string
}

export default function DistributionPanel({
  updateDistribution,
  disableInputs = false,
  distroPercentage = [50, 50],
}: DistributionPanelProps) {
  const YES = 'YES'
  const NO = 'NO'

  // switch to convert already existing pool percentage to odds
  const [yesInput, setYesInput] = useState(distroPercentage[DISTRO_NO_ID])
  const [noInput, setNoInput] = useState(distroPercentage[DISTRO_YES_ID])

  const setDistributionInput = (value: number, type) => {
    let yes, no = 0
    if (isNaN(value) || value > 100) {
      setYesInput(0)
      setNoInput(0)
      return
    }
    if (type === YES) {
      yes = value
      no = 100 - value
    }

    if (type === NO) {
      no = value
      yes = 100 - value
    }
    setYesInput(yes)
    setNoInput(no)
    updateDistribution([yes, no])
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

import React, { useState } from 'react'
import styled from 'styled-components'
import { XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import { AutoRow, RowBetween } from '../Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { ButtonRadio } from '../ButtonStyled'
import { useMedia } from 'react-use'
import { timeframeOptions } from '../../constants'
import DropdownSelect from '../DropdownSelect'
import { useUserPositionChart } from '../../contexts/User'
import { useTimeframe } from '../../contexts/Application'
import LocalLoader from '../LocalLoader'
import { useColor } from '../../hooks'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const ChartWrapper = styled.div`
  max-height: 420px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`

const CHART_VIEW = {
  VALUE: 'Value',
  FEES: 'Fees'
}

const PairReturnsChart = ({ account, position }) => {
  let data = useUserPositionChart(position, account)

  const [timeWindow, setTimeWindow] = useTimeframe()

  const below600 = useMedia('(max-width: 600px)')

  const color = useColor(position?.pair.token0.id)

  const [chartView, setChartView] = useState(CHART_VIEW.VALUE)

  // based on window, get starttime
  let utcStartTime = getTimeframe(timeWindow)
  data = data?.filter(entry => entry.date >= utcStartTime)

  const aspect = below600 ? 60 / 42 : 60 / 16

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap' }}>
            <ButtonRadio active={chartView === CHART_VIEW.VALUE} onClick={() => setChartView(CHART_VIEW.VALUE)}>
              Liquidity
            </ButtonRadio>
            <ButtonRadio active={chartView === CHART_VIEW.FEES} onClick={() => setChartView(CHART_VIEW.FEES)}>
              Fees
            </ButtonRadio>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <ButtonRadio
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </ButtonRadio>
            <ButtonRadio
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </ButtonRadio>
            <ButtonRadio
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </ButtonRadio>
          </AutoRow>
        </OptionsRow>
      )}
      <ResponsiveContainer aspect={aspect}>
        {data ? (
          <LineChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={1} data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={tick => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={0}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={val => formattedNum(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />

            <Line
              type="monotone"
              dataKey={chartView === CHART_VIEW.VALUE ? 'usdValue' : 'fees'}
              stroke={color}
              yAxisId={0}
              name={chartView === CHART_VIEW.VALUE ? 'Liquidity' : 'Fees Earned (Cumulative)'}
            />
          </LineChart>
        ) : (
          <LocalLoader />
        )}
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default PairReturnsChart

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, LineChart, Line } from 'recharts'
import { RowBetween, AutoRow } from '../Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from '../../utils'
import { ButtonRadio } from '../ButtonStyled'
import { darken } from 'polished'
import { timeframeOptions } from '../../constants'
import { useMedia } from 'react-use'
import { EmptyCard } from '..'
import DropdownSelect from '../DropdownSelect'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import TokenLogo from '../TokenLogo'
import {
  useMarketAmmTradeData
} from '../../contexts/Markets'

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 540px;

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
  VOLUME: 'Volume',
  LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1'
}

const PairChart = ({ marketId, amms, color }) => {
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY)
  const [selectedCash, setSelectedCash] = useState(amms && amms.length > 0 ? amms[0].cash : undefined)
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.ALL_TIME)
  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)

  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  useEffect(() => {
    if (amms && amms.length > 0 && selectedCash === undefined) {
      setSelectedCash(amms[0].cash)
    }
  }, [amms, selectedCash])

  let chartData = useMarketAmmTradeData(marketId, selectedCash?.address);

  const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  let utcStartTime = getTimeframe(timeWindow)
  chartData = chartData?.filter(entry => entry.date >= utcStartTime)

  if (chartData && chartData.length === 0 || (amms.length === 0)) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap' }}>
            {amms &&
              amms.map(a => (
                <ButtonRadio
                  style={{ width: '50px' }}
                  active={selectedCash?.address === a.cash.address}
                  onClick={() => {
                    setTimeWindow(timeframeOptions.ALL_TIME)
                    setSelectedCash(a?.cash?.address)
                  }}
                >
                  <TokenLogo tokenInfo={a.cash.address} />
                </ButtonRadio>
              ))}
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <ButtonRadio
              style={{ width: '50px' }}
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </ButtonRadio>
            <ButtonRadio
              style={{ width: '50px' }}
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </ButtonRadio>
            <ButtonRadio
              style={{ width: '50px' }}
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </ButtonRadio>
          </AutoRow>
        </OptionsRow>
      )}

      <ResponsiveContainer aspect={aspect}>
        <LineChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            tickLine={false}
            axisLine={false}
            interval="preserveEnd"
            tickMargin={14}
            minTickGap={80}
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
            interval="preserveEnd"
            minTickGap={80}
            yAxisId={0}
            tickMargin={16}
            tick={{ fill: textColor }}
          />
          <Tooltip
            cursor={true}
            formatter={val => formattedNum(val, false)}
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
            strokeWidth={2}
            dot={false}
            type="monotone"
            name={`YES (${selectedCash.symbol})`}
            dataKey={'yes'}
            yAxisId={0}
            stroke={darken(0.12, 'green')}
          />
          <Line
            strokeWidth={2}
            dot={false}
            type="monotone"
            name={`NO (${selectedCash.symbol})`}
            dataKey={'no'}
            yAxisId={0}
            stroke={darken(0.12, 'red')}
          />

        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

export default PairChart

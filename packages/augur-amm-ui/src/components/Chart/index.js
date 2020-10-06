import React, { useState, useEffect } from 'react'
import { Area, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, AreaChart } from 'recharts'
import styled from 'styled-components'
import { useMedia } from 'react-use'
import { toK, toNiceDate, toNiceDateYear } from '../../utils'

const ChartWrapper = styled.div`
  padding-top: 1em;
  margin-left: -1.5em;
  @media (max-width: 40em) {
    margin-left: -1em;
  }
`

const Chart = ({ data, chartOption, currencyUnit, symbol }) => {
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    setChartData([])
    setChartData(data)
  }, [data, chartOption, currencyUnit])

  const isMobile = useMedia('(max-width: 40em)')
  if (chartOption === 'price' && chartData && data) {
    return (
      <ChartWrapper>
        <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
          <AreaChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              minTickGap={80}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="dayString"
            />
            <YAxis
              hide={isMobile}
              type="number"
              tickMargin={16}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={2}
            />
            <YAxis
              hide={true}
              type="number"
              tickMargin={16}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={3}
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={currencyUnit === 'ETH' ? 'Price (ETH/' + symbol + ')' : 'Price (USD/' + symbol + ')'}
              dataKey={currencyUnit === 'ETH' ? 'ethPerToken' : 'tokenPriceUSD'}
              yAxisId={2}
              fill="var(--c-token)"
              opacity={'0.4'}
              stroke="var(--c-token)"
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={currencyUnit === 'USD' ? 'Inverse (' + symbol + '/USD)' : 'Inverse (' + symbol + '/ETH)'}
              dataKey={currencyUnit === 'USD' ? 'tokensPerUSD' : 'tokensPerEth'}
              yAxisId={3}
              fill="var(--c-token)"
              opacity={'0'}
              stroke="var(--c-token)"
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: 'var(--c-zircon)'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    )
  }
  if (chartOption !== 'volume' && chartData && data) {
    return (
      <ChartWrapper>
        <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
          <AreaChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
              minTickGap={80}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="dayString"
            />
            <YAxis
              hide={isMobile}
              type="number"
              tickMargin={16}
              orientation="left"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
            />
            <YAxis
              hide={true}
              type="number"
              tickMargin={16}
              orientation="right"
              tickFormatter={tick => toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={1}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: 'var(--c-zircon)'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={'Total Liquidity' + (currencyUnit === 'USD' ? ' (USD)' : ' (ETH)')}
              dataKey={currencyUnit === 'USD' ? 'usdLiquidity' : 'ethLiquidity'}
              yAxisId={0}
              fill="var(--c-token)"
              opacity={'0.4'}
              stroke="var(--c-token)"
            />
            <Area
              type="monotone"
              name={'Eth Balance'}
              dataKey={'ethBalance'}
              fill="var(--c-token)"
              opacity={'0'}
              stroke="var(--c-token)"
            />
            <Area
              type="monotone"
              name={'Token Balance'}
              dataKey={'tokenBalance'}
              fill="var(--c-token)"
              yAxisId={1}
              opacity={'0'}
              stroke="var(--c-token)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    )
  } else {
    // volume
    return (
      <ChartWrapper>
        <ResponsiveContainer aspect={isMobile ? 60 / 22 : 60 / 12}>
          <BarChart margin={{ top: 0, right: 0, bottom: 6, left: 10 }} barCategoryGap={1} data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="dayString"
            />
            <YAxis
              hide={isMobile}
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={tick => toK(tick)}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
            />
            <Tooltip
              cursor={true}
              formatter={val => toK(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: 'var(--c-zircon)'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Bar
              type="monotone"
              name={'Volume' + (currencyUnit === 'USD' ? ' (USD)' : ' (ETH)')}
              dataKey={currencyUnit === 'USD' ? 'usdVolume' : 'ethVolume'}
              fill="var(--c-token)"
              opacity={'0.4'}
              yAxisId={0}
              stroke="var(--c-token)"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    )
  }
}

export default Chart

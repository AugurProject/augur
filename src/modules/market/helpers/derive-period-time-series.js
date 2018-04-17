import { MILLIS_PER_BLOCK } from 'modules/app/constants/network'

import { createBigNumber } from 'utils/create-big-number'

import { isEmpty } from 'lodash'

export default function derivePeriodTimeSeries(event) {
  if (isEmpty(event.data)) return []

  const options = event.data

  if ( // Can't do it
    options.priceTimeSeries.length === 0 ||
    options.selectedPeriod.selectedPeriod === undefined ||
    options.selectedPeriod.selectedPeriod === -1
  ) return []

  // Determine range first, return sliced array
  let constrainedPriceTimeSeries = [...options.priceTimeSeries]

  if (options.selectedPeriod.selectedRange !== null) {
    constrainedPriceTimeSeries = constrainedPriceTimeSeries.reverse()

    let timeOffset = 0
    let offsetIndex = 1
    constrainedPriceTimeSeries.find((priceTime, i) => {
      if (i !== 0) {
        timeOffset+= constrainedPriceTimeSeries[i - 1].timestamp - priceTime.timestamp
      }

      if (timeOffset > options.selectedPeriod.selectedRange) {
        offsetIndex = i
        return true
      }

      return false
    })

    constrainedPriceTimeSeries.splice(offsetIndex)
    constrainedPriceTimeSeries = constrainedPriceTimeSeries.reverse()
  }

  // Determine the first period start time (derived from epoch) + period count
  let firstPeriodStartTime
  let periodCount
  if (options.selectedPeriod.selectedPeriod === null) {
    firstPeriodStartTime = Math.floor(constrainedPriceTimeSeries[0].timestamp / MILLIS_PER_BLOCK) * MILLIS_PER_BLOCK
    periodCount = (Date.now() - firstPeriodStartTime) / MILLIS_PER_BLOCK
  } else {
    firstPeriodStartTime = Math.floor(constrainedPriceTimeSeries[0].timestamp / options.selectedPeriod.selectedPeriod) * options.selectedPeriod.selectedPeriod
    periodCount = (Date.now() - firstPeriodStartTime) / options.selectedPeriod.selectedPeriod
  }

  // Establish the set of periods for the selected range + period
  const periods = [...new Array(Math.floor(periodCount))].map((value, i) => ({
    period: firstPeriodStartTime + (i * (options.selectedPeriod.selectedPeriod == null ? MILLIS_PER_BLOCK : options.selectedPeriod.selectedPeriod)),
  }))

  let currentSeriesItem = 0

  return periods.reduce((p, period, periodI) => {
    const periodSeriesItems = constrainedPriceTimeSeries.filter((item, filterI) => {
      if (
        (
          periods.length - 1 === periodI &&
          (item.timestamp >= period.period)
        ) ||
        (item.timestamp >= period.period && item.timestamp < periods[periodI + 1].period)
      ) {
        currentSeriesItem = filterI
        return true
      }
      return false
    })

    let accumulationPeriod = {
      ...period,
    }

    if (periodSeriesItems.length === 0) {
      const lastPrice = createBigNumber(constrainedPriceTimeSeries[currentSeriesItem].price)
      accumulationPeriod = {
        ...accumulationPeriod,
        high: lastPrice,
        low: lastPrice,
        open: lastPrice,
        close: lastPrice,
        volume: createBigNumber(0),
      }
    } else {
      accumulationPeriod = {
        ...accumulationPeriod,
        ...periodSeriesItems.reduce((p, item, i) => {
          const itemPrice = createBigNumber(item.price)

          if (i === 0) {
            return {
              ...period,
              open: itemPrice,
              high: itemPrice,
              low: itemPrice,
              close: itemPrice,
              volume: createBigNumber(item.amount),
            }
          }

          // console.log(item, p)

          return {
            ...p,
            high: itemPrice.lt(p.high) ? itemPrice : p.high,
            low: itemPrice.lt(p.low) ? itemPrice : p.low,
            close: itemPrice,
            volume: (p.volume || createBigNumber(0)).plus(item.amount),
          }
        }, {}),
      }
    }

    // NOTE --  toString BNs here due to the stripping of BN objects during
    //          serialization of the message for posted back to main thread
    Object.entries(accumulationPeriod).forEach(([key, value]) => {
      if (key !== 'period') accumulationPeriod[key] = value.toString()
    })

    return [...p, accumulationPeriod]
  }, [])
}

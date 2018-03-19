onmessage = (event) => {
  console.log('workr -- ', event)
}


// import { isEmpty } from 'lodash'
//
// import { dateToBlock } from 'utils/date-to-block-to-date'
//
// import { MILLIS_PER_BLOCK } from 'modules/app/constants/network'

// export default function DerivePeriodTimeSeries() {
//   self.onmessage = (event) => {
//     console.log('es6 derivePeriodTimeSeries -- ', event)
//   }
//   self.addEventListener('message', (event) => {
//     console.log('derivePeriodTimeSeries -- ', event)
//     return self.postMessage([])
//   })

  // onmessage = (event) => {
  //   console.log('derivePeriodTimeSeries -- ', event)
  //   if (isEmpty(event.data)) return postMessage([])

  // const options = event.data
  //
  // if ( // Can't do it
  //   options.priceTimeSeries.length === 0 ||
  //   options.selectedPeriod.selectedPeriod === undefined ||
  //   options.selectedPeriod.selectedPeriod === -1
  // ) return postMessage([])
  //
  // // Determine range first, return sliced array
  // let constrainedPriceTimeSeries = [...options.priceTimeSeries]
  //
  // if (options.selectedPeriod.selectedRange !== null) {
  //   constrainedPriceTimeSeries = constrainedPriceTimeSeries.reverse()
  //
  //   let timeOffset = 0
  //   let offsetIndex = 1
  //   constrainedPriceTimeSeries.find((priceTime, i) => {
  //     if (i !== 0) {
  //       timeOffset+= constrainedPriceTimeSeries[i - 1].timestamp - priceTime.timestamp
  //     }
  //
  //     if (timeOffset > options.selectedPeriod.selectedRange) {
  //       offsetIndex = i
  //       return true
  //     }
  //
  //     return false
  //   })
  //
  //   constrainedPriceTimeSeries.splice(offsetIndex)
  //   constrainedPriceTimeSeries = constrainedPriceTimeSeries.reverse()
  // }
  //
  // // Determine the first period start time (derived from epoch)
  // let firstPeriodStartTime
  // if (options.selectedPeriod.selectedPeriod === null) {
  //   firstPeriodStartTime = Math.floor(constrainedPriceTimeSeries[0].timestamp / MILLIS_PER_BLOCK) * MILLIS_PER_BLOCK
  // } else {
  //   firstPeriodStartTime = Math.floor(constrainedPriceTimeSeries[0].timestamp / options.selectedPeriod.selectedPeriod) * options.selectedPeriod.selectedPeriod
  // }
  //
  // // Process priceTimeSeries by period next, update state
  // let accumulationPeriod = {
  //   period: null, // Start time of the period
  //   high: null, // Highest price during that period
  //   low: null, // Lowest price during that period
  //   open: null, // First price in that period
  //   close: null, // Last price in that period
  //   volume: null, // Total number of shares in that period
  // }
  //
  // const periodTimeSeries = constrainedPriceTimeSeries.reduce((p, priceTime, i) => {
  //   if (accumulationPeriod.period === null) {
  //     accumulationPeriod = {
  //       period: firstPeriodStartTime,
  //       high: priceTime.price,
  //       low: priceTime.price,
  //       open: priceTime.price,
  //       close: priceTime.price,
  //       volume: priceTime.amount,
  //     }
  //     return p
  //   }
  //
  //   // If new period exceeds the permissible period, return the accumulationPeriod + reset to default to prepare for the next period
  //   if (
  //     (
  //       options.selectedPeriod.selectedPeriod === null && // per block
  //       dateToBlock(new Date(accumulationPeriod.period), options.currentBlock) - dateToBlock(new Date(priceTime.timestamp), options.currentBlock) >= 1
  //     ) ||
  //     priceTime.timestamp - accumulationPeriod.period > options.selectedPeriod.selectedPeriod
  //   ) {
  //     const updatedPeriodTimeSeries = [...p, accumulationPeriod]
  //     accumulationPeriod = {
  //       period: priceTime.timestamp,
  //       high: priceTime.price,
  //       low: priceTime.price,
  //       open: priceTime.price,
  //       close: priceTime.price,
  //       volume: priceTime.amount,
  //     }
  //     return updatedPeriodTimeSeries
  //   }
  //
  //   // Otherwise, process as normal
  //   // NOTE -- had to use object.assign as the parser was having issue w/ spread
  //   accumulationPeriod = Object.assign(accumulationPeriod, {
  //     high: priceTime.price > accumulationPeriod.high ? priceTime.price : accumulationPeriod.high,
  //     low: priceTime.price < accumulationPeriod.low ? priceTime.price : accumulationPeriod.low,
  //     close: priceTime.price,
  //     volume: accumulationPeriod.volume + priceTime.amount,
  //   })
  //
  //   // If we've reached the end of the series, just return what has accumulated w/in the current period
  //   if (priceTime.length - 1 === i) {
  //     return [...p, accumulationPeriod]
  //   }
  //
  //   return p
  // }, [])
  //
  // // this.setState({ periodTimeSeries })
  // postMessage(periodTimeSeries)
  // }
// }

import { MILLIS_PER_BLOCK } from 'modules/app/constants/network'

/**
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {Date}
 */
export function blockToDate(block, currentBlock, currentAugurTimestampInMilliseconds) {
  const seconds = (block - currentBlock) * (MILLIS_PER_BLOCK / 1000)
  const now = new Date(currentAugurTimestampInMilliseconds)
  now.setSeconds(now.getSeconds() + (seconds))
  return now
}

/**
 * @param {Date} date
 * @param {Number} currentBlock
 * @return {Number}
 */
export function dateToBlock(date, currentBlock, currentAugurTimestampInMilliseconds) {
  const milliDelta = date.getTime() - new Date().getTime(currentAugurTimestampInMilliseconds)
  const blockDelta = parseInt(milliDelta / MILLIS_PER_BLOCK, 10)
  return currentBlock + blockDelta
}

import { MILLIS_PER_BLOCK } from '../modules/app/constants/network';

/**
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {Date}
 */
export function blockToDate(block, currentBlock) {
	const seconds = (block - currentBlock) * (MILLIS_PER_BLOCK / 1000);
	const now = new Date();
	now.setSeconds(now.getSeconds() + (seconds));
	return now;
}

/**
 * @param {Date} date
 * @param {Number} currentBlock
 * @return {Number}
 */
export function dateToBlock(date, currentBlock) {
	const now = new Date();
	const secondsDelta = date.getSeconds() - now.getSeconds();
	const blockDelta = parseInt(secondsDelta / (MILLIS_PER_BLOCK / 1000), 10);
	return currentBlock + blockDelta;
}

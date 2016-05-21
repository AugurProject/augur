/*
 * Author: priecint
 */
import constants from 'augur.js/src/constants';
/**
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {Date}
 */
export function blockToDate(block, currentBlock) {
	const seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
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
	const blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK, 10);
	return currentBlock + blockDelta;
}

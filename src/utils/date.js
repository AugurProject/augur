/*
 * Author: priecint
 */

import constants from 'augur.js/src/constants';

/**
 * 
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {Date}
 */
export function blockToDate(block, currentBlock) {
    let seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    let now = new Date();
    now.setSeconds(now.getSeconds() + (seconds))
    return now;
}

/**
 * 
 * @param {Date} date
 * @param {Number} currentBlock
 * @return {Number}
 */
export function dateToBlock(date, currentBlock) {
    let now = new Date();
    let secondsDelta = date.getSeconds() - now.getSeconds();
    let blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);
    return currentBlock + blockDelta;
}
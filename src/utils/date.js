/*
 * Author: priecint
 */

import moment from 'moment';

import constants from 'augur.js/src/constants';

/**
 * 
 * @param {Number} block
 * @param {Number} currentBlock
 * @return {moment}
 */
export function blockToDate(block, currentBlock) {
    var seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    return moment().add(seconds, 'seconds');
}

/**
 * 
 * @param {moment} date
 * @param {Number} currentBlock
 * @return {*}
 */
export function dateToBlock(date, currentBlock) {
    var now = moment();
    var secondsDelta = date.diff(now, 'seconds');
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);
    return currentBlock + blockDelta;
}
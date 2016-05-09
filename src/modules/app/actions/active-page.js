/*
 * Author: priecint
 */
import { M } from '../../app/constants/pages';

import { loadPriceHistory } from '../../markets/actions/load-price-history'

/**
 * Performs actions needed by current active page (e.g. fetch data for that page).
 * Sometimes this function is recursive
 * 
 * @return {Function} Action function
 */
const RETRY_TIMEOUT_MILLIS = 5000; // arbitrary number

let retryTimer;

export function prepareActivePage() {
    return function (dispatch, getState) {
        let { activePage, connection, selectedMarketID } = getState();

        if (activePage === M) {
            if (retryTimer == null) { // only do something if there is no call scheduled
                if (connection.isConnected) {
                    dispatch(loadPriceHistory(selectedMarketID));
                } else {
                    // schedule call for future
                    // todo: use some kind of task manager to manage timers, it shouldn't be here
                        retryTimer = setTimeout(() => {
                            retryTimer = null;
                            dispatch(prepareActivePage());
                        }, RETRY_TIMEOUT_MILLIS);
                }
            }
        }
    }
}
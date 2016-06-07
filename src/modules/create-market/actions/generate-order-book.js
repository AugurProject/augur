import {
    SUCCESS,
    FAILED,
    GENERATING_ORDER_BOOK
} from '../../transactions/constants/statuses'

import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction'
import { addGenerateOrderBookTransaction } from '../../transactions/actions/add-generate-order-book-transaction'

import AugurJS from '../../../services/augurjs'

export function submitGenerateOrderBook(marketData){
    return dispatch => {
        // selectTransactionsLink(dispatch).onClick(); Not sure what this does yet...
        dispatch(addGenerateOrderBookTransaction(marketData));
    }

}

export function createOrderBook(transactionID, marketData){
    return dispatch => {
        dispatch(updateExistingTransaction(transactionID, { status: GENERATING_ORDER_BOOK }));

        console.log('createOrderBook -- ', transactionID, marketData);

        AugurJS.generateOrderBook(marketData, (err, res) => {
            if(err){
                console.log('err --', err)
                return;
            }

            console.log('res -- ', res);
        })
    }
}
import { constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import unpackTransactionParameters from 'modules/transactions/actions/unpack-transaction-parameters'
import { addNotification } from 'modules/notifications/actions/update-notifications'

import makePath from 'modules/app/helpers/make-path'

import { TRANSACTIONS } from 'modules/app/constants/views'

export const constructRelayTransaction = tx => (dispatch, getState) => {
  const hash = tx.hash
  const status = tx.status
  const unpackedParams = unpackTransactionParameters(tx)
  console.log('unpacked:', JSON.stringify(unpackedParams, null, 2))
  const timestamp = tx.response.timestamp || parseInt(Date.now() / 1000, 10)
  const blockNumber = tx.response.blockNumber && parseInt(tx.response.blockNumber, 16)
  dispatch(addNotification({
    ...unpackedParams,
    id: hash,
    timestamp,
    blockNumber,
    title: `${unpackedParams.type} - ${status}`,
    description: unpackedParams.description || '',
    linkPath: makePath(TRANSACTIONS)
  }))
  return {
    [hash]: dispatch(constructBasicTransaction(hash, status, blockNumber, timestamp, tx.response.gasFees))
  }
}

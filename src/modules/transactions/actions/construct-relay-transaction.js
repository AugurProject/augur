import { constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import unpackTransactionParameters from 'modules/transactions/actions/unpack-transaction-parameters'
import { addNotification, updateNotification } from 'modules/notifications/actions/update-notifications'
import { selectCurrentTimestampInSeconds } from 'src/select-state'

import makePath from 'modules/routes/helpers/make-path'

import { TRANSACTIONS } from 'modules/routes/constants/views'

export const constructRelayTransaction = tx => (dispatch, getState) => {
  const { notifications } = getState()
  const { hash, status } = tx
  const unpackedParams = unpackTransactionParameters(tx)
  const timestamp = tx.response.timestamp || selectCurrentTimestampInSeconds(getState())
  const blockNumber = tx.response.blockNumber && parseInt(tx.response.blockNumber, 16)
  if (notifications.filter(notification => notification.id === hash).length) {
    dispatch(updateNotification(hash, {
      ...unpackedParams,
      id: hash,
      timestamp,
      blockNumber,
      title: `${unpackedParams.type} - ${status}`,
      description: unpackedParams._description || '',
      linkPath: makePath(TRANSACTIONS),
      seen: false, // Manually set to false to ensure notification
    }))
  } else {
    dispatch(addNotification({
      ...unpackedParams,
      id: hash,
      timestamp,
      blockNumber,
      title: `${unpackedParams.type} - ${status}`,
      description: unpackedParams._description || '',
      linkPath: makePath(TRANSACTIONS),
    }))
  }
  return {
    [hash]: constructBasicTransaction(unpackedParams.type, hash, blockNumber, timestamp, '', unpackedParams._description || '', tx.response.gasFees, status),
  }
}

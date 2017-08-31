import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'

export const slashRep = (market, salt, report, reporter, isIndeterminate, isUnethical) => (
  dispatch => augur.reporting.slashRep({
    branch: market.branchID,
    salt,
    report,
    reporter,
    isIndeterminate,
    isUnethical,
    eventID: market.eventID,
    minValue: market.minValue,
    maxValue: market.maxValue,
    type: market.type,
    onSent: r => console.debug('slashRep sent:', r),
    onSuccess: (r) => {
      console.debug('slashRep success:', r)
      dispatch(updateAssets())
    },
    onFailed: e => console.error('slashRep failed:', e)
  })
)

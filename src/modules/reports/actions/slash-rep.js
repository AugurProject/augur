import { augur } from '../../../services/augurjs';

export const slashRep = (market, salt, report, reporter, isIndeterminate, isUnethical) => (
  dispatch => augur.slashRep({
    branch: market.branchId,
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
    onSuccess: r => console.debug('slashRep success:', r),
    onFailed: e => console.error('slashRep failed:', e)
  })
);

export const UPDATE_PARTICIPATION_TOKENS_DATA = 'UPDATE_PARTICIPATION_TOKENS_DATA'
export const UPDATE_PARTICIPATION_TOKENS_ESCAPE_HATCH_GAS_COST = 'UPDATE_PARTICIPATION_TOKENS_ESCAPE_HATCH_GAS_COST'
export const UPDATE_PARTICIPATION_TOKENS_BALANCE = 'UPDATE_PARTICIPATION_TOKENS_BALANCE'

export const updateParticipationTokensData = participationTokensData => ({ type: UPDATE_PARTICIPATION_TOKENS_DATA, participationTokensData })
export const updateParticipationTokensEscapeHatchGasCost = (feeWindowID, escapeHatchGasCost) => ({ type: UPDATE_PARTICIPATION_TOKENS_ESCAPE_HATCH_GAS_COST, feeWindowID, escapeHatchGasCost })
export const updateParticipationTokenBalance = (feeWindowID, balance) => ({ type: UPDATE_PARTICIPATION_TOKENS_BALANCE, feeWindowID, balance })

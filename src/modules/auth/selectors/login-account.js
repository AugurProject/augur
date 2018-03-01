import { createSelector } from 'reselect'
import { selectLoginAccountState, selectAccountNameState } from 'src/select-state'
import { formatRep, formatEther } from 'utils/format-number'
import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link'
import store from 'src/store'

import getValue from 'utils/get-value'

export default function () {
  return selectLoginAccount(store.getState())
}

export const selectLoginAccount = createSelector(
  selectLoginAccountState,
  selectAccountNameState,
  (loginAccount, accountName) => ({
    ...loginAccount,
    ...generateDownloadAccountLink(loginAccount.address, loginAccount.keystore, getValue(loginAccount, 'privateKey.data') ? loginAccount.privateKey.data : loginAccount.privateKey), // Ternary due to differences in the way data is stored between Airbitz + local -- TODO -- unify
    accountName,
    rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 1 }),
    eth: formatEther(loginAccount.eth, { zeroStyled: false, decimalsRounded: 2 }),
  }),
)

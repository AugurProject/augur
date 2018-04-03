import PropTypes from 'prop-types'

import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'

import { ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_LEGACY_REP } from 'modules/routes/constants/views'

export default class AccountInnerNav extends BaseInnerNav {
  static propTypes = {
    ...BaseInnerNav.propTypes,
    privateKey: PropTypes.string,
  }

  getMainMenuData() {
    const { currentBasePath } = this.props
    return [
      {
        label: 'Deposit',
        visible: true,
        isSelected: (currentBasePath === ACCOUNT_DEPOSIT),
        link: {
          pathname: ACCOUNT_DEPOSIT,
        },
      },
      {
        label: 'Withdraw',
        visible: true,
        isSelected: (currentBasePath === ACCOUNT_WITHDRAW),
        link: {
          pathname: ACCOUNT_WITHDRAW,
        },
      },
      {
        label: 'Legacy REP',
        visible: true,
        isSelected: (currentBasePath === ACCOUNT_LEGACY_REP),
        link: {
          pathname: ACCOUNT_LEGACY_REP,
        },
      },
    ]
  }
}

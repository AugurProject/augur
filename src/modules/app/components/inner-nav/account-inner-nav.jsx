import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_EXPORT } from 'modules/routes/constants/views'

export default class AccountInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Deposit',
        visible: true,
        isSelected: (this.props.currentBasePath === ACCOUNT_DEPOSIT),
        link: {
          pathname: ACCOUNT_DEPOSIT
        }
      },
      {
        label: 'Withdraw',
        visible: true,
        isSelected: (this.props.currentBasePath === ACCOUNT_WITHDRAW),
        link: {
          pathname: ACCOUNT_WITHDRAW
        }
      },
      {
        label: 'Export',
        visible: true,
        isSelected: (this.props.currentBasePath === ACCOUNT_EXPORT),
        link: {
          pathname: ACCOUNT_EXPORT
        }
      },
    ]
  }
}

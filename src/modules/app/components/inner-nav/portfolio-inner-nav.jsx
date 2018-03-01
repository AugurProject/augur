import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { MY_POSITIONS, MY_MARKETS, FAVORITES, PORTFOLIO_TRANSACTIONS, PORTFOLIO_REPORTS } from 'modules/routes/constants/views'

export default class PorfolioInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Positions',
        visible: true,
        isSelected: (this.props.currentBasePath === MY_POSITIONS),
        link: {
          pathname: MY_POSITIONS,
        },
      },
      {
        label: 'My Markets',
        visible: true,
        isSelected: (this.props.currentBasePath === MY_MARKETS),
        link: {
          pathname: MY_MARKETS,
        },
      },
      {
        label: 'Favorites',
        visible: true,
        isSelected: (this.props.currentBasePath === FAVORITES),
        link: {
          pathname: FAVORITES,
        },
      },
      {
        label: 'Transactions',
        visible: true,
        isSelected: (this.props.currentBasePath === PORTFOLIO_TRANSACTIONS),
        link: {
          pathname: PORTFOLIO_TRANSACTIONS,
        },
      },
      {
        label: 'Reporting',
        visible: true,
        isSelected: (this.props.currentBasePath === PORTFOLIO_REPORTS),
        link: {
          pathname: PORTFOLIO_REPORTS,
        },
      },
    ]
  }
}

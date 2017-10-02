import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { MY_POSITIONS, MY_MARKETS, WATCHLIST } from 'modules/routes/constants/views'

export default class PorfolioInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Positions',
        visible: true,
        isSelected: (this.props.currentBasePath === MY_POSITIONS),
        link: {
          pathname: MY_POSITIONS
        }
      },
      {
        label: 'My Markets',
        visible: true,
        isSelected: (this.props.currentBasePath === MY_MARKETS),
        link: {
          pathname: MY_MARKETS
        }
      },
      {
        label: 'Watching',
        visible: true,
        isSelected: (this.props.currentBasePath === WATCHLIST),
        link: {
          pathname: WATCHLIST
        }
      }
    ]
  }
}

import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { REPORTING_OPEN, REPORTING_CLOSED } from 'modules/routes/constants/views'

export default class ReportingInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Reporting',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING_OPEN),
        link: {
          pathname: REPORTING_OPEN
        }
      },
      {
        label: 'Closed',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING_CLOSED),
        link: {
          pathname: REPORTING_CLOSED
        }
      },
    ]
  }
}

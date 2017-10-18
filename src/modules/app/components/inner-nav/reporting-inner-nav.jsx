import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { REPORTING, REPORTING_CLOSED } from 'modules/routes/constants/views'

export default class ReportingInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Reporting',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING),
        link: {
          pathname: REPORTING
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

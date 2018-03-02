import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { REPORTING_DISPUTE, REPORTING_REPORTING, REPORTING_RESOLVED } from 'modules/routes/constants/views'

export default class ReportingInnerNav extends BaseInnerNav {
  getMainMenuData() {
    return [
      {
        label: 'Dispute',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING_DISPUTE),
        link: {
          pathname: REPORTING_DISPUTE,
        },
      },
      {
        label: 'Reporting',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING_REPORTING),
        link: {
          pathname: REPORTING_REPORTING,
        },
      },
      {
        label: 'Resolved',
        visible: true,
        isSelected: (this.props.currentBasePath === REPORTING_RESOLVED),
        link: {
          pathname: REPORTING_RESOLVED,
        },
      },
    ]
  }
}

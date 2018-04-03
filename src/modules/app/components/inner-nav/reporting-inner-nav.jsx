import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'
import { REPORTING_DISPUTE_MARKETS, REPORTING_REPORT_MARKETS, REPORTING_RESOLVED_MARKETS } from 'modules/routes/constants/views'

export default class ReportingInnerNav extends BaseInnerNav {
  getMainMenuData() {
    const { currentBasePath } = this.props
    return [
      {
        label: 'Reporting',
        visible: true,
        isSelected: (currentBasePath === REPORTING_REPORT_MARKETS),
        link: {
          pathname: REPORTING_REPORT_MARKETS,
        },
      },
      {
        label: 'Dispute',
        visible: true,
        isSelected: (currentBasePath === REPORTING_DISPUTE_MARKETS),
        link: {
          pathname: REPORTING_DISPUTE_MARKETS,
        },
      },
      {
        label: 'Resolved',
        visible: true,
        isSelected: (currentBasePath === REPORTING_RESOLVED_MARKETS),
        link: {
          pathname: REPORTING_RESOLVED_MARKETS,
        },
      },
    ]
  }
}

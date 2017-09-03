import selectMyReports from 'modules/my-reports/selectors/my-reports';
import speedomatic from 'speedomatic';
import { ZERO } from 'modules/trade/constants/numbers';

export default function () {
  const reports = selectMyReports();

  const numReports = reports.length;
  const netRep = reports.reduce((prevNet, report) => (
        report.repEarned && report.repEarned.value ?
            prevNet.plus(speedomatic.bignum(report.repEarned.value)) :
            prevNet
    ), ZERO).toNumber();

  return {
    numReports,
    netRep
  };
}

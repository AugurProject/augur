import { createBigNumber } from "utils/create-big-number";
import selectReports from "modules/reports/selectors/reports";
import { ZERO } from "modules/trade/constants/numbers";

export default function() {
  const reports = selectReports();

  const numReports = reports.length;
  const netRep = reports
    .reduce(
      (prevNet, report) =>
        report.repEarned && report.repEarned.value
          ? prevNet.plus(createBigNumber(report.repEarned.value, 10))
          : prevNet,
      ZERO
    )
    .toNumber();

  return {
    numReports,
    netRep
  };
}

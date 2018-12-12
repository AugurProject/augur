import assertFormattedNumber from "src/assertions/common/formatted-number";

export default function(reportsSummary) {
  expect(reportsSummary).toBeDefined();
  expect(typeof reportsSummary).toBe("object");

  assertFormattedNumber(reportsSummary.numReports, "reportsSummary.numReports");
  assertFormattedNumber(reportsSummary.netRep, "reportsSummary.netRep");
}

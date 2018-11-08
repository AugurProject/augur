import assertFormattedNumber from "assertions/common/formatted-number";
import assertFormattedDate from "assertions/common/formatted-date";

export default function(reports) {
  describe(`loginAccountReports.reports' shape`, () => {
    expect(reports).toBeDefined();
    expect(Array.isArray(reports)).toBe(true);

    reports.forEach(report => {
      assertAccountReport(report);
    });
  });
}

export function assertAccountReport(report) {
  describe(`report's shape`, () => {
    test("id", () => {
      expect(report.id).toBeDefined();
      expect(typeof report.id).toBe("string");
    });

    test("description", () => {
      expect(report.description).toBeDefined();
      expect(typeof report.description).toBe("string");
    });

    test("outcome", () => {
      expect(report.outcome).toBeDefined();

      report.outcome != null && expect(typeof report.outcome).toBe("string");
    });

    test("outcomePercentage", () => {
      expect(report.outcomePercentage).toBeDefined();

      assertFormattedNumber(report.outcomePercentage, "report.fees");
    });

    test("reported", () => {
      expect(report.reported).toBeDefined();
      expect(typeof report.reported).toBe("string");
    });

    test("isReportEqual", () => {
      expect(report.isReportEqual).toBeDefined();
      expect(typeof report.isReportEqual).toBe("boolean");
    });

    test("feesEarned", () => {
      expect(report.feesEarned).toBeDefined();

      assertFormattedNumber(report.feesEarned, "report.feesEarned");
    });

    test("repEarned", () => {
      expect(report.repEarned).toBeDefined();

      assertFormattedNumber(report.repEarned, "report.repEarned");
    });

    test("endTime", () => {
      expect(report.endTime).toBeDefined();

      assertFormattedDate(report.endTime, "report.endTime");
    });

    test("isChallenged", () => {
      expect(report.isChallenged).toBeDefined();
      expect(typeof report.isChallenged).toBe("boolean");
    });

    test("isChallangeable", () => {
      expect(report.isChallengeable).toBeDefined();
      expect(typeof report.isChallengeable).toBe("boolean");
    });
  });
}

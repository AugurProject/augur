export default function(loginAccountReports) {
  describe(`loginAccountReports' shape`, () => {
    expect(loginAccountReports).toBeDefined();
    expect(typeof loginAccountReports).toBe("object");

    test("reports", () => {
      expect(loginAccountReports.reports).toBeDefined();
      expect(Array.isArray(loginAccountReports.reports)).toBe(true);
    });

    test("summary", () => {
      expect(loginAccountReports.summary).toBeDefined();
      expect(typeof loginAccountReports.summary).toBe("object");
    });
  });
}

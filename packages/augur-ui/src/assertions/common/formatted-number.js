export default function(actual, label = "Formatted Number") {
  describe(label, () => {
    test("should be formatted number", () => {
      expect(actual.value).toBeDefined();
      expect(typeof actual.value).toBe("number");
      expect(actual.formattedValue).toBeDefined();
      expect(typeof actual.formattedValue).toBe("number");
      expect(actual.formatted).toBeDefined();
      expect(typeof actual.formatted).toBe("string");
      expect(actual.roundedValue).toBeDefined();
      expect(typeof actual.roundedValue).toBe("number");
      expect(actual.rounded).toBeDefined();
      expect(typeof actual.rounded).toBe("string");
      expect(actual.minimized).toBeDefined();
      expect(typeof actual.minimized).toBe("string");
      expect(actual.denomination).toBeDefined();
      expect(typeof actual.denomination).toBe("string");
      expect(actual.full).toBeDefined();
      expect(typeof actual.full).toBe("string");
    });
  });
}

export default function(link, label = "Link") {
  describe(`${label} Shape`, () => {
    expect(link).toBeDefined();
    expect(typeof link).toBe("object");

    test("href", () => {
      expect(link.href).toBeDefined();
      expect(typeof link.href).toBe("string");
    });

    test("onClick", () => {
      expect(link.onClick).toBeDefined();
      expect(typeof link.onClick).toBe("function");
    });
  });
}

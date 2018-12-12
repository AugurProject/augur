export default function(formattedDate, label = "Formatted Date") {
  describe(`${label}`, () => {
    test(`should be formatted date`, () => {
      expect(formattedDate.value).toBeDefined();
      expect(formattedDate.value).toBeInstanceOf(Date);
      expect(formattedDate.formatted).toBeDefined();
      expect(typeof formattedDate.formatted).toBe("string");
      expect(formattedDate.full).toBeDefined();
      expect(typeof formattedDate.full).toBe("string");
    });
  });
}

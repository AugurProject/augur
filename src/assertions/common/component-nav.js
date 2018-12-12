export default function(nav, label = "Component Nav Item") {
  describe(`${label} Shape`, () => {
    expect(nav).toBeDefined();
    expect(typeof nav).toBe("object");

    expect(nav.label).toBeDefined();
    expect(typeof nav.label).toBe("string");
  });
}

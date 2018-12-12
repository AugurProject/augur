export default function(tags) {
  expect(tags).toBeDefined();
  expect(Array.isArray(tags)).toBe(true);

  tags.forEach(tag => {
    expect(tag).toBeDefined();
    expect(typeof tag).toBe("object");

    expect(tag.name).toBeDefined();
    expect(typeof tag.name).toBe("string");

    expect(tag.value).toBeDefined();
    expect(typeof tag.value).toBe("string");

    expect(tag.numMatched).toBeDefined();
    expect(typeof tag.numMatched).toBe("number");

    expect(tag.isSelected).toBeDefined();
    expect(typeof tag.isSelected).toBe("boolean");

    expect(tag.onClick).toBeDefined();
    expect(typeof tag.onClick).toBe("function");
  });
}

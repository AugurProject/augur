export default function(fS) {
  expect(fS).toBeDefined();
  expect(typeof fS).toBe("object");

  const sFS = fS.selectedFilterSort;

  expect(sFS).toBeDefined();
  expect(typeof sFS).toBe("object");

  expect(sFS.type).toBeDefined();
  expect(typeof sFS.type).toBe("string");

  expect(sFS.sort).toBeDefined();
  expect(typeof sFS.sort).toBe("string");

  expect(sFS.isDesc).toBeDefined();
  expect(typeof sFS.isDesc).toBe("boolean");

  expect(fS.types).toBeDefined();
  expect(Array.isArray(fS.types)).toBe(true);

  fS.types.forEach(type => {
    expect(type.label).toBeDefined();
    expect(typeof type.label).toBe("string");

    expect(type.value).toBeDefined();
    expect(typeof type.value).toBe("string");
  });

  fS.sorts.forEach(type => {
    expect(type.label).toBeDefined();
    expect(typeof type.label).toBe("string");

    expect(type.value).toBeDefined();
    expect(typeof type.value).toBe("string");
  });

  expect(fS.order).toBeDefined();
  expect(typeof fS.order).toBe("object");

  expect(fS.order.isDesc).toBeDefined();
  expect(typeof fS.order.isDesc).toBe("boolean");
}

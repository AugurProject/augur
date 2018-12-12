export default function(pagination) {
  expect(pagination).toBeDefined();
  expect(typeof pagination).toBe("object");

  expect(pagination.numPerPage).toBeDefined();
  expect(typeof pagination.numPerPage).toBe("number");

  expect(pagination.numPages).toBeDefined();
  expect(typeof pagination.numPages).toBe("number");

  expect(pagination.selectedPageNum).toBeDefined();
  expect(typeof pagination.selectedPageNum).toBe("number");

  expect(pagination.nextPageNum).toBeDefined();
  expect(typeof pagination.nextPageNum).toBe("number");

  expect(pagination.startItemNum).toBeDefined();
  expect(typeof pagination.startItemNum).toBe("number");

  expect(pagination.endItemNum).toBeDefined();
  expect(typeof pagination.endItemNum).toBe("number");

  expect(pagination.numUnpaginated).toBeDefined();
  expect(typeof pagination.numUnpaginated).toBe("number");

  expect(pagination.nextItemNum).toBeDefined();
  expect(typeof pagination.nextItemNum).toBe("number");

  expect(pagination.onUpdateSelectedPageNum).toBeDefined();
  expect(typeof pagination.onUpdateSelectedPageNum).toBe("function");

  expect(pagination.previousPageLink).toBeDefined();
  expect(typeof pagination.previousPageLink).toBe("object");

  expect(pagination.nextPageLink).toBeDefined();
  expect(typeof pagination.nextPageLink).toBe("object");
}

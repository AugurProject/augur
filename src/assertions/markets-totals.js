export default function(marketsTotals) {
  expect(marketsTotals).toBeDefined();
  expect(typeof marketsTotals).toBe("object");

  checkDefinedAndNumber(marketsTotals.numAll, `numAll`);
  checkDefinedAndNumber(marketsTotals.numFavorites, `numFavorites`);
  checkDefinedAndNumber(marketsTotals.numFiltered, `numFiltered`);
  checkDefinedAndNumber(marketsTotals.numPendingReports, `numPendingReports`);
  checkDefinedAndNumber(marketsTotals.numUnpaginated, `numUnpaginated`);
}

function checkDefinedAndNumber(obj) {
  expect(obj).toBeDefined();
  expect(typeof obj).toBe("number");
}

import assertActivePage from "./active-view";
import assertPositionsSummary from "./positions-summary";

export default function(siteHeader) {
  expect(siteHeader).toBeDefined();
  expect(typeof siteHeader).toBe("object");
  assertActivePage(siteHeader.activePage);
  assertPositionsSummary(siteHeader.positionsSummary);
}

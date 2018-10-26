export default function(selectedOutcome) {
  expect(typeof selectedOutcome).toBe('object');
  expect(selectedOutcome.selectedOutcomeId).toBeDefined();
  expect(typeof selectedOutcome.updateSelectedOutcome).toBe('function');
  expect(selectedOutcome.updateSelectedOutcome).toBeDefined();
}

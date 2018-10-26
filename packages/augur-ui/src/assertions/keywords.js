export default function(keywords) {
  expect(keywords).toBeDefined();
  expect(typeof keywords).toBe('object');
  expect(keywords.value).toBeDefined();
  expect(typeof keywords.value).toBe('string');
  expect(keywords.onChangeKeywords).toBeDefined();
  expect(typeof keywords.onChangeKeywords).toBe('function');
}

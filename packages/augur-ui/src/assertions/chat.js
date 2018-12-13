export default function(chat) {
  expect(chat).toBeDefined();
  expect(typeof chat).toBe("object");

  Object.keys(chat).forEach(room => {
    expect(chat[room]).toBeDefined();
    expect(typeof chat[room]).toBe("object");
  });

  // TODO -- flesh these test out
}

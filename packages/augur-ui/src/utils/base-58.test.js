import * as base58 from "utils/base-58";

describe(`utils/base-58.js`, () => {
  describe("base58", () => {
    test("Decode", () => {
      const decoded = base58.base58Decode(
        "kpXKnbi9Czht5bSPbpf7QoYiDWDF8UWZzmWiCrM7xoE4rbkZ7WmpM4dq9WLki1F8Qhg4bcBYtE8"
      );

      expect(decoded).toEqual({
        hello: "world",
        description: "this is a test object"
      });
    });

    test("Encode", () => {
      const encoded = base58.base58Encode({
        hello: "world",
        description: "this is a test object"
      });
      expect(encoded).toEqual(
        "kpXKnbi9Czht5bSPbpf7QoYiDWDF8UWZzmWiCrM7xoE4rbkZ7WmpM4dq9WLki1F8Qhg4bcBYtE8"
      );
    });
  });
});

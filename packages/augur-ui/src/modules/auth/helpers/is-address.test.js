import isAddress from "modules/auth/helpers/is-address";

describe("is-address", () => {
  test("It should return false for non-addressy values", () => {
    expect(isAddress(`this isn't a valid address string`)).toBe(false);
  });
  test("It should return true for a lowercase address with 0x", () => {
    expect(isAddress(`0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb`)).toBe(true);
  });
  test("It should return true for a lowercase address without 0x", () => {
    expect(isAddress(`913da4198e6be1d5f5e4a40d0667f70c0b5430eb`)).toBe(true);
  });
  test("It should return false for a bad checksum address without 0x", () => {
    expect(isAddress(`913Da4198E6be1d5f5e4a40d0667f70C0b5430eb`)).toBe(false);
  });
  test("It should return false for a bad checksum address with 0x", () => {
    expect(isAddress(`0x913Da4198E6be1d5f5e4a40d0667f70C0b5430eb`)).toBe(false);
  });
  test("It should return true for a checksum address with 0x", () => {
    expect(isAddress(`0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb`)).toBe(true);
  });
  test("It should return true for a checksum address without 0x", () => {
    expect(isAddress(`913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb`)).toBe(true);
  });
});

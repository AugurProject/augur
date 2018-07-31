import isAddress from 'modules/auth/helpers/is-address'

describe('is-address', () => {
  const test = t => it(t.description, () => t.assertions())
  test({
    description: 'It should return false for non-addressy values',
    assertions: () => {
      assert.isFalse(isAddress(`this isn't a valid address string`), 'Expected a false returned for a bad address string')
    },
  })
  test({
    description: 'It should return true for a lowercase address with 0x',
    assertions: () => {
      assert.isTrue(isAddress(`0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb`), 'Expected a true returned for a lowercase valid address string with 0x')
    },
  })
  test({
    description: 'It should return true for a lowercase address without 0x',
    assertions: () => {
      assert.isTrue(isAddress(`913da4198e6be1d5f5e4a40d0667f70c0b5430eb`), 'Expected a true returned for a lowercase valid address string without 0x')
    },
  })
  test({
    description: 'It should return false for a bad checksum address without 0x',
    assertions: () => {
      assert.isFalse(isAddress(`913Da4198E6be1d5f5e4a40d0667f70C0b5430eb`), 'Expected a false returned for a bad checksum address string without 0x')
    },
  })
  test({
    description: 'It should return false for a bad checksum address with 0x',
    assertions: () => {
      assert.isFalse(isAddress(`0x913Da4198E6be1d5f5e4a40d0667f70C0b5430eb`), 'Expected a false returned for a bad checksum address string with 0x')
    },
  })
  test({
    description: 'It should return true for a checksum address with 0x',
    assertions: () => {
      assert.isTrue(isAddress(`0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb`), 'Expected a true returned for a checksum valid address string')
    },
  })
  test({
    description: 'It should return true for a checksum address without 0x',
    assertions: () => {
      assert.isTrue(isAddress(`913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb`), 'Expected a true returned for a checksum valid address string missing the 0x')
    },
  })
})

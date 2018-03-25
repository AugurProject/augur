

// import speedomatic from 'speedomatic'
// import thunk from 'redux-thunk'
// import configureMockStore from 'redux-mock-store'

import loadClaimableFees from 'modules/portfolio/actions/load-claimable-fees'

describe('modules/portfolio/actions/load-claimable-fees.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('loadClaimableFees', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        const actual = loadClaimableFees()()
        const expected = {
          unclaimedEth: '1',
          unclaimedRepStaked: '2',
          unclaimedRepEarned: '3',
          claimedEth: '4',
          claimedRepStaked: '5',
          claimedRepEarned: '6',
        }
        assert.deepEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })
})

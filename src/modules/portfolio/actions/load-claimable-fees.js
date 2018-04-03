// import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

// TODO: Integrate augur.js function for getting claimable fees once it's ready.

export default function loadClaimableFees(options, callback = logError) {
  return (dispatch, getState) => ({
    unclaimedEth: '1',
    unclaimedRepStaked: '2000000000000000000',
    unclaimedRepEarned: '3',
    claimedEth: '4',
    claimedRepStaked: '5',
    claimedRepEarned: '6',
  })
}

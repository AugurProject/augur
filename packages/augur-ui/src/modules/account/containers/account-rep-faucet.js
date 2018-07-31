import { connect } from 'react-redux'

import getRep from 'modules/account/actions/get-rep'
import AccountRepFaucet from 'modules/account/components/account-rep-faucet/account-rep-faucet'

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  repFaucet: () => dispatch(getRep()),
})

const AccountRepFaucetContainer = connect(mapStateToProps, mapDispatchToProps)(AccountRepFaucet)

export default AccountRepFaucetContainer

// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
// import Airbitz from 'modules/auth/components/airbitz-create/airbitz-create'
// import { loginWithAirbitz } from 'modules/auth/actions/login-with-airbitz'
// import selectABCUIContext from 'modules/auth/helpers/abc'

// const mapDispatchToProps = dispatch => ({
//   airbitzLoginLink: history => selectABCUIContext().openLoginWindow((result, airbitzAccount) => {
//     if (airbitzAccount) {
//       dispatch(loginWithAirbitz(airbitzAccount, history))
//     } else {
//       console.error('error registering in: ' + result)
//     }
//   }),
//   airbitzOnLoad: (history) => {
//     const abcUi = selectABCUIContext()
//     const { abcContext } = abcUi
//     const usernames = abcContext.listUsernames()
//     if (usernames.length > 0) {
//       abcUi.openLoginWindow((result, airbitzAccount) => {
//         if (airbitzAccount) {
//           dispatch(loginWithAirbitz(airbitzAccount, history))
//         } else {
//           console.error('error registering in: ' + result)
//         }
//       })
//     }
//   },
// })

// export default withRouter(connect(null, mapDispatchToProps)(Airbitz))

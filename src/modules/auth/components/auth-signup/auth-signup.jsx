import React from 'react'

export default function AuthSignup(p) {
  return <span>Signup</span>
}

// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import zxcvbn from 'zxcvbn'
// import Input from 'modules/common/components/input/input'
// import Spinner from 'modules/common/components/spinner'
//
// import makePath from 'modules/app/helpers/make-path'
// import { DEFAULT_VIEW } from 'modules/app/constants/views'
//
// import { REQUIRED_PASSWORD_STRENGTH } from 'modules/auth/constants/password-strength'
//
// export default class AuthSignup extends Component {
//   static propTypes = {
//     history: PropTypes.object.isRequired,
//     register: PropTypes.func.isRequired,
//     setupAndFundNewAccount: PropTypes.func.isRequired
//   };
//
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       password: '',
//       passwordConfirm: '',
//       currentScore: 0,
//       passwordSuggestions: [],
//       isStrongPass: false,
//       isGeneratingLoginID: false,
//       loginID: null,
//       authError: false,
//       errorMessage: null,
//       // These prevent a flash on component mount
//       // TODO -- refactor to utilize CSSTransitionGroup -- will simplify this significantly
//       isPasswordConfirmDisplayable: false,
//       isPasswordsSuggestionDisplayable: false,
//       isGeneratingLoginIDDisplayable: false,
//       isSignUpActionsDisplayable: false,
//       isAuthErrorDisplayable: false
//     }
//   }
//
//   componentWillUpdate(nextProps, nextState) {
//
//     // loginID
//     if (
//       nextState.password &&
//       nextState.isStrongPass &&
//       this.state.password !== this.state.passwordConfirm &&
//       nextState.password === nextState.passwordConfirm
//     ) {
//       this.setState({
//         isGeneratingLoginIDDisplayable: true,
//         isGeneratingLoginID: true
//       }, () => {
//         setTimeout(() => {
//           this.props.register(this.state.password, (err, loginID) => {
//             if (err) {
//               this.setState({
//                 authError: true,
//                 errorMessage: err.message,
//                 isAuthErrorDisplayable: true
//               })
//             } else {
//               this.username.value = loginID
//
//               this.setState({
//                 loginID,
//                 isGeneratingLoginID: false,
//                 isSignUpActionsDisplayable: true
//               })
//             }
//           })
//         }, 500)
//       })
//     } else if (
//       nextState.password !== nextState.passwordConfirm &&
//       this.state.loginID
//     ) { // if a login account exists, clear it
//       this.username.value = ''
//
//       this.setState({
//         loginID: null,
//         isGeneratingLoginID: false
//       })
//     }
//
//     // passwordConfirm
//     if (this.state.passwordConfirm && !nextState.isStrongPass) {
//       this.setState({ passwordConfirm: '' })
//     }
//   }
//
//   scorePassword = (password) => {
//     const scoreResult = zxcvbn(password)
//     const passwordSuggestions = scoreResult.feedback.suggestions
//     const currentScore = scoreResult.score
//
//     this.setState({
//       currentScore,
//       passwordSuggestions
//     })
//
//     if (passwordSuggestions.length && !this.state.isPasswordsSuggestionDisplayable) {
//       this.setState({ isPasswordsSuggestionDisplayable: true })
//     }
//
//     if (currentScore >= REQUIRED_PASSWORD_STRENGTH) {
//       this.setState({
//         isStrongPass: true,
//         isPasswordConfirmDisplayable: true
//       })
//     } else if (this.state.isStrongPass === true) {
//       this.setState({ isStrongPass: false })
//     }
//   }
//
//   render() {
//     const p = this.props
//     const s = this.state
//
//     const loginID = s.loginID || ''
//
//     return (
//       <form
//         className="auth-signup-form"
//         onSubmit={(e) => {
//           e.preventDefault()
//           e.persist()
//
//           p.setupAndFundNewAccount(s.password, loginID, (err) => {
//             if (err) {
//               this.setState({
//                 authError: true,
//                 errorMessage: err.message,
//                 isAuthErrorDisplayable: true
//               })
//             } else {
//               e.target.style.display = 'none'
//
//               p.history.push(makePath(DEFAULT_VIEW))
//             }
//           })
//         }}
//       >
//         <span className="soft-header">Sign up with a Login ID</span>
//         <input
//           name="username"
//           ref={(username) => { this.username = username }}
//           readOnly
//           tabIndex="-1"
//         />
//         <Input
//           autoFocus
//           canToggleVisibility
//           className={classNames('auth-signup-password', { 'input-error': s.authError })}
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={s.password}
//           onChange={(password) => {
//             this.setState({ password })
//
//             if (this.state.authError) {
//               this.setState({ authError: false })
//             }
//
//             this.scorePassword(password)
//           }}
//         />
//         <Input
//           className={classNames('auth-signup-password-confirm', {
//             'input-error': s.authError,
//             animateIn: s.isStrongPass,
//             animateOut: !s.isStrongPass && s.isPasswordConfirmDisplayable
//           })}
//           disabled={!s.isStrongPass}
//           shouldMatchValue
//           comparisonValue={s.password}
//           name="password-confirm"
//           type="password"
//           placeholder="Confirm Password"
//           value={s.passwordConfirm}
//           onChange={(passwordConfirm) => {
//             this.setState({ passwordConfirm })
//
//             if (this.state.authError) {
//               this.setState({ authError: false })
//             }
//           }}
//         />
//         <div
//           className={classNames('auth-error', {
//             animateIn: s.authError,
//             animateOut: !s.authError && s.isAuthErrorDisplayable
//           })}
//         >
//           <span>
//             {s.errorMessage}
//           </span>
//         </div>
//         <div
//           className={classNames('auth-signup-password-suggestions', {
//             animateIn: !s.isStrongPass && s.passwordSuggestions.length,
//             animateOut: !s.passwordSuggestions.length && s.isPasswordsSuggestionDisplayable
//           })}
//         >
//           <ul>
//             {s.passwordSuggestions.map((suggestion, i) => (
//               <li
//                 key={suggestion}
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div
//           className={classNames('auth-generating-login-id', {
//             animateInPartial: s.isGeneratingLoginID,
//             animateOutPartial: !s.isGeneratingLoginID && s.isGeneratingLoginIDDisplayable
//           })}
//         >
//           <span>Generating Login ID</span>
//           <Spinner />
//         </div>
//         <div
//           className={classNames('auth-signup-actions', {
//             animateInPartial: s.loginID,
//             animateOutPartial: !s.loginID && s.isSignUpActionsDisplayable
//           })}
//         >
//           <div className="login-id-messaging">
//             <span className="soft-header">Below is your Login ID</span>
//             <span className="important">SAVE THE LOGIN ID IN A SAFE PLACE</span>
//             <span className="important">This CANNOT be recovered if lost or stolen!</span>
//           </div>
//           <textarea
//             className="login-id"
//             disabled={!s.loginID}
//             value={loginID}
//             readOnly
//           />
//           <button
//             className="submit"
//             disabled={!s.loginID}
//             type="submit"
//           >
//             Sign Up
//           </button>
//         </div>
//       </form>
//     )
//   }
// }

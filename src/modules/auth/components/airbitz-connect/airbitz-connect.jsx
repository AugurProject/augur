// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import Helmet from 'react-helmet'

// import Styles from 'modules/auth/components/airbitz-connect/airbitz-connect.styles'

// export default class Airbitz extends Component {
//   static propTypes = {
//     history: PropTypes.object.isRequired,
//     airbitzLoginLink: PropTypes.func.isRequired,
//     airbitzOnLoad: PropTypes.func.isRequired,
//   }

//   componentWillMount() {
//     this.props.airbitzOnLoad(this.props.history)
//   }

//   render() {
//     const p = this.props

//     return (
//       <section className={Styles.Airbitz}>
//         <Helmet>
//           <title>Airbitz</title>
//         </Helmet>
//         <button
//           className={
//             classNames(
//               Styles.button,
//               Styles[`button--purple`],
//               Styles.Airbitz__button,
//             )
//           }
//           onClick={() => p.airbitzLoginLink(p.history)}
//         >
//           Connect Airbitz Account
//         </button>
//       </section>
//     )
//   }
// }

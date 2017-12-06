import React, { Component } from 'react'
// import { Connect, QRUtil } from 'uport-connect'

export default class UportCreate extends Component {
  // constructor() {
  //   super()
  //
  //   this.uPort = new Connect('AUGUR -- DEV', {
  //     uriHandler: this.uPortURIHandler
  //   })
  //
  //   // this.state = {
  //   //   requestURI: null
  //   // }
  //
  //   // this.uPortURIHandler = this.uPortURIHandler.bind(this)
  // }

  componentWillMount() {
    console.log('uport -- ', this.uPort)


  }

  // uPortURIHandler(uri) {
  //   const requestURI = QRUtil.getQRDataURL(uri)
  //   // this.setState({ requestURI })
  // }

  render() {
    return (
      <span>TEST</span>
    )
  }
}

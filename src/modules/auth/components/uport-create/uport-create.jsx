import React, { Component } from 'react'
import { Connect, QRUtil } from 'uport-connect'
import QRCode from 'qrcode.react'

export default class UportCreate extends Component {
  constructor() {
    super()

    this.uPort = new Connect('AUGUR -- DEV')

    this.state = {
      uri: ''
    }

    this.uPortURIHandler = this.uPortURIHandler.bind(this)
  }

  componentWillMount() {
    this.uPort.requestCredentials({}, this.uPortURIHandler).then(credentials => console.log('creds -- ', credentials))
  }

  uPortURIHandler(uri) {
    this.setState({ uri })
  }

  render() {
    const s = this.state

    return (
      <QRCode
        value={s.uri}
        size={400}
      />
    )
  }
}

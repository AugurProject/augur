import React, { Component } from 'react'

// { moduleName, loader, props }
export default options => (
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        Component: null,
      }

      this.loadAsyncComponent = this.loadAsyncComponent.bind(this)
    }

    componentWillMount() {
      this.loadAsyncComponent(options.loader, options.props)
    }

    loadAsyncComponent(loader) {
      loader()
        .then((Component) => {
          this.setState({ Component })
        })
        .catch(err => asyncModuleLoadError(options.moduleName, err))
    }

    render() {
      if (this.state.Component) return <this.state.Component {...this.props} {...options.props} />

      return null
    }
  }
)

function asyncModuleLoadError(moduleName, err) {
  console.error(`ERROR: Failed to load '${moduleName}' module -- `, err)
}

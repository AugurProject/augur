import React, { Component } from 'react';

// export default (loader, collection) => (
//   class AsyncComponent extends Component {
//     constructor(props) {
//       super(props);
//
//       this.Component = null;
//       this.state = { Component: AsyncComponent.Component };
//     }
//
//     componentWillMount() {
//       if (!this.state.Component) {
//         loader().then((Component) => {
//           AsyncComponent.Component = Component;
//
//           this.setState({ Component });
//         });
//       }
//     }
//
//     render() {
//       if (this.state.Component) {
//         return (
//           <this.state.Component { ...this.props } { ...collection } />
//         )
//       }
//
//       return null;
//     }
//   }
// );

export default class AsyncComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Component: null
    };

    this.loadAsyncComponent = this.loadAsyncComponent.bind(this);
  }

  componentWillMount(){
    this.loadAsyncComponent(this.props.component);
  }

  loadAsyncComponent(component) {
    import(/* webpackChunkName: [request] */ `${component}`)
      .then(module => this.setState({ Component: module.default }))
      .catch(err => asyncModuleLoadError(component, err));
  }

  render() {
    return this.state.Component;
  }
}

function asyncModuleLoadError(module, err) {
  console.error(`ERROR: Failed to load '${module}' module -- `, err);
}

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

// { moduleName, loader, props }
export default options => (
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        Component: null
      };

      this.loadAsyncComponent = this.loadAsyncComponent.bind(this);
    }

    componentWillMount() {
      this.loadAsyncComponent(options.loader, options.props);
    }

    loadAsyncComponent(loader, props) {
      // import(/* webpackChunkName: [request] */ `${component}`)
      //   .then(module => this.setState({ Component: module.default }))
      //   .catch(err => asyncModuleLoadError(component, err));

      loader()
        .then((Component) => {
          console.log(<Component />);

          this.setState({ Component });
        })
        .catch(err => asyncModuleLoadError(options.moduleName, err));
    }

    render() {
      if (this.state.Component) return <this.state.Component {...options.props} />;

      return null;
    }
  }
);

function asyncModuleLoadError(moduleName, err) {
  console.error(`ERROR: Failed to load '${moduleName}' module -- `, err);
}

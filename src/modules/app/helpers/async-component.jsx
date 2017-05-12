import React, { Component } from 'react';

export default loader => (
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        Component: null
      };
    }

    componentWillMount() {
      if (this.state.Component === null) {
        loader().then((Component) => {
          this.setState({ Component });
        });
      }
    }

    render() {
      const s = this.state;
      if (s.Component !== null) {
        return (
          <s.Component {...this.props} />
        );
      }

      return null;
    }
  }
);

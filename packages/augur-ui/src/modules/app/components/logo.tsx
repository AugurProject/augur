import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { AugurLoadingLogo } from "modules/common/components/icons";
import Styles from "modules/app/components/logo.styles";

interface LogoProps {
  isLoading: Boolean;
}

interface LogoState {
  loading: Boolean;
}

class LoadingLogo extends Component<LogoProps, LogoState> {
  propTypes = {
    isLoading: PropTypes.bool.isRequired
  };

  state: LogoState = {
    loading: this.props.isLoading
  }

  componentWillReceiveProps(newProps: LogoProps) {
    if (newProps.isLoading) {
      this.setState({
        loading: newProps.isLoading
      });
    }
  }

  animateEnd() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <div
        className={classNames(Styles.LoadingLogo, {
          [Styles.running]: loading,
          [Styles.paused]: !loading
        })}
        onAnimationEnd={() => this.animateEnd()}
      >
        {AugurLoadingLogo}
      </div>
    );
  }
}

const Logo = ({ isLoading }: LogoProps) => (
  <section className={Styles.Logo}>
    <LoadingLogo isLoading={isLoading} />
    <span>AUGUR</span>
  </section>
);

Logo.propTypes = {
  isLoading: PropTypes.bool
};

Logo.defaultProps = {
  isLoading: false
};

export default Logo;

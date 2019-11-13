import React, { Component } from "react";
import classNames from "classnames";
import { AugurLoadingLogo } from "modules/common/icons";
import Styles from "modules/app/components/logo.styles";

interface LogoProps {
  isLoading: Boolean;
}

interface LogoState {
  loading: Boolean;
}

class LoadingLogo extends Component<LogoProps, LogoState> {
  state: LogoState = {
    loading: this.props.isLoading
  }

  componentDidUpdate({ isLoading: loading }: LogoProps) {
    if (loading) {
      this.setState({
        loading
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

Logo.defaultProps = {
  isLoading: false
};

export default Logo;

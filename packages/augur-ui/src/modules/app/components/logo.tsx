import React, { Component } from 'react';
import classNames from 'classnames';
import {
  AugurLoadingLogo,
  v2AugurLogo,
  AugurTextLogo,
} from 'modules/common/icons';
import Styles from 'modules/app/components/logo.styles.less';

interface LogoProps {
  isLoading: Boolean;
}

interface LogoState {
  loading: Boolean;
}

export const NewLogo = () => (
  <section className={Styles.v2Logo}>
    {AugurTextLogo}
  </section>
);

class LoadingLogo extends Component<LogoProps, LogoState> {
  state: LogoState = {
    loading: this.props.isLoading,
  };

  componentDidUpdate({ isLoading: loading }: LogoProps) {
    if (loading) {
      this.setState({
        loading,
      });
    }
  }

  animateEnd() {
    this.setState({
      loading: false,
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <div
        className={classNames(Styles.LoadingLogo, {
          [Styles.running]: loading,
          [Styles.paused]: !loading,
        })}
        onAnimationEnd={() => this.animateEnd()}
      >
        {AugurLoadingLogo}
      </div>
    );
  }
}

export const Logo = ({ isLoading }: LogoProps) => (
  <section className={Styles.Logo}>
    <LoadingLogo isLoading={isLoading} />
    <span>AUGUR</span>
  </section>
);

Logo.defaultProps = {
  isLoading: false,
};

// export Logo;

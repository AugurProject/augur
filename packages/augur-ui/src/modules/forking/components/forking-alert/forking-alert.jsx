import React, { Component } from "react";
import PropTypes from "prop-types";
import ForkingContent from "modules/forking/components/forking-content/forking-content";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import Styles from "modules/forking/components/forking-alert/forking-alert.styles";

class ForkingAlert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };

    this.expand = this.expand.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (nextProps.location !== location) {
      this.setState({
        isExpanded: false
      });
    }
  }

  expand() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  render() {
    const {
      currentTime,
      doesUserHaveRep,
      marginLeft,
      universe,
      finalizeMarket
    } = this.props;
    const {
      forkEndTime,
      forkingMarket,
      isForkingMarketFinalized,
      forkReputationGoal
    } = universe;
    const forkWindowActive = Number(forkEndTime) > currentTime;

    return (
      <section className={Styles.ForkingAlert__Container}>
        <header className={Styles.ForkingAlert} style={{ marginLeft }}>
          <section>
            <img
              className={Styles.ForkingAlert__AlertIcon}
              alt="Alert"
              src="../../assets/images/alert-icon.svg"
            />
            {forkWindowActive && (
              <div className={Styles.ForkingAlert__message}>
                A Fork has been initiated. This universe is now locked.
              </div>
            )}
            {!forkWindowActive && (
              <div className={Styles.ForkingAlert__message}>
                A Fork has occurred. This universe is now locked.
              </div>
            )}
            <div className={Styles.ForkingAlert__addition_details}>
              <button
                className={Styles.ForkingAlert__addition_details_button}
                onClick={this.expand}
              >
                Additional details
                <span className={Styles.ForkingAlert__arrow}>
                  <ChevronFlip
                    pointDown={!this.state.isExpanded}
                    stroke="white"
                  />
                </span>
              </button>
            </div>
          </section>
        </header>
        {this.state.isExpanded && (
          <ForkingContent
            forkingMarket={forkingMarket}
            forkEndTime={forkEndTime}
            currentTime={currentTime}
            expanded
            doesUserHaveRep={doesUserHaveRep}
            forkReputationGoal={forkReputationGoal}
            finalizeMarket={finalizeMarket}
            isForkingMarketFinalized={isForkingMarketFinalized}
            marginLeft={marginLeft}
          />
        )}
      </section>
    );
  }
}

ForkingAlert.propTypes = {
  location: PropTypes.object.isRequired,
  universe: PropTypes.object.isRequired,
  currentTime: PropTypes.number.isRequired,
  doesUserHaveRep: PropTypes.bool.isRequired,
  marginLeft: PropTypes.number,
  finalizeMarket: PropTypes.func.isRequired
};

ForkingAlert.defaultProps = {
  marginLeft: 0
};

export default ForkingAlert;

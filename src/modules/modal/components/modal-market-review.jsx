import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/common/common.styles";

import ModalActions from "modules/modal/components/common/modal-actions";
import Checkbox from "src/modules/common/components/checkbox/checkbox";

export default class ModalMarketReview extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    markModalAsSeen: PropTypes.func.isRequired,
    unmarkModalAsSeen: PropTypes.func.isRequired,
    handleAction: PropTypes.func.isRequired,
    market: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      didCheck: false,
      readMore: false
    };

    this.checkCheckbox = this.checkCheckbox.bind(this);
  }

  checkCheckbox() {
    this.setState({ didCheck: !this.state.didCheck }, () => {
      if (this.state.didCheck) {
        this.props.markModalAsSeen();
      } else {
        this.props.unmarkModalAsSeen();
      }
    });
  }

  render() {
    const { closeModal, handleAction, market } = this.props;
    const { didCheck } = this.state;

    const showReadMore = market.details && market.details.length > 126;
    const readMore = showReadMore && (
      <div>
        {`${market.details.substr(0, 126)}...`}{" "}
        <button
          onClick={() => this.setState({ readMore: true })}
          className={Styles.ModalMarketReview__ReadMore}
        >
          Read more
        </button>
      </div>
    );

    return (
      <section className={Styles.ModalMarketReview}>
        <h1>Review market details</h1>
        <div className={Styles.ModalMarketReview__Header}>
          <p>
            Review the markets details to confirm that there are{" "}
            <span>no conflicts</span>, in particular between the Markets
            Question, Additional Details and Reporting Start Time.
          </p>

          <p>
            If the reporting start time doesn’t match up to the title or
            description, the market might resolve as invalid.
          </p>
        </div>
        <div className={Styles.ModalMarketReview__TextBox}>
          <div>
            <p>Market Question</p>
            {market.description}
          </div>

          {market.details && (
            <div>
              <p>Additional details</p>
              {showReadMore && !this.state.readMore && readMore}
              {(!showReadMore || this.state.readMore) && (
                <div>{market.details}</div>
              )}
            </div>
          )}

          {market.endTime && (
            <div>
              <p>Reporting starts</p>
              <div>{market.endTime.formattedUtc}</div>
              <div>{market.endTime.formattedTimezone}</div>
            </div>
          )}

          <div>
            <p>Resolution source</p>
            {market.resolutionSource
              ? market.resolutionSource
              : "General knowledge"}
          </div>
        </div>

        <div
          className={Styles.ModalMarketReview__checkbox}
          role="button"
          tabIndex="0"
          onClick={e => {
            e.preventDefault();
            this.checkCheckbox();
          }}
        >
          <label htmlFor="marketReview">
            <Checkbox
              id="marketReview"
              type="checkbox"
              value={didCheck}
              isChecked={didCheck}
              onClick={e => {
                e.preventDefault();
                this.checkCheckbox();
              }}
            />
            Don’t show this message on any more markets
          </label>
        </div>

        <div className={Styles.ModalMarketReview__ActionButtons}>
          <ModalActions
            buttons={[
              {
                label: "Cancel",
                type: "gray",
                action: closeModal
              }
            ]}
          />
          <ModalActions
            buttons={[
              {
                label: "Confirm",
                type: "purple",
                action: handleAction
              }
            ]}
          />
        </div>
      </section>
    );
  }
}

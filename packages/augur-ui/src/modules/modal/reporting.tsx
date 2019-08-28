import React, { Component } from "react";
import classNames from "classnames";

import { MarketData } from "modules/types";
import { Title } from "modules/modal/common";
import { MarketTypeLabel } from "modules/common/labels";
import Styles from "modules/modal/modal.styles.less";

interface ModalReportingProps {
  closeModal: Function;
  market: MarketData;
}

interface ModalReportingState {
  checked: string;
}

export default class ModalReporting extends Component<ModalReportingProps, ModalReportingState> {
  state: ModalReportingState = {
    checked: null,
  };

  render() {
    const { closeAction, title, market } = this.props;
    const s = this.state;
    const {
      description,
      marketType
    } = market;

    return (
      <div className={Styles.ModalReporting}>
        <Title title={title} closeAction={closeAction} bright />
        <main>
          <MarketTypeLabel marketType={marketType} />
          <span>{description}</span>
        </main>
      </div>
    );
  }
}

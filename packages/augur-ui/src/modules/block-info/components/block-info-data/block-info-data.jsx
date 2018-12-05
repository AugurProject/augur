import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import toggleHeight from "utils/toggle-height/toggle-height";
import { createBigNumber } from "utils/create-big-number";
import { formatNumber, formatPercent } from "utils/format-number";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";

import Styles from "modules/block-info/components/block-info-data/block-info-data.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class BlockInfoData extends Component {
  static propTypes = {
    highestBlock: PropTypes.number,
    lastProcessedBlock: PropTypes.number,
    isLogged: PropTypes.bool.isRequired
  };

  static defaultProps = {
    highestBlock: 0,
    lastProcessedBlock: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.setDropdownOpen = this.setDropdownOpen.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  setDropdownOpen(value) {
    this.setState({ dropdownOpen: value }, () => {
      toggleHeight(this.blockInfoDropdown, true, () => {});
    });
  }

  toggleDropdown(cb) {
    toggleHeight(this.blockInfoDropdown, this.state.dropdownOpen, () => {
      this.setState({ dropdownOpen: !this.state.dropdownOpen });

      if (cb && typeof cb === "function") cb();
    });
  }

  handleWindowOnClick(event) {
    if (
      this.state.dropdownOpen &&
      this.blockInfoData &&
      !this.blockInfoData.contains(event.target)
    ) {
      this.toggleDropdown();
    }
  }

  render() {
    const { highestBlock, lastProcessedBlock, isLogged } = this.props;
    const s = this.state;

    const highestBlockBn = createBigNumber(highestBlock);
    const lastProcessedBlockBn = createBigNumber(lastProcessedBlock);

    const blocksBehind = formatNumber(
      highestBlockBn.minus(lastProcessedBlockBn).toString()
    ).roundedValue;
    const percent = formatPercent(
      lastProcessedBlockBn
        .dividedBy(highestBlockBn)
        .times(createBigNumber(100))
        .toString(),
      { decimals: 4, decimalsRounded: 4 }
    ).formattedValue;

    return (
      <div
        className={classNames(Styles.BlockInfoData, {
          [Styles.BlockInfoData__selected]: s.dropdownOpen
        })}
        ref={blockInfoData => {
          this.blockInfoData = blockInfoData;
        }}
      >
        <div
          className={Styles.BlockInfoData__container}
          role="button"
          tabIndex="-1"
          onClick={this.toggleDropdown}
        >
          <div className={Styles.BlockInfoData__title}>Blocks Behind</div>
          <div className={Styles.BlockInfoData__info}>
            {blocksBehind}
            <span className={Styles.BlockInfoData__blocksBehind}>
              <ChevronFlip
                filledInIcon
                pointDown={s.dropdownOpen}
                stroke="#fff"
                quick
              />
            </span>
          </div>
        </div>
        <div
          ref={blockInfoDropdown => {
            this.blockInfoDropdown = blockInfoDropdown;
          }}
          className={classNames(
            Styles.BlockInfoData__connectDropdown,
            ([Styles.BlockInfoData__connectDropdownLogged]: isLogged),
            ToggleHeightStyles["toggle-height-target"],
            ToggleHeightStyles["toggle-height-target-quick"]
          )}
        >
          <div className={Styles.BlockInfoData__dropdownContainer}>
            <div className={Styles.BlockInfoData__dropdownTitle}>
              Processing Market Data
            </div>
            <div className={Styles.BlockInfoData__percent}>{percent}%</div>
            <div className={Styles.BlockInfoData__dropdownTitle}>
              Blocks Processed
            </div>
            <div className={Styles.BlockInfoData__processed}>
              {formatNumber(lastProcessedBlockBn.toString()).formatted}
              <span className={Styles.BlockInfoData__bottom}>
                <span className={Styles.BlockInfoData__slash}>/</span>
                {formatNumber(highestBlockBn.toString()).formatted}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

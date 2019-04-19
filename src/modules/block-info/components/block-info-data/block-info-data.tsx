import React, { Component, SyntheticEvent } from "react";
import classNames from "classnames";

import toggleHeight from "utils/toggle-height/toggle-height";
import { formatNumber } from "utils/format-number";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";

import Styles from "modules/block-info/components/block-info-data/block-info-data.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export interface SyncInfo {
  blocksBehind: number;
  highestBlockBn: number;
  lastProcessedBlockBn: number;
  percent: number;
}

export interface BlockInfoDataProps {
  syncInfo: SyncInfo;
  isLogged: boolean;
}

export interface BlockInfoDataState {
  dropdownOpen: boolean;
}

declare var window: any;

class BlockInfoData extends Component<BlockInfoDataProps, BlockInfoDataState> {
  constructor(props: BlockInfoDataProps) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  toggleDropdown() {
    toggleHeight(this.blockInfoDropdown, this.state.dropdownOpen, 0, () => {
      this.setState({ dropdownOpen: !this.state.dropdownOpen });
    });
  }

  handleWindowOnClick(event: SyntheticEvent) {
    if (
      this.state.dropdownOpen &&
      this.blockInfoData &&
      !this.blockInfoData.contains(event.target)
    ) {
      this.toggleDropdown();
    }
  }

  render() {
    const { syncInfo, isLogged } = this.props;

    if (!syncInfo) {
      return null;
    }
    const s = this.state;
    const {
      blocksBehind,
      highestBlockBn,
      lastProcessedBlockBn,
      percent
    } = syncInfo;

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
          tabIndex={0}
          onClick={() => this.toggleDropdown()}
        >
          <div className={Styles.BlockInfoData__title}>Blocks Behind</div>
          <div className={Styles.BlockInfoData__info}>
            {blocksBehind}
            <span className={Styles.BlockInfoData__blocksBehind}>
              <ChevronFlip
                pointDown={s.dropdownOpen}
                stroke="#fff"
                filledInIcon
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
            ToggleHeightStyles["toggle-height-target"],
            ToggleHeightStyles["toggle-height-target-quick"],
            {
              [Styles.BlockInfoData__connectDropdownLogged]: isLogged
            }
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

export default BlockInfoData;

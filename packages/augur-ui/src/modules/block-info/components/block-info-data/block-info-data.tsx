import React, { Component, SyntheticEvent } from "react";
import classNames from "classnames";

import { formatNumber } from "utils/format-number";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";

import Styles from "modules/block-info/components/block-info-data/block-info-data.styles";
import ToggleHeightStyles from "utils/toggle-height.styles";

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

  handleWindowOnClick(event: SyntheticEvent) {
    const { dropdownOpen } = this.state;
    if (
      dropdownOpen &&
      this.blockInfoData &&
      !this.blockInfoData.contains(event.target)
    ) {
      this.setState({ dropdownOpen: !dropdownOpen });
    }
  }

  render() {
    const { syncInfo, isLogged } = this.props;
    const { dropdownOpen } = this.state;
    if (!syncInfo) {
      return null;
    }
    const {
      blocksBehind,
      highestBlockBn,
      lastProcessedBlockBn,
      percent
    } = syncInfo;

    return (
      <div
        className={classNames(Styles.BlockInfoData, {
          [Styles.selected]: dropdownOpen
        })}
        ref={blockInfoData => {
          this.blockInfoData = blockInfoData;
        }}
      >
        <div
          className={Styles.container}
          role="button"
          tabIndex={0}
          onClick={() => this.setState({ dropdownOpen: !dropdownOpen })}
        >
          <div className={Styles.title}>Blocks Behind</div>
          <div className={Styles.info}>
            {blocksBehind}
            <span className={Styles.blocksBehind}>
              <ChevronFlip
                pointDown={dropdownOpen}
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
            Styles.connectDropdown,
            ToggleHeightStyles.target,
            ToggleHeightStyles.quick,
            {
              [Styles.connectDropdownLogged]: isLogged,
              [ToggleHeightStyles.open]: dropdownOpen
            }
          )}
        >
          <div className={Styles.dropdownContainer}>
            <div className={Styles.dropdownTitle}>Processing Market Data</div>
            <div className={Styles.percent}>{percent}%</div>
            <div className={Styles.dropdownTitle}>Blocks Processed</div>
            <div className={Styles.processed}>
              {formatNumber(lastProcessedBlockBn.toString()).formatted}
              <span className={Styles.bottom}>
                <span className={Styles.slash}>/</span>
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

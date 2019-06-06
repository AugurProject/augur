import React, { Component, SyntheticEvent } from "react";
import classNames from "classnames";

import { formatNumber } from "utils/format-number";
import ChevronFlip from "modules/common/chevron-flip";

import Styles from "modules/block-info/block-info-data.styles";
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
        <button
          tabIndex={0}
          onClick={() => this.setState({ dropdownOpen: !dropdownOpen })}
        >
          <h3>Blocks Behind</h3>
          <div>
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
        </button>
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
          <div>
            <h3>Processing Market Data</h3>
            <div className={Styles.percent}>{percent}%</div>
            <h3>Blocks Processed</h3>
            <div>
              {formatNumber(lastProcessedBlockBn.toString()).formatted}
              <span className={Styles.bottom}>
                <span>/</span>
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

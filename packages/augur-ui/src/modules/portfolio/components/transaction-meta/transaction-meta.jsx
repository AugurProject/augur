import React from "react";
import PropTypes from "prop-types";
import Styles from "modules/portfolio/components/transaction-meta/transaction-meta.styles";
import EtherscanLink from "modules/common/containers/etherscan-link";

import { convertUnixToFormattedDate } from "utils/format-date";

const TransactionMeta = ({ meta }) => {
  if (typeof meta.timestamp === "number") {
    meta.timestamp = convertUnixToFormattedDate(meta.timestamp).full;
  }
  if (meta.status === "Open" || meta.status === "Canceled") {
    return (
      <div className={Styles.TransactionMetaContainer}>
        <ul className={Styles.TransactionMeta}>
          {Object.keys(meta)
            .filter(
              metaTitle =>
                metaTitle !== "txhash" &&
                metaTitle !== "timestamp" &&
                metaTitle !== "canceledTransactionHash" &&
                metaTitle !== "canceledTime"
            )
            .map(metaTitle => (
              <li key={metaTitle}>
                <span>{metaTitle}</span>
                <span>
                  <span>{meta[metaTitle]}</span>
                </span>
              </li>
            ))}
        </ul>
        <div className={Styles.TransactionMetaSubsectionContainer}>
          <div className={Styles.TransactionMetaSubsectionHeader}>OPENED</div>
          <div className={Styles.TransactionMetaSubsection}>
            <ul className={Styles.TransactionMeta}>
              <li>
                <span>Txhash</span>
                <EtherscanLink
                  txhash={meta.txhash}
                  label={meta.txhash}
                  showNonLink
                />
              </li>
              <li>
                <span>Timestamp</span>
                <span>
                  <span>{meta.timestamp}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {meta.canceledTransactionHash && (
          <div className={Styles.TransactionMetaSubsectionContainer}>
            <div className={Styles.TransactionMetaSubsectionHeader}>
              CANCELED
            </div>
            <div className={Styles.TransactionMetaSubsection}>
              <ul className={Styles.TransactionMeta}>
                <li>
                  <span>Txhash</span>
                  <EtherscanLink
                    txhash={meta.canceledTransactionHash}
                    label={meta.canceledTransactionHash}
                    showNonLink
                  />
                </li>
                <li>
                  <span>Timestamp</span>
                  <span>
                    <span>{meta.canceledTime}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={Styles.TransactionMetaContainer}>
      <ul className={Styles.TransactionMeta}>
        {Object.keys(meta)
          .filter(metaTitle => metaTitle === "txhash")
          .map(metaTitle => (
            <li key={metaTitle}>
              <span>{metaTitle}</span>
              <EtherscanLink
                txhash={meta[metaTitle]}
                label={meta[metaTitle]}
                showNonLink
              />
            </li>
          ))}
        {Object.keys(meta)
          .filter(metaTitle => metaTitle !== "txhash")
          .map(metaTitle => (
            <li key={metaTitle}>
              <span>{metaTitle}</span>
              <span>
                <span>{meta[metaTitle]}</span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

TransactionMeta.propTypes = {
  meta: PropTypes.object.isRequired
};

export default TransactionMeta;

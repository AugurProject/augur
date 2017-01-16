import React, { PropTypes } from 'react';
import Link from 'modules/link/components/link';

const LoginMessagePage = p => (
  <section id="login_message_view" >
    <div className="page-content">
      <h1>{`Welcome to the Augur beta test!`}</h1>
      <p>{`This is a beta test in advance of Augur's live release. There are bugs. There are features being
        added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in the next few
        months. Your thoughtful feedback now is essential. Please use the feedback button at the bottom left of
        every page to submit your feedback, or feel free to send an email to `}
        <a
          className="link"
          href="mailto:hugs@augur.net?subject=Beta Testing feedback"
        >
          {'hugs@augur.net'}
        </a>
        {`. From your submissions, the development team will coordinate fixes and new features. Changes and fixes will be
        displayed when you log in again.`}
      </p>
      <h2>Important information:</h2>
      <ol>
        <li>
          Because Augur is a <b>completely decentralized</b> system, if you lose your login credentials it
          is impossible to recover them. Please <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/" target="_blank" rel="noopener noreferrer">take
          appropriate measures</a> to protect the safety of your password, and create a way to
          recover your credentials if you forget them.
        </li>
        <li>
          Do not send real Ether (ETH) to your Augur account while we are testing! Each account will be given
          10,000 testnet ETH tokens for beta testing. Please note that testnet ETH has no value except for testing:
          it is merely an on-contract IOU (a token) for testnet Ether.
        </li>
        <li>
          {`Reputation (REP) is a unique and important part of the Augur trading platform. If you own REP tokens, you must visit
          the site periodically to fulfill your reporting obligations. During beta testing, each new account will
          receive 47 testnet REP (they have no value except for testing). Each reporting cycle will last 2 days. Every
          two-day cycle will consist of a commit phase, a reveal phase, and a challenge phase. Because the test
          cycle is dramatically compressed (the main net cycle will be 60 days long) it is recommended that
          users visit the site at least every 2 days to maintain your REP and simulate “real money” trading,
          resolution, and reporting conditions. Learn `}
          <a
            className="link"
            href="https://www.youtube.com/watch?v=sCms-snzHk4"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`how Augur's Reputation tokens work`}
          </a>.
        </li>
        <li>
          {`A note on price/time priority on the blockchain.  The site is only as fast as Ethereum blocks are mined.  Augur's matching engine sorts order books by price, then by block number, then by transaction index. Within a single block, transactions are ordered by the miner who mines the block.  When constructing a block, miners typically order transactions first by gasprice (highest to lowest), and then by the order received (oldest to newest).  So, Augur's "price/blocknumber/transaction index priority" ordering is generally equivalent to price/time priority, if there are differing gasprices within the block, the transaction index is not guaranteed to be time-ordered.  (Presently, Augur does not attempt to adjust gasprices in response to other pending transactions, although, if desired, gasprice can be adjusted manually using the API, by changing the "gasPrice" field attached to every sendTransaction payload.)`}
        </li>
      </ol>
      <h2>Technical updates:</h2>
      <h3>January 16, 2017</h3>
      <ol>
        <li>
          Completed ethereumjs-connect refactoring.
        </li>
        <li>
          Replaced the ethereumjs-connect semi-functional integration tests with unit tests, resulting in significantly increased test coverage (from 68% to 98%).
        </li>
        <li>
          Updated augur.js connection code for compatibility with ethereumjs-connect 2.0.
        </li>
        <li>
          The augur-contracts module now attaches raw API data to its exported object.
        </li>
      </ol>
      <h3>January 15, 2017</h3>
      <ol>
        <li>
          Started ethereumjs-connect refactoring.  Eliminated ethereumjs-connect dependence on the augur-contracts module.
        </li>
      </ol>
      <h3>January 14, 2017</h3>
      <ol>
        <li>
          Refactored sync-blockchain and separated sync methods from the update-blockchain action.
        </li>
        <li>
          Moved update-branch and sync-branch actions to the branch module.
        </li>
        <li>
          Restructured sync-branch tests: assertions, selectors, and state are now specified inside each test case.
        </li>
      </ol>
      <h3>January 13, 2017</h3>
      <ol>
        <li>
          Fixed a trade ID formatting bug that was causing some trades to show up twice on the transactions page.
        </li>
        <li>
          All contracts have been reuploaded on Ropsten (network 3) as well as our private testing chain (network 9000).  Transaction history is now &quot;portable&quot;: it will still be viewable even if you login on a different browser or computer!
        </li>
        <li>
          The upgraded transactions subsystem is now merged into the master branch!
        </li>
        <li>
          The bytes-to-utf16 conversion function in augur-abi now supports numeric inputs (BigNumber or JS numbers).
        </li>
        <li>
          Added a parity check to bytes_to_utf16 to fix a bytearray conversion error from augur-abi.
        </li>
        <li>
          Simplified loginWithMasterKey method in the augur.js accounts submodule, and removed placeholder (constant) salt/password/IV values.
        </li>
      </ol>
      <h3>January 12, 2017</h3>
      <ol>
        <li>
          Indentation is now uniform (2 spaces) across the following repositories in the AugurProject Github group: augur, augur.js, augur-abi, augur-contracts, and ethrpc.
        </li>
        <li>
          Updated the default network ID from 2 to 3 across middleware repositories.
        </li>
        <li>
          The &quot;price&quot; field is now used as a fallback for &quot;fullPrecisionPrice&quot; for scalar price adjustments when the latter field is not present.
        </li>
        <li>
          Fixed messaging for maker of order taken by short sell transaction.
        </li>
        <li>
          Saved log.shares in transaction.data.shares for payout transactions.
        </li>
        <li>
          Used tradeCommitment for relayed short_sell order lookup.
        </li>
        <li>
          Removed memoization from selectWinningPositions.
        </li>
        <li>
          The addOrder function now works properly when the market order book is initially empty.
        </li>
        <li>
          Added an initial existence check to sent* logs-to-transactions conversions.
        </li>
        <li>
          Fixed an old reference to the &quot;shares&quot; property of a trade (should be &quot;amount&quot;) in the price history totals calculation.
        </li>
      </ol>
      <h3>January 11, 2017</h3>
      <ol>
        <li>
          Changed the getOutcome and getUncaughtOutcome returns types in augur-contracts static API data to &quot;number&quot;.
        </li>
        <li>
          Added unfixReport conversion step to getMarket(s)Info callbacks in augur.js.
        </li>
        <li>
          Reporter assets are now updated prior to reporter-only synchronization with the blockchain state.
        </li>
        <li>
          Fixed penalizationCatchup NaN error.
        </li>
        <li>
          Split two oversized files in the transactions module (register-transaction-relay and convert-logs-to-transactions) into 3 smaller files each.
        </li>
        <li>
          All unit tests in the front-end are now compliant with the transaction relay (i.e., the new transactions subsystem).
        </li>
      </ol>
      {p.marketsLink &&
      <Link className="lets-do-this-button" {...p.marketsLink} >{`Let's do this!`}</Link>
      }
    </div>
  </section>
);

LoginMessagePage.propTypes = {
  marketsLink: PropTypes.object // TODO
};

export default LoginMessagePage;

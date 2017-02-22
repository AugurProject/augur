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
      <h3>February 21, 2017</h3>
      <ol>
        <li>
          The formatTag function in augur.js now trims whitespace from tags before converting to int256.
        </li>
        <li>
          Fixed checkbox component check icon.
        </li>
        <li>
          Fixed thumbs-down icon on transactions page.
        </li>
        <li>
          Removed updateTopicPopularity action from marketCreated listener callback.
        </li>
        <li>
          Fixed market link in create market transaction display.
        </li>
        <li>
          Google Translate is now integrated with the front-end.
        </li>
        <li>
          Topics and tags are now displayed as-is in the front-end (no trimming or forced case changes).
        </li>
        <li>
          Market creation now separates &quot;topic&quot; (first tag; required) and &quot;keywords&quot; (other tags).
        </li>
      </ol>
      <h3>February 20, 2017</h3>
      <ol>
        <li>
          The formatTag function in augur.js now trims whitespace from tags before converting to int256.
        </li>
        <li>
          The loadEventsWithSubmittedReport action has been entirely removed, as the data loaded was duplicated by loadReportingHistory.  The transaction constructors invoked by loadReportingHistory now populate the eventsWithSubmittedReport data store.
        </li>
        <li>
          Icofonts are now available for use in the front-end, in addition to the font-awesome icons.
        </li>
        <li>
          Fixed topics page redirect.
        </li>
        <li>
          Multi-case topic strings are now handled correctly.
        </li>
        <li>
          &quot;Hero&quot; topics now have the same font size as other topics on mobile.
        </li>
      </ol>
      <h3>February 19, 2017</h3>
      <ol>
        <li>
          Fixed order book generation in canned-markets script.
        </li>
        <li>
          Initial refactoring of ethrpc to add proper unit tests (with TestRPC) and robust websocket / IPC socket reconnection.
        </li>
        <li>
          Added websocket support to TestRPC.
        </li>
      </ol>
      <h3>February 18, 2017</h3>
      <ol>
        <li>
          The automatic order book generation function &quot;generateOrderBook&quot; in augur.js now works correctly.
        </li>
        <li>
          Edited the topics and keywords for &quot;canned markets&quot; so they are reasonably good examples.
        </li>
        <li>
          Added more icon-topic associations to the front-end.
        </li>
      </ol>
      <h3>February 17, 2017</h3>
      <ol>
        <li>
          The default &quot;landing page&quot; for the Augur app is now the Topics page!  Instead of displaying all markets, the user is now greeted with a list of topics (such as Politics, Science, Sports, etc.) which are sorted by popularity.  Clicking on a topic brings up all markets with that topic.  (The user can still browse all markets simply by clicking on &quot;Markets&quot; in the navbar.)
        </li>
        <li>
          Report commit locks are now indexed by event ID.
        </li>
        <li>
          Market volume is now subtracted from topic popularity when the market closes.
        </li>
      </ol>
      <h3>February 16, 2017</h3>
      <ol>
        <li>
          Added report-commit-lock to avoid double report submission.
        </li>
        <li>
          Fixed market-without-description error during new market creation.
        </li>
        <li>
          Updated createEvent, createMarket, createSingleEventMarket labels to match augur-core, and relabeled branchId to branchID in getMarket(s)Info object.
        </li>
        <li>
          Markets no longer have a description separate from their underlying event description.
        </li>
        <li>
          Updated &quot;unfixReport&quot; to &quot;unfixRawReport&quot; in several places in the UI to match augur.js.
        </li>
        <li>
          The loadMarketsInfo/loadAccountTrades loop post-claimMarketsProceeds now works correctly.
        </li>
        <li>
          Reported outcome is now calculated correctly for scalar/categorical events for both log-lookups and &quot;big getter&quot; lookups.
        </li>
        <li>
          Split unfixReports into unfixRawReports, unfixReports, isIndeterminateReport, and isScalarSpecialValueReport.
        </li>
        <li>
          Fixed register block number lookup in augur.js.
        </li>
      </ol>
      {p.topicsLink &&
        <Link className="lets-do-this-button" {...p.topicsLink} >{`Let's do this!`}</Link>
      }
    </div>
  </section>
);

LoginMessagePage.propTypes = {
  topicsLink: PropTypes.object // TODO
};

export default LoginMessagePage;

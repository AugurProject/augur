import { formatEther, formatPercent, formatRep } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { abi } from '../../../services/augurjs';
import { TWO } from '../../trade/constants/numbers';
import store from '../../../store';
import { selectMarketLink } from '../../link/selectors/links';

export default function () {
  const { eventsWithAccountReport } = store.getState();

  if (!eventsWithAccountReport) {
    return [];
  }

  const reports = Object.keys(eventsWithAccountReport)
    .filter(eventID => !!eventsWithAccountReport[eventID].marketID)
    .map((eventID) => {
      const expirationDate = eventsWithAccountReport[eventID].expirationDate || null;
      const isFinal = eventsWithAccountReport[eventID].isFinal || null;
      const marketID = eventsWithAccountReport[eventID].marketID || null;
      const description = eventsWithAccountReport[eventID].description || null;
      const marketLink = (marketID && description && selectMarketLink({ id: marketID, description }, store.dispatch)) || null;
      const outcome = eventsWithAccountReport[eventID].marketOutcome || null;
      const outcomePercentage = (eventsWithAccountReport[eventID].proportionCorrect && formatPercent(abi.bignum(eventsWithAccountReport[eventID].proportionCorrect).times(100))) || null;
      const reported = eventsWithAccountReport[eventID].accountReport || null;
      const isReportEqual = (outcome != null && reported != null && outcome === reported) || null; // Can be done here
      const feesEarned = calculateFeesEarned(eventsWithAccountReport[eventID]);
      const repEarned = (eventsWithAccountReport[eventID].repEarned && formatRep(eventsWithAccountReport[eventID].repEarned)) || null;
      const endDate = (expirationDate && formatDate(expirationDate)) || null;
      const isChallenged = eventsWithAccountReport[eventID].isChallenged || null;
      const isChallengeable = isFinal != null && isChallenged != null && !isFinal && !isChallenged;
      const period = eventsWithAccountReport[eventID].period || null;
      const reportHash = eventsWithAccountReport[eventID].reportHash || null;
      const isCommitted = eventsWithAccountReport[eventID].isCommitted;
      const isRevealed = eventsWithAccountReport[eventID].isRevealed;
      const isUnethical = eventsWithAccountReport[eventID].isUnethical;

      return {
        eventID,
        marketID,
        marketLink,
        description,
        outcome,
        outcomePercentage,
        reported,
        isReportEqual,
        feesEarned,
        repEarned,
        endDate,
        isChallenged,
        isChallengeable,
        period,
        reportHash,
        isCommitted,
        isRevealed,
        isUnethical
      };
    })
    .sort((a, b) => {
      if (a.period && b.period) {
        return b.period - a.period;
      }
      return 1;
    });

  return reports;
}

export const calculateFeesEarned = (event) => {
  if (!event.marketFees || !event.repBalance || !event.eventWeight) return null;
  return formatEther(
    abi.bignum(event.marketFees)
      .times(abi.bignum(event.repBalance))
      .dividedBy(TWO)
      .dividedBy(abi.bignum(event.eventWeight)),
    { denomination: ' ETH' }
  );
};

export default function canClaimProceeds(
  finalizationTime: number,
  outstandingReturns: number
): boolean {
  if (finalizationTime && outstandingReturns) {
    return true;
  }
  return false;
}

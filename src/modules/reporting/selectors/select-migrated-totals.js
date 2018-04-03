import { createBigNumber } from 'utils/create-big-number'
import { formatAttoRep } from 'utils/format-number'

export default function (reportableOutcomes, forkMigrationTotals) {
  const invalidMarketId = '0.5'
  const topOutcomes = 8

  if (forkMigrationTotals == null || Object.keys(forkMigrationTotals).length === 0) {
    return reportableOutcomes.reduce((totals, outcome) => {
      const result = [...totals, {
        id: outcome.id,
        rep: '0',
        name: outcome.name,
        winner: false,
        isInvalid: outcome.id === invalidMarketId,
      }]
      return result
    }, [])
  }

  const processTotals = Object.keys(forkMigrationTotals).reduce((totals, curOutcomeId) => {
    const forkMigrationOutcomeData = forkMigrationTotals[curOutcomeId]
    const { isInvalid } = forkMigrationOutcomeData
    const outcome = reportableOutcomes.find(outcome => outcome.id === curOutcomeId)
    const value = {
      id: curOutcomeId,
      rep: formatAttoRep(forkMigrationOutcomeData.repTotal, { decimals: 4, roundUp: true }),
      name: outcome ? outcome.name : curOutcomeId,
      winner: forkMigrationOutcomeData.winner,
      isInvalid,
    }
    return [...totals, value]
  }, [])

  const migrationTotals = reportableOutcomes.reduce((p, outcome) => {
    const found = p.find(total => total.id === outcome.id)
    if (found) return p
    return [...p,
      {
        id: outcome.id,
        rep: { formatted: '0', fullPrecision: 0 },
        name: outcome.name,
        winner: false,
      },
    ]
  }, processTotals)
    .sort((a, b) => createBigNumber(b.rep.fullPrecision).minus(createBigNumber(a.rep.fullPrecision)))

  const invalidOutcome = migrationTotals.find(o => o.id === invalidMarketId)
  let formattedMigrationTotals = migrationTotals.slice(0, topOutcomes)
  if (!formattedMigrationTotals.find(o => o.id === invalidMarketId)) {
    formattedMigrationTotals = [...formattedMigrationTotals, invalidOutcome]
  }

  return formattedMigrationTotals
}

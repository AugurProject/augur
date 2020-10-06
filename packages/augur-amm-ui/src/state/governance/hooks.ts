import { TokenAmount } from '@uniswap/sdk'

interface ProposalDetail {
  target: string
  functionSig: string
  callData: string
}

export interface ProposalData {
  id: string
  title: string
  description: string
  proposer: string
  status: string
  forCount: number
  againstCount: number
  startBlock: number
  endBlock: number
  details: ProposalDetail[]
}

// get count of all proposals made
export function useProposalCount(): number | undefined {
  return undefined
}

/**
 * Need proposal events to get description data emitted from
 * new proposal event.
 */
export function useDataFromEventLogs() {
  return []
}

// get data for all past and active proposals
export function useAllProposalData() {
  return []
}

export function useProposalData(id: string): ProposalData | undefined {
  const allProposalData = useAllProposalData()
  return allProposalData?.find(p => p.id === id)
}

// get the users delegatee if it exists
export function useUserDelegatee(): string {
  return undefined
}

export function useUserVotes(): TokenAmount | undefined {
  return undefined
}

export function useDelegateCallback(): (delegatee: string | undefined) => undefined | Promise<string> {
  return undefined
}

export function useVoteCallback(): {
  voteCallback: (proposalId: string | undefined, support: boolean) => undefined | Promise<string>
} {
  return undefined
}

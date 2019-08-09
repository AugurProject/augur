import { ethers } from 'ethers';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';

export function generateTxParameterId(parameters: TransactionMetadataParams): string {
  if (!parameters) return null;
  const json = JSON.stringify(parameters);
  return ethers.utils.formatBytes32String(json).substring(1, 32);
}

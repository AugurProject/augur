export function waitForSigint(): Promise<void> {
  return new Promise((resolve) => {
    process.on('SIGINT', () => resolve())
  })
}
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

export interface AddressFormatting {
  lower?: boolean;
  prefix?: boolean;
}

export function formatAddress(address: string, formatting: AddressFormatting): string {
  if (formatting.lower === true) {
    address = address.toLowerCase();
  }

  const hasPrefix = address.slice(0, 2) === '0x';
  if (formatting.prefix === true && !hasPrefix) {
    address = `0x${address}`;
  } else if (formatting.prefix === false && hasPrefix) {
    address = address.slice(2);
  }

  return address
}

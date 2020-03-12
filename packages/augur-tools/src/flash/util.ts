import readline from 'readline';

export function waitForSigint(): Promise<void> {
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    process.prependListener('SIGINT', () => {
      resolve();
    });
    process.prependListener('SIGTERM', () => {
      resolve();
    });
    process.prependListener('SIGHUP', () => {
      resolve();
    });
  });
}

export function awaitUserInput(question: string): Promise<void> {
  const talker = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    talker.question(question, () => {
      talker.close();
      resolve();
    });
  });
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

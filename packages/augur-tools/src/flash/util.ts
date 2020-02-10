import { spawn } from 'child_process';

export function promiseSpawn(...args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const executable = args[0];
    args = args.slice(1);
    const proc = spawn(executable, args);

    let output = '';
    proc.on('exit', () => resolve(output));
    proc.on('error', reject);
    proc.stdout.on('data', (data) => {
      output += data.toString();
    })
  });
}

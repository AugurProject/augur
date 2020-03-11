export function stringTo32ByteHex(stringToEncode: string): string {
    return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export async function resolveAll<T>(promises: Iterable<Promise<T>>) {
    let firstError: Error|null = null;
    for (const promise of promises) {
        try {
            await promise;
        } catch(e) {
            firstError = firstError || e;
        }
    }
    if (firstError !== null) throw firstError;
}

import * as fs from "fs"
import { promisify } from "util";
import { join } from "path";

const readdirP = promisify(fs.readdir)
const statP = promisify(fs.stat)
async function asyncFilter(arr:Array<any>, filterFunction:(item:any) => Promise<boolean>): Promise<Array<any>> {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await filterFunction(item)) ? item : fail))).filter(i=>i!==fail)
  }

export async function recursiveReadDir(dir:string, ignore: (file: string, stats: fs.Stats) => boolean, allFiles:string[] = []): Promise<string[]> {
    const files = (await readdirP(dir)).map(f => join(dir, f));
    allFiles.push(...files);
    await Promise.all(
        files.map(
            async f => (await statP(f)).isDirectory() && recursiveReadDir(f, ignore, allFiles)
        )
    )
    return asyncFilter(allFiles, async (file:string) => {
        const stat = await statP(file);
        return stat.isFile() && !ignore(file, stat);
    });
}

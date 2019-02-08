import { Bytes32 } from "../";
import { promisify, TextEncoder } from "util";
import * as fs from "fs";
import { join } from "path";


export function stringTo32ByteHex(stringToEncode: string): Bytes32 {
// encode the string as a UTF-8 byte array
    const encoded = (new TextEncoder()).encode(stringToEncode);
// create a Bytes32 to put it in
    const padded = new Bytes32();
// make sure the string isn't too long after encoding
    if (encoded.length > 32) throw new Error(`${stringToEncode} is too long once encoded as UTF-8`);
// put the encoded bytes at the _beginning_ of the Bytes32 (BigEndian)
    padded.set(encoded, 0);

    return padded;
}

export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export async function resolveAll(promises: Iterable<Promise<any>>) {
    let firstError: Error|null = null;
    for (let promise of promises) {
        try {
            await promise;
        } catch(e) {
            firstError = firstError || e;
        }
    }
    if (firstError !== null) throw firstError;
}

const readdirP = promisify(fs.readdir)
const statP = promisify(fs.stat)
async function asyncFilter(arr:Array<any>, filterFunction:(item:any) => Promise<boolean>): Promise<Array<any>> {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await filterFunction(item)) ? item : fail))).filter(i=>i!==fail)
  }

export async function recursiveReadDir(dir:string, ignore: (file: string, stats: fs.Stats) => boolean, allFiles:string[] = []): Promise<string[]> {
    let files = (await readdirP(dir)).map(f => join(dir, f));
    allFiles.push(...files);
    await Promise.all(
        files.map(
            async f => (await statP(f)).isDirectory() && recursiveReadDir(f, ignore, allFiles)
        )
    )
    return await asyncFilter(allFiles, async (file:string) => {
        const stat = await statP(file);
        return stat.isFile() && !ignore(file, stat);
    });
}

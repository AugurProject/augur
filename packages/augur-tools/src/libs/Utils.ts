export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

// TODO: Replace this with ethers/utils "formatBytes32String"
export function stringTo32ByteHex(stringToEncode: string): string {
    return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}

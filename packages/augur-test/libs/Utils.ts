export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export function stringTo32ByteHex(stringToEncode: string): string {
    return `0x${Buffer.from(stringToEncode, 'utf8').toString('hex').padEnd(64, '0')}`;
}

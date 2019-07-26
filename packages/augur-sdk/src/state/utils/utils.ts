export async function sleep(milliseconds: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

export function toAscii(hex: string) {
  let str = ''; // eslint-disable-line
  let i = 0,
      l = hex.length; // eslint-disable-line

  if (hex.substring(0, 2) === '0x') {
    i = 2;
  }

  for (; i < l; i += 2) {
    let code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return str;
}

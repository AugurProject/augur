// Checks if the current navigator.platform is a windows machine
export default function isWindows(): boolean {
  return navigator.platform.indexOf("Win") > -1;
}

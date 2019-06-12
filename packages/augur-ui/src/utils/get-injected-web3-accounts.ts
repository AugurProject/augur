// Access a User’s MetaMask/Dapper Account
export default async function getInjectedWeb3Accounts(): Promise<boolean | Array<string>> {
  if (typeof window.ethereum === "undefined") {
    // Handle case where user hasn't installed MetaMask/Dapper.
    return false;
  }
  try {
    // If a user is logged in to MetaMask/Dapper and has previously approved the dapp,
    // `ethereum.enable` will return the result of `eth_accounts`.
    const accounts = await window.ethereum.enable();
    return accounts;
  } catch (error) {
    // Handle error. If the user rejects the request for access, then
    // `ethereum.enable` will throw an error.
    return false;
  }
}

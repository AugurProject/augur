declare module "parrotsay-api" {
  declare async function say(s:string): Promise<string>

  export = say;
}

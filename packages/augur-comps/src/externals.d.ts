declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}
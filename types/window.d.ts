interface IntegrationHelpers {
  updateAccountAddress(address: string): void;
}

declare namespace window {
  export const integrationHelpers:IntegrationHelpers;
}

export interface AbiOutput {
  name: string;
  type: string;
  internalType?: string;
  components?: AbiOutput[];
}

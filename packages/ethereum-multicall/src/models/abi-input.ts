export interface AbiInput {
  name: string;
  type: string;
  internalType?: string;
  indexed?: boolean;
  components?: AbiInput[];
}

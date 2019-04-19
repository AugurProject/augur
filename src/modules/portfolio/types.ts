export interface NameValuePair {
  label: string;
  value: string;
  comp: Function | null;
}

export interface KeyValuePair {
  key: string;
  label: string;
  value: number;
}

export interface Order {
  id: number;
  pending?: Boolean;
  pendingOredr?: Boolean;
  orderCancellationStatus?: string;
}

export interface FilledOrderInterface {
  id: number;
  type: string;
}

export interface Outcome {
  id: number;
  volume: string;
  price: string;
  description: string | null;
}

export interface Market {
  marketId: string;
  description: string;
  outcomes: Array<Outcome>;
}

export interface Tab {
  key: string;
  label: string;
  num: number;
}

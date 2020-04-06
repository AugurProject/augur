import { windowRef } from 'utils/window-ref';

export default function getValueFromlocalStorage(key: string) {
  return windowRef?.localStorage?.getItem(key);
}

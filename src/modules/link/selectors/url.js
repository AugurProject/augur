import store from 'src/store';

export default function () {
  const { url } = store.getState();
  return url;
}

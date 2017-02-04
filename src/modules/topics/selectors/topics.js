import store from '../../../store';

export default function () {
  const { topics } = store.getState();
  return topics;
}

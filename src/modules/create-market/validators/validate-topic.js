export default function (topic) {
  console.log('topic -- ', topic);
  if (!topic || !topic.length) return 'Please specify a topic';
}

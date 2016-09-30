export const randomSign = () => (Math.random() > 0.5 ? 1 : -1);
export const randomNum = (multiplier = 10) => Math.random() * multiplier * randomSign();

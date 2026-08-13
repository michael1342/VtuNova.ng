import crypto from 'crypto'

export const generateRequestID = (): string => {
  const randomString = Math.random()
    .toString(16)
    .slice(2, 10);

  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  return `${date}${randomString}`;
};

export default generateRequestID
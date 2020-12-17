export const getId = (): string => Math.random().toString(36).slice(-5);

type avatarsType = {
  get: () => string;
  reset: () => void;
};
const avatarsList = [
  '🐵',
  '🐶',
  '🦊',
  '🦝',
  '🐴',
  '🦓',
  '🐷',
  '🐗',
  '🦒',
  '🐭',
  '🐹',
  '🐸',
  '🐬',
];
const avatars = (): avatarsType => {
  let avatars = avatarsList;
  return {
    get: (): string => {
      const randomIndex = Math.floor(Math.random() * avatars.length);
      const avatar = avatars[randomIndex];
      avatars = avatars.filter((str) => str !== avatar);
      return avatar;
    },
    reset: (): void => {
      avatars = avatarsList;
    },
  };
};
export const avatarUtils = avatars();

export const getId = (): string => Math.random().toString(36).slice(-5);

const avatars = (): (() => string) => {
  let avatars = [
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
  return (): string => {
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    avatars = avatars.filter((str) => str !== avatar);
    return avatar;
  };
};
export const getAvatar = avatars();

const randomString = (length = 16) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = length; i > 0; --i) {
    const rand = Math.round(Math.random() * (chars.length - 1))
    token += chars[rand];
  }
  return token;
};

module.exports = randomString;
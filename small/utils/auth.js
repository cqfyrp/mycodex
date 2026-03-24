const { STORAGE_KEYS } = require('./constants');
const { getDesigners } = require('./store');

function login(account, password) {
  const designer = getDesigners().find((item) => item.account === account && item.password === password);

  if (!designer) {
    return null;
  }

  const session = {
    id: designer.id,
    name: designer.name,
    account: designer.account,
    loggedAt: Date.now()
  };

  wx.setStorageSync(STORAGE_KEYS.SESSION, session);
  return session;
}

function logout() {
  wx.removeStorageSync(STORAGE_KEYS.SESSION);
}

function getSession() {
  return wx.getStorageSync(STORAGE_KEYS.SESSION) || null;
}

module.exports = {
  login,
  logout,
  getSession
};

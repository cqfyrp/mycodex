const { getSession } = require('./auth');

function ensureDesignerAccess() {
  const app = getApp();
  const session = getSession();

  if (session) {
    app.setVisitorMode(false);
    return true;
  }

  if (app.globalData.visitorMode) {
    wx.redirectTo({
      url: '/pages/common/no-auth/index'
    });
    return false;
  }

  wx.redirectTo({
    url: '/pages/login/index'
  });
  return false;
}

module.exports = {
  ensureDesignerAccess
};

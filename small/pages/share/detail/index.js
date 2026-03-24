const { getPublishedCaseById } = require('../../../utils/store');
const { parseShareToken } = require('../../../utils/share');
const { decorateCase } = require('../../../utils/view-model');

Page({
  data: {
    caseItem: null,
    visibleModules: []
  },

  onLoad(options) {
    getApp().setVisitorMode(true);

    const token = options.token || '';
    const caseId = parseShareToken(token);

    if (!caseId) {
      this.redirectNoAuth();
      return;
    }

    const caseItem = decorateCase(getPublishedCaseById(caseId));
    if (!caseItem) {
      this.redirectNoAuth();
      return;
    }

    this.setData({
      caseItem,
      visibleModules: (caseItem.modules || []).filter((item) => item.isVisible !== false)
    });
  },

  redirectNoAuth() {
    wx.redirectTo({
      url: '/pages/common/no-auth/index'
    });
  }
});

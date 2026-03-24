const { getCaseById } = require('../../../utils/store');
const { ensureDesignerAccess } = require('../../../utils/guard');
const { buildShareToken } = require('../../../utils/share');
const { decorateCase } = require('../../../utils/view-model');

Page({
  data: {
    caseId: '',
    caseItem: null,
    shareToken: '',
    visibleModules: []
  },

  onLoad(options) {
    this.setData({
      caseId: options.id || ''
    });
  },

  onShow() {
    if (!ensureDesignerAccess()) {
      return;
    }
    this.loadCase();
  },

  loadCase() {
    const caseItem = decorateCase(getCaseById(this.data.caseId));

    if (!caseItem) {
      wx.showToast({
        title: '案例不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 300);
      return;
    }

    this.setData({
      caseItem,
      shareToken: buildShareToken(caseItem.id),
      visibleModules: (caseItem.modules || []).filter((item) => item.isVisible !== false)
    });
  },

  goEdit() {
    wx.navigateTo({
      url: `/pages/case/edit/index?id=${this.data.caseId}`
    });
  },

  copySharePath() {
    wx.setClipboardData({
      data: `/pages/share/detail/index?token=${this.data.shareToken}`
    });
  },

  onShareAppMessage() {
    const { caseItem, shareToken } = this.data;
    return {
      title: caseItem ? caseItem.title : '莱安家装案例',
      path: `/pages/share/detail/index?token=${shareToken}`,
      imageUrl: caseItem && caseItem.coverImageUrl ? caseItem.coverImageUrl : ''
    };
  }
});

const { getCases } = require('../../utils/store');
const { getSession, logout } = require('../../utils/auth');
const { ensureDesignerAccess } = require('../../utils/guard');
const { HOUSE_TYPE_OPTIONS, MATERIAL_OPTIONS } = require('../../utils/constants');
const { decorateCases } = require('../../utils/view-model');

Page({
  data: {
    session: null,
    cases: [],
    recentCases: [],
    stats: [],
    houseTypeChips: HOUSE_TYPE_OPTIONS.slice(0, 4),
    materialChips: MATERIAL_OPTIONS.slice(0, 4)
  },

  onShow() {
    if (!ensureDesignerAccess()) {
      return;
    }

    const cases = decorateCases(getCases().filter((item) => item.status === 'published'));
    const villaCount = cases.filter((item) => item.houseType === 'villa').length;
    const customMaterialCount = new Set(cases.map((item) => item.materialType)).size;
    this.setData({
      session: getSession(),
      cases,
      recentCases: cases.slice(0, 3),
      stats: [
        {
          value: cases.length,
          label: '已发布案例'
        },
        {
          value: villaCount,
          label: '别墅项目'
        },
        {
          value: customMaterialCount,
          label: '在用材质'
        }
      ]
    });
  },

  goList(event) {
    const query = [];
    const { houseType, materialType } = event.currentTarget.dataset;

    if (houseType) {
      query.push(`houseType=${houseType}`);
    }

    if (materialType) {
      query.push(`materialType=${materialType}`);
    }

    const url = `/pages/case/list/index${query.length ? `?${query.join('&')}` : ''}`;
    wx.navigateTo({ url });
  },

  goDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/case/detail/index?id=${id}`
    });
  },

  goEdit() {
    wx.navigateTo({
      url: '/pages/case/edit/index'
    });
  },

  handleLogout() {
    logout();
    getApp().setVisitorMode(false);
    wx.reLaunch({
      url: '/pages/login/index'
    });
  }
});

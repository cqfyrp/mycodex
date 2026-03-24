const { getCases } = require('../../../utils/store');
const { ensureDesignerAccess } = require('../../../utils/guard');
const { HOUSE_TYPE_OPTIONS, MATERIAL_OPTIONS } = require('../../../utils/constants');
const { decorateCases } = require('../../../utils/view-model');

Page({
  data: {
    keyword: '',
    selectedHouseType: '',
    selectedMaterialType: '',
    houseTypeOptions: [{ label: '全部户型', value: '' }].concat(HOUSE_TYPE_OPTIONS),
    materialOptions: [{ label: '全部材质', value: '' }].concat(MATERIAL_OPTIONS),
    allCases: [],
    displayCases: []
  },

  onLoad(options) {
    this.setData({
      selectedHouseType: options.houseType || '',
      selectedMaterialType: options.materialType || ''
    });
  },

  onShow() {
    if (!ensureDesignerAccess()) {
      return;
    }

    this.setData({
      allCases: decorateCases(getCases())
    });
    this.applyFilters();
  },

  handleKeywordChange(event) {
    this.setData({
      keyword: event.detail.value
    });
    this.applyFilters();
  },

  chooseHouseType(event) {
    this.setData({
      selectedHouseType: event.currentTarget.dataset.value
    });
    this.applyFilters();
  },

  chooseMaterial(event) {
    this.setData({
      selectedMaterialType: event.currentTarget.dataset.value
    });
    this.applyFilters();
  },

  applyFilters() {
    const { allCases, keyword, selectedHouseType, selectedMaterialType } = this.data;
    const normalizedKeyword = String(keyword || '').trim().toLowerCase();

    const displayCases = allCases.filter((item) => {
      const hitKeyword = !normalizedKeyword || [
        item.title,
        item.address,
        item.ownerDisplayName,
        ...(item.tags || [])
      ].join(' ').toLowerCase().includes(normalizedKeyword);

      const hitHouseType = !selectedHouseType || item.houseType === selectedHouseType;
      const hitMaterial = !selectedMaterialType || item.materialType === selectedMaterialType;
      return hitKeyword && hitHouseType && hitMaterial;
    });

    this.setData({ displayCases });
  },

  goDetail(event) {
    wx.navigateTo({
      url: `/pages/case/detail/index?id=${event.currentTarget.dataset.id}`
    });
  },

  goEdit(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/case/edit/index?id=${id}`
    });
  },

  createCase() {
    wx.navigateTo({
      url: '/pages/case/edit/index'
    });
  }
});

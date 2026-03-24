const { upsertCase, getCaseById, deleteCase } = require('../../../utils/store');
const { ensureDesignerAccess } = require('../../../utils/guard');
const { getSession } = require('../../../utils/auth');
const { HOUSE_TYPE_OPTIONS, MATERIAL_OPTIONS, MODULE_TYPE_OPTIONS } = require('../../../utils/constants');

function createEmptyCase(session) {
  return {
    id: '',
    title: '',
    coverImageUrl: '',
    coverTheme: 'theme-amber',
    coverBadge: '新案例',
    address: '',
    ownerDisplayName: '',
    houseType: '',
    houseTypeLabel: '',
    areaSqm: '',
    materialType: '',
    materialLabel: '',
    costAmount: '',
    completedAt: '',
    description: '',
    tagsText: '',
    status: 'draft',
    sortOrder: 0,
    createdBy: session ? session.id : '',
    sceneImages: [],
    modules: []
  };
}

function createModule(type) {
  const option = MODULE_TYPE_OPTIONS.find((item) => item.value === type);
  return {
    id: `module-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    moduleTitle: '',
    moduleType: type,
    moduleTypeLabel: option ? option.label : type,
    contentText: '',
    contentJson: {
      valueText: '',
      mediaItems: [],
      videoUrl: '',
      posterUrl: '',
      posterTheme: 'theme-walnut'
    },
    isRequired: false,
    isVisible: true
  };
}

function getHouseTypeLabel(value) {
  const option = HOUSE_TYPE_OPTIONS.find((item) => item.value === value);
  return option ? option.label : '';
}

function getMaterialLabel(value) {
  const option = MATERIAL_OPTIONS.find((item) => item.value === value);
  return option ? option.label : '';
}

function normalizeModules(modules) {
  return (modules || []).map((item) => ({
    ...item,
    moduleTypeLabel: (MODULE_TYPE_OPTIONS.find((option) => option.value === item.moduleType) || {}).label || item.moduleType
  }));
}

Page({
  data: {
    caseId: '',
    isEdit: false,
    form: createEmptyCase(getSession()),
    houseTypeOptions: HOUSE_TYPE_OPTIONS,
    materialOptions: MATERIAL_OPTIONS,
    moduleTypeOptions: MODULE_TYPE_OPTIONS
  },

  syncRouteState(options = {}) {
    const nextCaseId = options.id || this.options.id || '';
    const nextIsEdit = !!nextCaseId;

    if (nextCaseId !== this.data.caseId || nextIsEdit !== this.data.isEdit) {
      this.setData({
        caseId: nextCaseId,
        isEdit: nextIsEdit
      });
    }
  },

  onLoad(options) {
    this.syncRouteState(options);
  },

  onShow() {
    if (!ensureDesignerAccess()) {
      return;
    }

    this.syncRouteState();
    this.loadForm();
  },

  loadForm() {
    const session = getSession();
    if (!this.data.caseId) {
      this.setData({
        form: createEmptyCase(session)
      });
      return;
    }

    const caseItem = getCaseById(this.data.caseId);
    if (!caseItem) {
      wx.showToast({
        title: '案例不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 250);
      return;
    }

    this.setData({
      caseId: String(caseItem.id),
      isEdit: true,
      form: {
        ...caseItem,
        houseTypeLabel: getHouseTypeLabel(caseItem.houseType),
        materialLabel: getMaterialLabel(caseItem.materialType),
        tagsText: (caseItem.tags || []).join(' '),
        modules: normalizeModules(caseItem.modules)
      }
    });
  },

  updateField(event) {
    const { field } = event.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: event.detail.value
    });
  },

  chooseHouseType(event) {
    const index = Number(event.detail.value);
    const selectedValue = this.data.houseTypeOptions[index].value;
    this.setData({
      'form.houseType': selectedValue,
      'form.houseTypeLabel': getHouseTypeLabel(selectedValue)
    });
  },

  chooseMaterial(event) {
    const index = Number(event.detail.value);
    const selectedValue = this.data.materialOptions[index].value;
    this.setData({
      'form.materialType': selectedValue,
      'form.materialLabel': getMaterialLabel(selectedValue)
    });
  },

  chooseCoverImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          'form.coverImageUrl': file.tempFilePath
        });
      }
    });
  },

  chooseSceneImages() {
    wx.chooseMedia({
      count: 6,
      mediaType: ['image'],
      success: (res) => {
        const currentImages = this.data.form.sceneImages || [];
        const nextImages = currentImages.concat(
          res.tempFiles.map((file, index) => ({
            id: `scene-${Date.now()}-${index}`,
            imageUrl: file.tempFilePath,
            theme: 'theme-amber',
            title: `空间实景图 ${currentImages.length + index + 1}`,
            caption: '本地上传图片'
          }))
        );

        this.setData({
          'form.sceneImages': nextImages
        });
      }
    });
  },

  removeSceneImage(event) {
    const { index } = event.currentTarget.dataset;
    const nextImages = this.data.form.sceneImages.filter((_, currentIndex) => currentIndex !== Number(index));
    this.setData({
      'form.sceneImages': nextImages
    });
  },

  addModule() {
    wx.showActionSheet({
      itemList: this.data.moduleTypeOptions.map((item) => item.label),
      success: (res) => {
        const option = this.data.moduleTypeOptions[res.tapIndex];
        const nextModules = (this.data.form.modules || []).concat(createModule(option.value));
        this.setData({
          'form.modules': nextModules
        });
      }
    });
  },

  updateModuleField(event) {
    const { index, field } = event.currentTarget.dataset;
    this.setData({
      [`form.modules[${index}].${field}`]: event.detail.value
    });
  },

  updateModuleJsonField(event) {
    const { index, field } = event.currentTarget.dataset;
    this.setData({
      [`form.modules[${index}].contentJson.${field}`]: event.detail.value
    });
  },

  toggleModuleVisible(event) {
    const { index } = event.currentTarget.dataset;
    this.setData({
      [`form.modules[${index}].isVisible`]: event.detail.value
    });
  },

  toggleModuleRequired(event) {
    const { index } = event.currentTarget.dataset;
    this.setData({
      [`form.modules[${index}].isRequired`]: event.detail.value
    });
  },

  chooseModuleImages(event) {
    const { index } = event.currentTarget.dataset;
    wx.chooseMedia({
      count: 6,
      mediaType: ['image'],
      success: (res) => {
        const items = res.tempFiles.map((file, mediaIndex) => ({
          imageUrl: file.tempFilePath,
          title: `模块图片 ${mediaIndex + 1}`,
          theme: 'theme-amber'
        }));

        this.setData({
          [`form.modules[${index}].contentJson.mediaItems`]: items
        });
      }
    });
  },

  chooseModuleVideo(event) {
    const { index } = event.currentTarget.dataset;
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          [`form.modules[${index}].contentJson.videoUrl`]: file.tempFilePath,
          [`form.modules[${index}].contentJson.posterUrl`]: '',
          [`form.modules[${index}].contentJson.posterTheme`]: 'theme-walnut'
        });
      }
    });
  },

  moveModule(event) {
    const { index, direction } = event.currentTarget.dataset;
    const currentIndex = Number(index);
    const modules = [...this.data.form.modules];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= modules.length) {
      return;
    }

    const temp = modules[currentIndex];
    modules[currentIndex] = modules[targetIndex];
    modules[targetIndex] = temp;

    this.setData({
      'form.modules': modules
    });
  },

  removeModule(event) {
    const { index } = event.currentTarget.dataset;
    const nextModules = this.data.form.modules.filter((_, currentIndex) => currentIndex !== Number(index));
    this.setData({
      'form.modules': nextModules
    });
  },

  saveDraft() {
    this.persistCase('draft');
  },

  publishCase() {
    this.persistCase('published');
  },

  persistCase(status) {
    const { form } = this.data;
    const session = getSession();

    if (!form.title) {
      wx.showToast({
        title: '请先填写案例标题',
        icon: 'none'
      });
      return;
    }

    const payload = {
      ...form,
      createdBy: form.createdBy || (session ? session.id : ''),
      status,
      tags: form.tagsText,
      modules: normalizeModules(form.modules)
    };

    const savedCase = upsertCase(payload);
    wx.showToast({
      title: status === 'published' ? '案例已发布' : '草稿已保存',
      icon: 'success'
    });

    setTimeout(() => {
      wx.redirectTo({
        url: `/pages/case/detail/index?id=${savedCase.id}`
      });
    }, 250);
  },

  deleteCurrentCase() {
    if (!this.data.caseId) {
      wx.showToast({
        title: '新案例无需删除',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '删除案例',
      content: '删除后不可恢复，确认继续吗？',
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        deleteCase(this.data.caseId);
        wx.showToast({
          title: '已删除',
          icon: 'success'
        });

        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/case/list/index'
          });
        }, 250);
      }
    });
  }
});

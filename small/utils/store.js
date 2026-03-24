const { STORAGE_KEYS } = require('./constants');
const { mockCases, mockDesigners } = require('./mock');

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function initializeStore() {
  const storedCases = wx.getStorageSync(STORAGE_KEYS.CASES);
  const storedDesigners = wx.getStorageSync(STORAGE_KEYS.DESIGNERS);

  if (!storedCases || !storedCases.length) {
    wx.setStorageSync(STORAGE_KEYS.CASES, clone(mockCases));
  }

  if (!storedDesigners || !storedDesigners.length) {
    wx.setStorageSync(STORAGE_KEYS.DESIGNERS, clone(mockDesigners));
  }
}

function getDesigners() {
  initializeStore();
  return clone(wx.getStorageSync(STORAGE_KEYS.DESIGNERS) || []);
}

function getCases() {
  initializeStore();
  const cases = clone(wx.getStorageSync(STORAGE_KEYS.CASES) || []);
  return cases.sort((a, b) => {
    const sortA = Number(a.sortOrder || 0);
    const sortB = Number(b.sortOrder || 0);

    if (sortA !== sortB) {
      return sortB - sortA;
    }

    return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
  });
}

function getCaseById(caseId) {
  return getCases().find((item) => String(item.id) === String(caseId)) || null;
}

function getPublishedCaseById(caseId) {
  return getCases().find((item) => String(item.id) === String(caseId) && item.status === 'published') || null;
}

function persistCases(cases) {
  wx.setStorageSync(STORAGE_KEYS.CASES, clone(cases));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}`;
}

function getNowLabel() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function normalizeCasePayload(payload) {
  const nextPayload = clone(payload);
  nextPayload.sceneImages = (nextPayload.sceneImages || []).map((item, index) => ({
    id: item.id || createId('scene'),
    imageUrl: item.imageUrl || '',
    theme: item.theme || 'theme-amber',
    title: item.title || `空间实景图 ${index + 1}`,
    caption: item.caption || ''
  }));

  nextPayload.modules = (nextPayload.modules || []).map((item, index) => ({
    id: item.id || createId('module'),
    moduleTitle: item.moduleTitle || `自定义模块 ${index + 1}`,
    moduleType: item.moduleType || 'text',
    contentText: item.contentText || '',
    contentJson: item.contentJson || {},
    sortOrder: index + 1,
    isRequired: !!item.isRequired,
    isVisible: item.isVisible !== false
  }));

  nextPayload.tags = Array.isArray(nextPayload.tags)
    ? nextPayload.tags.filter(Boolean)
    : String(nextPayload.tags || '')
      .split(/[\s,，]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  nextPayload.updatedAt = getNowLabel();
  return nextPayload;
}

function upsertCase(payload) {
  const cases = getCases();
  const normalized = normalizeCasePayload(payload);
  const existingIndex = cases.findIndex((item) => String(item.id) === String(payload.id));

  if (existingIndex >= 0) {
    cases[existingIndex] = {
      ...cases[existingIndex],
      ...normalized
    };
    persistCases(cases);
    return clone(cases[existingIndex]);
  }

  const nextCase = {
    id: createId('case'),
    coverImageUrl: '',
    coverTheme: 'theme-amber',
    coverBadge: '新案例',
    status: 'draft',
    createdBy: payload.createdBy || '',
    createdAt: getNowLabel(),
    ...normalized
  };

  cases.unshift(nextCase);
  persistCases(cases);
  return clone(nextCase);
}

function deleteCase(caseId) {
  const cases = getCases().filter((item) => String(item.id) !== String(caseId));
  persistCases(cases);
}

module.exports = {
  initializeStore,
  getDesigners,
  getCases,
  getCaseById,
  getPublishedCaseById,
  upsertCase,
  deleteCase
};

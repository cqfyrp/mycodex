const { formatHouseType, formatMaterial, formatAmount, formatArea, formatModuleType } = require('./format');

function decorateModule(module) {
  return {
    ...module,
    moduleTypeLabel: formatModuleType(module.moduleType),
    displayText: module.contentJson && module.contentJson.valueText ? module.contentJson.valueText : module.contentText || '',
    mediaItems: module.contentJson && module.contentJson.mediaItems ? module.contentJson.mediaItems : [],
    videoUrl: module.contentJson && module.contentJson.videoUrl ? module.contentJson.videoUrl : '',
    posterUrl: module.contentJson && module.contentJson.posterUrl ? module.contentJson.posterUrl : '',
    posterTheme: module.contentJson && module.contentJson.posterTheme ? module.contentJson.posterTheme : 'theme-walnut'
  };
}

function decorateCase(caseItem) {
  if (!caseItem) {
    return null;
  }

  return {
    ...caseItem,
    houseTypeLabel: formatHouseType(caseItem.houseType),
    materialLabel: formatMaterial(caseItem.materialType),
    areaLabel: formatArea(caseItem.areaSqm),
    amountLabel: formatAmount(caseItem.costAmount),
    sceneImages: (caseItem.sceneImages || []).map((item) => ({
      ...item,
      theme: item.theme || 'theme-amber'
    })),
    modules: (caseItem.modules || []).map(decorateModule)
  };
}

function decorateCases(cases) {
  return (cases || []).map(decorateCase);
}

module.exports = {
  decorateCase,
  decorateCases
};

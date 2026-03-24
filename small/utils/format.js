const { HOUSE_TYPE_OPTIONS, MATERIAL_OPTIONS, MODULE_TYPE_OPTIONS } = require('./constants');

function getOptionLabel(options, value) {
  const found = options.find((item) => item.value === value);
  return found ? found.label : '待补充';
}

function formatHouseType(value) {
  return getOptionLabel(HOUSE_TYPE_OPTIONS, value);
}

function formatMaterial(value) {
  return getOptionLabel(MATERIAL_OPTIONS, value);
}

function formatModuleType(value) {
  return getOptionLabel(MODULE_TYPE_OPTIONS, value);
}

function formatAmount(value) {
  if (!value) {
    return '待补充';
  }
  return `${value} 元`;
}

function formatArea(value) {
  if (!value) {
    return '待补充';
  }
  return `${value} ㎡`;
}

module.exports = {
  formatHouseType,
  formatMaterial,
  formatModuleType,
  formatAmount,
  formatArea
};

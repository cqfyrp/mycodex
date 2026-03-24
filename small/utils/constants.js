const STORAGE_KEYS = {
  CASES: 'laian_cases',
  DESIGNERS: 'laian_designers',
  SESSION: 'laian_designer_session'
};

const HOUSE_TYPE_OPTIONS = [
  { label: '别墅', value: 'villa' },
  { label: '四合院', value: 'courtyard' },
  { label: '会所', value: 'clubhouse' },
  { label: '自建房', value: 'self_built' },
  { label: '大平层', value: 'flat' },
  { label: '复式楼', value: 'duplex' },
  { label: '套房', value: 'suite' }
];

const MATERIAL_OPTIONS = [
  { label: '非洲紫檀', value: 'african_rosewood' },
  { label: '缅甸花梨', value: 'burmese_padauk' },
  { label: '缅甸柚木', value: 'burmese_teak' },
  { label: '金丝楠木', value: 'golden_nanmu' },
  { label: '小巴花', value: 'small_bubinga' }
];

const MODULE_TYPE_OPTIONS = [
  { label: '单行文本', value: 'text' },
  { label: '多行文本', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '单选', value: 'single_select' },
  { label: '多选', value: 'multi_select' },
  { label: '图片', value: 'image' },
  { label: '图片组', value: 'image_group' },
  { label: '视频', value: 'video' },
  { label: '图文混排', value: 'rich_content' }
];

module.exports = {
  STORAGE_KEYS,
  HOUSE_TYPE_OPTIONS,
  MATERIAL_OPTIONS,
  MODULE_TYPE_OPTIONS
};

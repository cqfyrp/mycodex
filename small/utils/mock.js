const mockDesigners = [
  {
    id: 'd-001',
    name: '莱安设计一部',
    account: 'laian01',
    password: '123456'
  },
  {
    id: 'd-002',
    name: '莱安设计二部',
    account: 'laian02',
    password: '123456'
  }
];

const mockCases = [
  {
    id: '1001',
    title: '观澜别墅整木定制案例',
    coverImageUrl: '',
    coverTheme: 'theme-amber',
    coverBadge: '莱安精选',
    address: '深圳观澜别墅区',
    ownerDisplayName: '王先生',
    houseType: 'villa',
    areaSqm: '380',
    materialType: 'burmese_teak',
    costAmount: '880000',
    completedAt: '2025-12-18',
    description: '全屋以中式木作为核心，客厅、茶室与主卧采用统一木色体系，强调沉稳气质与居住温度。',
    tags: ['别墅', '中式木作', '整木定制'],
    status: 'published',
    sortOrder: 100,
    createdBy: 'd-001',
    updatedAt: '2026-03-24 10:30:00',
    sceneImages: [
      {
        id: 's-1001-1',
        imageUrl: '',
        theme: 'theme-walnut',
        title: '客厅主视角',
        caption: '顶面、护墙与家具木色统一，整体气质更稳。'
      },
      {
        id: 's-1001-2',
        imageUrl: '',
        theme: 'theme-gold',
        title: '茶室空间',
        caption: '通过格栅与灯光层次，强化静雅氛围。'
      }
    ],
    modules: [
      {
        id: 'm-1001-1',
        moduleTitle: '木作亮点',
        moduleType: 'textarea',
        contentText: '客厅背景墙采用缅甸柚木整板拼接，配合茶室木格栅，让整体空间层次更完整。',
        contentJson: {},
        sortOrder: 1,
        isRequired: false,
        isVisible: true
      },
      {
        id: 'm-1001-2',
        moduleTitle: '细节图集',
        moduleType: 'image_group',
        contentText: '',
        contentJson: {
          mediaItems: [
            {
              imageUrl: '',
              title: '楼梯扶手节点',
              theme: 'theme-amber'
            },
            {
              imageUrl: '',
              title: '门套收口细节',
              theme: 'theme-mist'
            }
          ]
        },
        sortOrder: 2,
        isRequired: false,
        isVisible: true
      }
    ]
  },
  {
    id: '1002',
    title: '香山四合院会客厅案例',
    coverImageUrl: '',
    coverTheme: 'theme-walnut',
    coverBadge: '分享热门',
    address: '北京香山片区',
    ownerDisplayName: '李女士',
    houseType: 'courtyard',
    areaSqm: '260',
    materialType: 'golden_nanmu',
    costAmount: '1260000',
    completedAt: '2025-11-04',
    description: '四合院会客厅强调礼序感，选用金丝楠木主材，细节以温润光泽和雕花节点突出空间气质。',
    tags: ['四合院', '会客厅', '金丝楠木'],
    status: 'published',
    sortOrder: 90,
    createdBy: 'd-002',
    updatedAt: '2026-03-23 17:45:00',
    sceneImages: [
      {
        id: 's-1002-1',
        imageUrl: '',
        theme: 'theme-gold',
        title: '会客厅轴线',
        caption: '礼序动线明确，强调中轴对称。'
      }
    ],
    modules: [
      {
        id: 'm-1002-1',
        moduleTitle: '客户关注点',
        moduleType: 'multi_select',
        contentText: '',
        contentJson: {
          valueText: '用材、会客厅气场、耐久度'
        },
        sortOrder: 1,
        isRequired: false,
        isVisible: true
      },
      {
        id: 'm-1002-2',
        moduleTitle: '工艺讲解视频',
        moduleType: 'video',
        contentText: '',
        contentJson: {
          videoUrl: '',
          posterUrl: '',
          posterTheme: 'theme-walnut'
        },
        sortOrder: 2,
        isRequired: false,
        isVisible: true
      }
    ]
  },
  {
    id: '1003',
    title: '龙华大平层木作升级案例',
    coverImageUrl: '',
    coverTheme: 'theme-mist',
    coverBadge: '近期完工',
    address: '深圳龙华区',
    ownerDisplayName: '陈先生',
    houseType: 'flat',
    areaSqm: '210',
    materialType: 'burmese_padauk',
    costAmount: '560000',
    completedAt: '2026-01-19',
    description: '以大平层家庭起居为主线，客餐厅一体化处理，兼顾收纳、展示与家庭聚会场景。',
    tags: ['大平层', '新中式', '缅甸花梨'],
    status: 'published',
    sortOrder: 80,
    createdBy: 'd-001',
    updatedAt: '2026-03-22 09:20:00',
    sceneImages: [
      {
        id: 's-1003-1',
        imageUrl: '',
        theme: 'theme-amber',
        title: '餐厅定制柜',
        caption: '结合储物与展示，空间更整洁。'
      }
    ],
    modules: [
      {
        id: 'm-1003-1',
        moduleTitle: '项目总结',
        moduleType: 'rich_content',
        contentText: '这套案例更适合向关注实用性、收纳和整体统一感的客户展示。',
        contentJson: {},
        sortOrder: 1,
        isRequired: false,
        isVisible: true
      }
    ]
  }
];

module.exports = {
  mockDesigners,
  mockCases
};

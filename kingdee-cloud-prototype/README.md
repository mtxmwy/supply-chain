# 金蝶星空云 - 开源企业管理系统原型

## 项目简介

这是一个仿照金蝶星空云设计的开源企业级ERP管理系统原型，基于 Vue 3 + TypeScript + Element Plus 构建，旨在为中小企业提供一套完整的数字化管理解决方案。

## 技术栈

- **前端框架**: Vue 3.4+ (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite 5.0+
- **UI 组件库**: Element Plus 2.4+
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **图表库**: ECharts 5 + Vue-ECharts
- **样式预处理**: Sass
- **日期处理**: Day.js

## 功能模块

### 🏠 工作台
- 数据概览看板
- 待办事项管理
- 最新动态展示
- 销售趋势图表
- 业务数据统计

### 📦 供应链管理
- **采购管理**: 采购订单创建、审核、跟踪
- **库存管理**: 库存查询、调整、盘点、预警
- **销售管理**: 销售订单、发货管理、利润分析

### 💰 财务管理
- **总账管理**: 会计科目、凭证管理
- **应收管理**: 客户应收账款跟踪
- **应付管理**: 供应商应付账款管理

### ⚙️ 系统管理
- **用户管理**: 用户账号、权限管理
- **角色管理**: 角色权限配置
- **权限管理**: 功能权限控制

## 设计特色

### 🎨 金蝶星空云风格
- 采用金蝶经典的蓝色主题色彩
- 现代化的卡片式布局设计
- 清晰的信息层级和视觉引导
- 响应式设计，支持多终端访问

### 📱 用户体验
- 直观的操作界面和交互流程
- 完善的表单验证和错误提示
- 流畅的页面切换和加载动画
- 友好的空状态和加载状态

### 🔧 技术亮点
- 基于 Vue 3 Composition API 的现代化开发
- TypeScript 提供完整的类型安全
- 模块化的组件设计和代码组织
- 可扩展的主题系统和样式变量

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## 项目结构

```
kingdee-cloud-prototype/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 公共组件
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   │   ├── Dashboard.vue      # 工作台
│   │   ├── Login.vue          # 登录页
│   │   ├── supply-chain/      # 供应链模块
│   │   ├── finance/           # 财务模块
│   │   └── system/            # 系统管理模块
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目文档
```

## 登录信息

演示账号信息：
- **用户名**: admin
- **密码**: 123456

## 功能演示

### 主要功能页面
1. **工作台**: 数据看板和业务概览
2. **采购管理**: 完整的采购流程管理
3. **库存管理**: 库存查询和调整功能
4. **销售管理**: 销售订单和利润分析
5. **用户管理**: 用户账号和权限管理

### 核心特性
- ✅ 响应式布局设计
- ✅ 完整的CRUD操作
- ✅ 表单验证和数据校验
- ✅ 数据可视化图表
- ✅ 权限控制和路由守卫
- ✅ 国际化支持框架

## 开发计划

### 近期计划
- [ ] 完善财务模块功能
- [ ] 增加更多图表类型
- [ ] 优化移动端适配
- [ ] 添加单元测试

### 长期规划
- [ ] 后端API接口开发
- [ ] 数据库设计和实现
- [ ] 微服务架构改造
- [ ] Docker容器化部署
- [ ] 云原生部署方案

## 贡献指南

欢迎参与项目开发！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 项目地址: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: your-email@example.com

## 致谢

感谢以下开源项目为本项目提供的支持：
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [ECharts](https://echarts.apache.org/)
- [Vite](https://vitejs.dev/)

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
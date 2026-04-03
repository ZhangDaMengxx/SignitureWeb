# 设计术语灵感剪切板 ✨

一个自动生成设计术语的灵感剪切板应用，采用按周组织的手账式界面。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZhangDaMengxx/SignitureWeb)

## 功能特性

- 📅 **周视图布局**: 三行手账式布局（周一-周三 / 周四-周末 / 笔记本）
- 🖼️ **图片上传**: 拖拽上传，宝丽来风格展示
- 🤖 **AI术语生成**: 使用 Gemini API 自动识别图片生成设计术语
- 🏷️ **标签管理**: 悬停展开、点击复制、编辑删除
- 🎨 **温暖主题**: 琥珀色系，支持深色模式
- ✍️ **手写风格**: 拟物化装饰元素

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### 后端
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Google Gemini API

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/ZhangDaMengxx/SignitureWeb.git
cd SignitureWeb
```

### 2. 安装依赖
```bash
# 前端
cd frontend && npm install

# 后端
cd ../backend && npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 填入你的配置
```

### 4. 初始化数据库
```bash
cd backend
npx tsx src/scripts/initDb.ts
```

### 5. 运行
```bash
# 后端 (端口 3001)
npm run dev

# 前端 (端口 5173) - 新开终端
cd ../frontend && npm run dev
```

## Vercel 部署

详见 [DEPLOY.md](./DEPLOY.md)

快速部署步骤:
1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量 (`DATABASE_URL`, `GEMINI_API_KEY`)
4. 点击 Deploy

## 文档

- [API 文档](./API.md)
- [使用指南](./USAGE.md)
- [部署指南](./DEPLOY.md)
- [项目日记](./PROJECT_DIARY.md)

## 项目结构

```
SignitureWeb/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   └── lib/          # 工具函数
│   └── package.json
├── backend/           # Express 后端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── middleware/   # 中间件
│   │   └── services/     # 服务
│   └── package.json
├── design-terminology-inspiration-board-skill/  # AI Skill
└── README.md
```

## 开发进度

- [x] 项目初始化
- [x] 数据库设计
- [x] 核心功能开发
- [x] UI/UX 精细化
- [x] 安全加固
- [x] 性能优化
- [x] 部署配置

当前进度: **100%**

## 许可证

MIT

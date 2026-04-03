# 设计术语灵感剪切板

一个自动生成设计术语的灵感剪切板应用，采用按周组织的手账式界面。

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
- shadcn/ui 组件

### 后端
- Node.js + Express
- PostgreSQL + Drizzle ORM
- Multer (文件上传)

### AI
- Google Gemini API

## 快速开始

### 前置要求
- Node.js >= 18
- PostgreSQL >= 14

### 安装

```bash
# 1. 克隆项目
git clone <repository>
cd SignitureWeb

# 2. 安装前端依赖
cd frontend
npm install

# 3. 安装后端依赖
cd ../backend
npm install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库和API配置

# 5. 数据库迁移
npm run db:push
```

### 运行

```bash
# 后端（在 backend 目录）
npm run dev

# 前端（在 frontend 目录，新开终端）
npm run dev
```

### 测试

```bash
# 前端测试
npm run test

# 后端测试
npm run test
```

## 项目结构

```
SignitureWeb/
├── frontend/          # React前端
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── hooks/        # 自定义Hooks
│   │   ├── lib/          # 工具函数
│   │   └── types/        # TypeScript类型
│   └── package.json
├── backend/           # Express后端
│   ├── src/
│   │   ├── models/       # 数据库模型
│   │   ├── routes/       # API路由
│   │   └── middleware/   # 中间件
│   └── package.json
└── README.md
```

## 开发进度

详见 [PROJECT_DIARY.md](./PROJECT_DIARY.md)

## 许可证

MIT

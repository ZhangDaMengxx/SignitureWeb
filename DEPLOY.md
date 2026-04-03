# Vercel 部署指南

## 前置要求

- [Vercel 账号](https://vercel.com/signup)
- [GitHub 账号](https://github.com/signup) (已配置)
- 项目已推送到 GitHub

---

## 部署步骤

### 1. 导入项目到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 `ZhangDaMengxx/SignitureWeb` 仓库
4. 点击 "Import"

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | Supabase 数据库连接字符串 | `postgresql://...` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `FRONTEND_URL` | 前端地址 | `https://your-app.vercel.app` |
| `NODE_ENV` | 环境模式 | `production` |

### 3. 部署配置

#### 前端 (Vercel)
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 后端 (Vercel)
- **Framework Preset**: `Other`
- **Root Directory**: `backend`
- **Build Command**: `npm run build`

### 4. 数据库配置

#### Supabase 设置
1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 获取 `DATABASE_URL` (Settings > Database > Connection string)

#### 初始化数据库表
```bash
# 本地运行初始化脚本
npx tsx backend/src/scripts/initDb.ts
```

或在 Supabase SQL Editor 中执行：
```sql
-- 创建 weeks 表
CREATE TABLE IF NOT EXISTS weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(year, week_number)
);

-- 创建 cards 表
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('MON', 'TUE', 'WED', 'THU', 'FRI', 'WEEKEND')),
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 创建 terms 表
CREATE TABLE IF NOT EXISTS terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS week_day_idx ON cards(week_id, day_of_week);
CREATE INDEX IF NOT EXISTS card_idx ON terms(card_id);
```

### 5. 部署

点击 "Deploy" 按钮，等待部署完成。

---

## 分离部署（推荐）

### 前端部署
1. 在 Vercel 创建新项目
2. Root Directory 设置为 `frontend`
3. Framework 选择 `Vite`
4. 添加环境变量:
   - `VITE_API_URL` = 后端 API 地址

### 后端部署
1. 在 Vercel 创建新项目
2. Root Directory 设置为 `backend`
3. 添加环境变量:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (前端部署后的地址)

---

## 部署后验证

### 健康检查
```bash
curl https://your-app.vercel.app/api/health
```

### API 测试
```bash
# 获取周列表
curl https://your-app.vercel.app/api/weeks

# 测试 AI 服务
curl https://your-app.vercel.app/api/ai/health
```

---

## 故障排查

### 常见问题

1. **Build 失败**
   - 检查 Node.js 版本 (需要 18+)
   - 确认依赖已正确安装

2. **数据库连接失败**
   - 检查 `DATABASE_URL` 是否正确
   - 确认 Supabase 允许 Vercel IP 访问

3. **API 404**
   - 检查 `vercel.json` 路由配置
   - 确认后端构建成功

4. **图片上传失败**
   - Vercel Serverless 有 4.5MB 请求限制
   - 建议添加图片压缩

---

## 更新部署

```bash
# 推送代码后自动部署
git add .
git commit -m "更新内容"
git push origin main:SignitureWeb
```

Vercel 会自动检测推送并重新部署。

---

## 自定义域名

1. Vercel Dashboard > Project Settings > Domains
2. 添加你的域名
3. 按照指示配置 DNS

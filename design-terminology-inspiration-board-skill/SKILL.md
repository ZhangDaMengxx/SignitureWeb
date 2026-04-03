# Design Terminology Inspiration Board - Agent 自动化开发 Skill

## 项目概述

构建一个自动生成设计术语的灵感剪切板应用，界面为按周组织的手账式布局。

### 技术栈
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **后端**: Node.js + Express
- **AI**: Gemini API (图片→设计术语)
- **数据库**: PostgreSQL + Drizzle ORM

---

## 核心开发原则

### 1. 测试驱动开发 (TDD)
- 每个功能节点必须先写测试，再写实现
- 测试需覆盖：正常流程、边界条件、错误处理、安全攻击场景
- 测试失败时分析原因，修正后再继续

### 2. Git 版本控制策略
```bash
# 成功提交格式
git add .
git commit -m "[TASK-ID] 功能描述

- 完成功能A
- 完成功能B
- 测试通过率: X%
- 下一步: 功能C"

# 失败回退
git reset --hard HEAD~1
git log --oneline -5  # 查看历史
```

### 3. 代码风格规范
- **缩进**: 制表符 (Tab)
- **嵌套深度**: 严格限制3层以内
- **函数**: 单一职责，长度限制在单屏可视范围
- **局部变量**: 不超过7个（工作记忆上限）
- **命名**: 局部极简，全局完整语义，禁止匈牙利命名法
- **注释**: 仅说明设计意图，非实现机制

### 4. 上下文管理
- 每次任务完成时清理无关上下文
- 提供干净的文件上下文
- 定期压缩历史记录

---

## 任务节点规划

### Phase 1: 项目初始化 (0% → 10%)

#### Node 1.1: 项目结构与依赖初始化
**目标**: 搭建前后端项目骨架

**测试要点**:
- 所有依赖正确安装
- 开发服务器正常启动
- 构建流程无错误
- 目录结构符合规范

**任务清单**:
1. 初始化前端项目 (Vite + React + TS)
2. 配置 Tailwind CSS
3. 初始化 shadcn/ui
4. 安装 Framer Motion
5. 初始化后端项目 (Express + TS)
6. 配置 Drizzle ORM
7. 初始化数据库连接

**Git 提交**: `[INIT-001] 项目结构初始化完成`

---

#### Node 1.2: 数据库 Schema 设计
**目标**: 设计并初始化数据库表结构

**测试要点**:
- Schema 迁移成功
- 所有表正确创建
- 外键关系正确
- 索引优化查询
- SQL注入防护验证

**Schema 定义**:
```typescript
// 周记录表
Table weeks {
  id: uuid pk
  year: int
  week_number: int
  created_at: timestamp
  unique: [year, week_number]
}

// 灵感卡片表
Table cards {
  id: uuid pk
  week_id: uuid fk
  day_of_week: enum(MON,TUE,WED,THU,FRI,WEEKEND)
  image_url: text
  image_path: text
  created_at: timestamp
}

// 设计术语表
Table terms {
  id: uuid pk
  card_id: uuid fk
  term: text
  is_ai_generated: boolean
  order_index: int
  created_at: timestamp
}
```

**Git 提交**: `[DB-001] 数据库Schema设计与迁移`

---

### Phase 2: 核心功能开发 (10% → 60%)

#### Node 2.1: 周视图布局组件
**目标**: 实现三行手账式周视图

**测试要点**:
- 三行布局正确渲染
- 响应式适配
- 日期计算准确（周数、日期范围）
- 导航切换正常
- 性能优化（大量卡片时流畅）

**组件结构**:
```
WeekView
├── WeekNavigation (顶部导航)
├── WeekGrid
│   ├── Row1: Mon/Tue/Wed
│   ├── Row2: Thu/Fri/Weekend
│   └── Row3: Notebook (可拖拽高度)
└── DayCell (日期格子)
```

**Git 提交**: `[UI-001] 周视图布局实现`

---

#### Node 2.2: 图片上传与存储
**目标**: 实现图片上传、存储、展示

**测试要点**:
- 图片格式验证 (jpg, png, gif, webp)
- 文件大小限制 (< 10MB)
- 恶意文件上传防护
- 图片压缩优化
- 存储路径安全
- 上传失败重试机制

**安全测试**:
- 尝试上传可执行文件
- 尝试路径遍历攻击
- 尝试XXE攻击
- 尝试DoS攻击（超大文件）

**Git 提交**: `[FEAT-001] 图片上传功能实现`

---

#### Node 2.3: Gemini API 集成
**目标**: 图片识别生成设计术语

**测试要点**:
- API 调用成功
- 术语生成质量
- 错误处理（API限流、超时）
- 失败重试机制
- API Key 安全存储
- 网络攻击防护

**Mock 测试数据**:
```typescript
const mockTerms = [
  "Minimalism",
  "Negative Space",
  "Typography",
  "Color Theory",
  "Visual Hierarchy"
];
```

**Git 提交**: `[AI-001] Gemini API集成`

---

#### Node 2.4: 宝丽来风格图片卡片
**目标**: 实现拍立得风格卡片 + 随机装饰

**测试要点**:
- 样式正确渲染
- 随机装饰元素分布合理
- 动画流畅
- 图片加载优化
- 深色模式适配

**装饰元素**:
- 胶带 (Washi Tape)
- 图钉 (Pin)
- 回形针 (Paper Clip)
- 便签角 (Folded Corner)

**Git 提交**: `[UI-002] 宝丽来卡片样式实现`

---

#### Node 2.5: 术语标签系统
**目标**: 实现标签展示、悬停展开、复制、编辑

**测试要点**:
- 默认显示第一个 + [N] 计数
- 悬停展开完整列表
- 点击复制到剪贴板
- 删除标签功能
- 添加/编辑标签
- XSS 防护（标签内容过滤）

**交互测试**:
- 快速点击无异常
- 并发编辑处理
- 空标签处理
- 超长标签截断

**Git 提交**: `[FEAT-002] 术语标签系统实现`

---

### Phase 3: UI/UX 精细化 (60% → 80%)

#### Node 3.1: 温暖琥珀色系主题
**目标**: 实现主色调 + 深色模式

**测试要点**:
- 颜色对比度符合 WCAG 标准
- 深色模式切换流畅
- 系统主题偏好检测
- 主题持久化存储

**配色方案**:
```css
/* 浅色模式 */
--amber-50: #fffbeb;
--amber-100: #fef3c7;
--amber-200: #fde68a;
--amber-500: #f59e0b;
--amber-700: #b45309;
--amber-900: #78350f;

/* 深色模式 */
--amber-950: #451a03;
--amber-900: #78350f;
```

**Git 提交**: `[UI-003] 主题系统实现`

---

#### Node 3.2: 手写字体与拟物化
**目标**: 手写感字体 + 拟物装饰

**测试要点**:
- 字体加载优化
- 回退字体机制
- 拟物元素渲染正确
- 性能影响评估

**字体选择**:
- 中文: 站酷快乐体 / 手书体
- 英文: Caveat / Patrick Hand

**Git 提交**: `[UI-004] 字体与拟物化装饰`

---

#### Node 3.3: 笔记本区域 (拖拽高度)
**目标**: 实现可拖拽调整高度的笔记本区域

**测试要点**:
- 拖拽流畅
- 高度限制（最小/最大）
- 状态持久化
- 移动端触摸支持

**Git 提交**: `[UI-005] 可拖拽笔记本区域`

---

### Phase 4: 安全与优化 (80% → 90%)

#### Node 4.1: 安全加固
**目标**: 防范常见网络攻击

**测试清单**:
- [ ] SQL 注入测试
- [ ] XSS 攻击测试
- [ ] CSRF 防护测试
- [ ] 文件上传安全测试
- [ ] API 限流测试
- [ ] 敏感信息泄露测试

**防护措施**:
- 输入验证与消毒
- 参数化查询
- CSP 头配置
- Rate Limiting
- Helmet.js

**Git 提交**: `[SEC-001] 安全加固完成`

---

#### Node 4.2: 性能优化
**目标**: 优化加载与运行性能

**测试要点**:
- Lighthouse 评分 > 90
- 首屏加载 < 2s
- 图片懒加载
- 虚拟滚动（大量卡片）
- Bundle 体积优化

**Git 提交**: `[OPT-001] 性能优化完成`

---

### Phase 5: 交付与文档 (90% → 100%)

#### Node 5.1: 部署配置
**目标**: 生产环境部署配置

**Git 提交**: `[DEPLOY-001] 部署配置完成`

---

#### Node 5.2: 项目文档
**目标**: 完善README与API文档

**Git 提交**: `[DOC-001] 项目文档完善`

---

## 项目日记模板

位置: `d:\SignitureWeb/PROJECT_DIARY.md`

```markdown
# 项目日记 - 设计术语灵感剪切板

## 当前进度: XX%

### 2026-XX-XX 更新
- 完成任务: XXX
- 当前进度: XX%
- 测试通过率: XX%
- 遇到的问题: XXX
- 下一步计划: XXX
- Git 提交: [XXX-XXX] XXX

### 已完成节点
- [x] Node 1.1 - 项目初始化 (10%)
- [ ] Node 1.2 - 数据库设计 (进行中)
...
```

---

## 开发命令速查

### 前端
```bash
cd frontend
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run test       # 运行测试
npm run lint       # 代码检查
```

### 后端
```bash
cd backend
npm run dev        # 开发服务器 (nodemon)
npm run build      # 编译TS
npm run test       # 运行测试
npm run db:push    # 推送Schema变更
npm run db:migrate # 运行迁移
```

---

## 测试策略

### 单元测试
- 每个工具函数
- 每个组件基础渲染
- 每个API端点

### 集成测试
- 上传→AI识别→保存完整流程
- 周切换→数据加载
- 标签编辑→持久化

### 安全测试
- OWASP Top 10 覆盖
- 模糊测试 (Fuzzing)
- 渗透测试清单

---

## 故障恢复流程

### 测试失败时
1. 分析失败原因
2. 修复代码或调整测试
3. 重新运行测试
4. 记录修复过程

### 节点失败时
1. 回退Git版本: `git reset --hard HEAD~1`
2. 总结失败原因
3. 调整任务计划
4. 重新执行任务

### 上下文过长时
1. 总结当前进度到项目日记
2. 清理无关文件上下文
3. 提供精简的任务上下文
4. 继续开发

---

## 注意事项

1. **严禁执行项目外操作**
2. **严禁执行有害系统操作**
3. **每次测试后提交Git**
4. **保持项目日记更新**
5. **控制上下文长度**
6. **遵循代码风格规范**

---

## Agent 执行模式

### 单节点执行循环
```
1. 读取项目日记了解当前进度
2. 获取当前任务节点的测试要求
3. 编写测试代码
4. 运行测试（预期失败）
5. 实现功能代码
6. 运行测试（预期通过）
7. 安全测试
8. 提交Git版本
9. 更新项目日记
10. 进入下一节点
```

### 安全检查清单（每个节点执行）
- [ ] 输入验证
- [ ] 错误处理
- [ ] 权限检查
- [ ] 日志记录
- [ ] 资源释放

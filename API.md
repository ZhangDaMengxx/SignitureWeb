# API 文档

## 基础信息

- **基础 URL**: `http://localhost:3001/api` (开发) / `https://your-app.vercel.app/api` (生产)
- **Content-Type**: `application/json`

---

## 周记录 (Weeks)

### 获取所有周
```http
GET /api/weeks
```

**响应**:
```json
[
  {
    "id": "uuid",
    "year": 2026,
    "weekNumber": 14,
    "createdAt": "2026-04-03T12:00:00Z",
    "cards": [...]
  }
]
```

### 获取指定周
```http
GET /api/weeks/:year/:weekNumber
```

**示例**: `GET /api/weeks/2026/14`

### 创建周记录
```http
POST /api/weeks
Content-Type: application/json

{
  "year": 2026,
  "weekNumber": 14
}
```

---

## 卡片 (Cards)

### 获取所有卡片
```http
GET /api/cards
```

### 获取单张卡片
```http
GET /api/cards/:id
```

### 创建卡片（上传图片）
```http
POST /api/cards
Content-Type: multipart/form-data

image: <File>
weekId: <UUID>
dayOfWeek: MON | TUE | WED | THU | FRI | WEEKEND
```

### 删除卡片
```http
DELETE /api/cards/:id
```

---

## 术语 (Terms)

### 获取卡片的术语
```http
GET /api/terms?cardId=:cardId
```

### 创建术语
```http
POST /api/terms
Content-Type: application/json

{
  "cardId": "uuid",
  "text": "极简主义",
  "isAiGenerated": false
}
```

### 批量创建术语
```http
POST /api/terms/batch
Content-Type: application/json

{
  "cardId": "uuid",
  "termList": ["极简主义", "负空间", "排版设计"]
}
```

### 更新术语
```http
PUT /api/terms/:id
Content-Type: application/json

{
  "text": "新的术语"
}
```

### 删除术语
```http
DELETE /api/terms/:id
```

---

## AI 生成

### 从图片生成术语
```http
POST /api/ai/generate-terms
Content-Type: application/json

{
  "imageBase64": "base64encodedstring",
  "mimeType": "image/jpeg"
}
```

**响应**:
```json
{
  "terms": ["极简主义", "负空间", "排版设计"],
  "source": "gemini"
}
```

### AI 服务健康检查
```http
GET /api/ai/health
```

---

## 健康检查

```http
GET /api/health
```

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2026-04-03T12:00:00Z",
  "version": "1.0.0"
}
```

---

## 错误响应

### 400 Bad Request
```json
{
  "error": "输入验证失败",
  "details": [
    { "field": "year", "message": "必填项" }
  ]
}
```

### 404 Not Found
```json
{
  "error": "资源不存在"
}
```

### 429 Too Many Requests
```json
{
  "error": "请求过于频繁，请稍后再试",
  "retryAfter": 900
}
```

---

## 限流策略

| 接口 | 限制 |
|------|------|
| 通用 API | 100 请求 / 15 分钟 |
| 文件上传 | 5 次 / 分钟 |
| AI 生成 | 10 次 / 分钟 |

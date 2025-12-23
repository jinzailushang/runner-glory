# 跑者高光 (RunnerGlory)

AI 换脸技术，一键生成专业马拉松完赛照片。告别丑照，拥抱高光时刻。

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境变量配置
复制并修改环境变量文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 配置以下变量：
```env
# Supabase 配置（可选，用于生产环境）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Replicate API（可选，用于AI图片生成）
REPLICATE_API_TOKEN=your_replicate_api_token

# 第三方支付平台（可选）
MANDUO_API_KEY=your_manduo_api_key
MANDUO_PRODUCT_ID=your_product_id
```

### 运行开发服务器
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 项目结构

```
runner-glory/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   ├── create/         # 创建页面
│   │   ├── result/         # 结果页面
│   │   └── layout.tsx      # 根布局
│   ├── components/         # React 组件
│   │   └── ui/            # Shadcn/UI 组件
│   └── lib/               # 工具库
│       ├── supabase.ts    # Supabase 客户端
│       ├── replicate.ts   # Replicate AI 集成
│       ├── payment.ts     # 支付集成
│       └── templates.ts   # 模版配置
├── supabase/              # 数据库迁移和配置
├── public/                # 静态资源
└── README.md
```

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: Tailwind CSS + Shadcn/UI
- **数据库**: Supabase (PostgreSQL)
- **AI 引擎**: Replicate API
- **支付**: 第三方发卡平台
- **部署**: Vercel

## 📦 主要功能

### 🎯 核心功能
- ✅ AI 换脸生成完赛照片
- ✅ 多种马拉松模版选择
- ✅ 移动端优先设计
- ✅ 实时预览和生成

### 💰 商业功能
- ✅ 兑换码系统
- ✅ 第三方支付集成
- ✅ 隐私保护（24小时自动删除）

### 🔧 技术特性
- ✅ TypeScript 支持
- ✅ 服务端渲染 (SSR)
- ✅ API 路由
- ✅ 响应式设计

## 🚀 部署

### Vercel 一键部署
1. Fork 此项目
2. 连接 Vercel 账户
3. 配置环境变量
4. 部署完成

### 手动部署
```bash
npm run build
npm start
```

## 📋 开发计划

### 已完成 ✅
- [x] 项目初始化和基础架构
- [x] 前端页面开发（首页、上传、结果页）
- [x] API 路由开发（生成、兑换码验证）
- [x] 模版管理系统
- [x] 数据库设计（Supabase）
- [x] 后端集成（Replicate AI）
- [x] 支付集成（第三方平台）
- [x] 构建和部署配置
- [x] Supabase 数据库逻辑集成
- [x] Replicate AI 换脸与水印功能实现
- [x] 第三方支付回调与兑换码自动生成
- [x] 功能测试套件（单元测试、集成测试、API测试）

### 待完成 🔄
- [ ] 生产环境全流程联调测试
- [ ] 更多马拉松底图素材补充

## 🧪 测试

项目包含完整的测试套件，用于验证已完成功能。

### 运行测试

```bash
# 运行集成测试
npm run test

# 或
npm run test:integration
```

### 测试覆盖

- ✅ 模版管理功能（查询、分类、筛选）
- ✅ 支付功能（链接生成、产品信息）
- ✅ API 路由（参数验证、错误处理）
- ✅ 环境配置检查

详细测试文档请参考 [TEST.md](./TEST.md)

### API 测试

启动开发服务器后，运行 API 测试脚本：

```bash
# 启动服务器
npm run dev

# 在另一个终端运行 API 测试
./__tests__/api-test.sh
```

## 📚 API 文档

### POST /api/generate
生成AI换脸图片
```typescript
{
  image: File,        // 用户头像
  templateId: string, // 模版ID
  raceName: string,   // 赛事名称
  finishTime: string  // 完赛时间
}
```

### POST /api/redeem
兑换高清图片
```typescript
{
  code: string,       // 兑换码
  resultId: string    // 结果ID
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## ⚠️ 免责声明

本项目仅用于学习和演示目的。实际使用时请确保遵守相关法律法规，包括但不限于：
- 隐私保护法
- 知识产权法
- 商业使用许可

请勿将本项目用于任何违法或不道德的目的。
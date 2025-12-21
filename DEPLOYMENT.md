# 🚀 部署指南

## 快速部署到 Vercel

### 1. 准备工作

#### 注册账户
- [Vercel](https://vercel.com) - 免费部署
- [Supabase](https://supabase.com) - 数据库（可选）
- [Replicate](https://replicate.com) - AI API（可选）
- 第三方发卡平台（如面包多）- 支付（可选）

#### 获取 API 密钥
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Replicate
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 第三方支付（示例）
MANDUO_API_KEY=your-manduo-key
MANDUO_PRODUCT_ID=runner-glory-hd
```

### 2. 一键部署

#### 方法一：Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

#### 方法二：GitHub 集成
1. Fork 此项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase 服务角色密钥 |
| `REPLICATE_API_TOKEN` | `r8_...` | Replicate API 令牌 |
| `MANDUO_API_KEY` | `xxx` | 第三方支付 API 密钥 |
| `MANDUO_PRODUCT_ID` | `runner-glory-hd` | 产品 ID |

### 4. 数据库初始化

#### 使用 Supabase
```bash
# 安装 Supabase CLI
npm install supabase --save-dev

# 登录 Supabase
npx supabase login

# 链接项目
npx supabase link --project-ref your-project-ref

# 运行迁移
npx supabase db push

# 导入种子数据
npx supabase db reset
```

#### 手动创建表
在 Supabase 控制台中执行 SQL：

```sql
-- 执行 supabase/migrations/001_create_codes_table.sql 中的内容
-- 执行 supabase/seed.sql 中的内容
```

### 5. 测试部署

#### 本地测试
```bash
npm run dev
```

#### 生产测试
访问部署后的 URL，测试完整流程：
1. 首页加载 ✅
2. 上传头像 ✅
3. 选择模版 ✅
4. 生成图片 ✅
5. 兑换高清图 ✅

### 6. 域名配置（可选）

在 Vercel 中添加自定义域名：
1. 项目设置 → Domains
2. 添加域名
3. 配置 DNS 解析

### 7. 监控和维护

#### 性能监控
- Vercel Analytics - 内置性能监控
- 检查 API 调用频率
- 监控错误日志

#### 成本控制
- Replicate API: 约 $0.002/张
- Supabase: 免费额度足够
- Vercel: 免费额度足够

### 8. 故障排除

#### 常见问题
1. **构建失败**: 检查环境变量配置
2. **API 错误**: 确认 API 密钥有效
3. **图片生成失败**: 检查 Replicate 账户余额
4. **支付失败**: 确认第三方平台配置

#### 日志查看
```bash
# Vercel 日志
vercel logs

# 浏览器开发者工具
# 检查 Network 和 Console 标签
```

### 9. 扩展配置

#### 添加更多模版
1. 在 `public/templates/` 添加图片
2. 更新 `src/lib/templates.ts`
3. 测试新模版

#### 自定义支付
1. 修改 `src/lib/payment.ts`
2. 添加新的支付平台
3. 更新兑换码逻辑

#### 国际化
1. 添加 `src/app/[locale]` 路由
2. 使用 next-intl 库
3. 配置多语言内容

## 🎯 生产环境检查清单

- [ ] 环境变量配置完成
- [ ] 数据库连接正常
- [ ] API 密钥有效
- [ ] 支付平台配置完成
- [ ] 域名配置完成
- [ ] HTTPS 证书有效
- [ ] 移动端适配测试
- [ ] 性能测试通过
- [ ] 错误处理完善

## 📞 支持

如果部署过程中遇到问题，请：
1. 检查文档和错误日志
2. 在 GitHub Issues 中提问
3. 查看 Vercel/Supabase 官方文档

祝部署顺利！🎉

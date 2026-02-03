# 上架前检查清单

## 📋 必须完成的配置

### 1. 第三方登录凭证配置 ⚠️ 必需
在 `js/auth.js` 中替换以下占位符：

```javascript
oauthConfig: {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID',  // ← 替换为真实的 Google Client ID
        redirectUri: window.location.origin + '/callback'
    },
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID',  // ← 替换为真实的 Facebook App ID
        redirectUri: window.location.origin + '/callback'
    },
    apple: {
        clientId: 'YOUR_APPLE_CLIENT_ID',  // ← 替换为真实的 Apple Service ID
        redirectUri: window.location.origin + '/callback'
    },
    wechat: {
        appId: 'YOUR_WECHAT_APP_ID',  // ← 替换为真实的微信 AppID
        redirectUri: window.location.origin + '/callback'
    }
}
```

**配置指南：** 详见 [OAUTH_CONFIG.md](OAUTH_CONFIG.md)

---

### 2. 联系方式更新 ⚠️ 必需
替换以下文件中的占位符邮箱和链接：

#### privacy.html
```html
<!-- 第308行附近 -->
<li>邮箱：support@example.com（请替换为真实邮箱）</li>
<li>GitHub Issues：<a href="https://github.com/yourusername/chess/issues">提交反馈</a></li>
```

#### terms.html
```html
<!-- 第280行附近 -->
<li>邮箱：support@example.com（请替换为真实邮箱）</li>
<li>GitHub：<a href="https://github.com/yourusername/chess">项目主页</a></li>
```

---

### 3. Apple Developer 配置 🍎

#### 3.1 Sign in with Apple
1. 登录 [Apple Developer](https://developer.apple.com/)
2. Certificates, Identifiers & Profiles → Identifiers
3. 创建 App ID 并启用 "Sign in with Apple"
4. 创建 Service ID
5. 配置网站域名和返回 URL
6. 更新 `js/auth.js` 中的 `clientId`

#### 3.2 隐私政策 URL
在 App Store Connect 中填写：
```
https://yourdomain.com/privacy.html
```

#### 3.3 应用审核信息
准备以下信息：
- 测试账号（手机号/邮箱 + 密码）
- 应用截图（iPhone、iPad）
- 应用描述
- 关键词

---

### 4. Google Play Console 配置 🤖

#### 4.1 Data Safety 表单
在 Play Console → 应用内容 → Data Safety 填写：

**收集的数据：**
- [ ] 账号信息（邮箱/手机号）
- [ ] 用户生成内容（游戏战绩）

**数据使用：**
- [ ] 应用功能
- [ ] 个性化

**数据分享：**
- [ ] 不与第三方分享

**数据安全：**
- [ ] 传输加密（HTTPS）
- [ ] 用户可请求删除数据
- [ ] 数据仅存储在本地设备

#### 4.2 隐私政策 URL
```
https://yourdomain.com/privacy.html
```

#### 4.3 目标受众
- [ ] 所有年龄段（象棋游戏适合全年龄）

---

## ✅ 功能测试清单

### 注册功能
- [ ] 手机号注册（格式验证）
- [ ] 邮箱注册（格式验证）
- [ ] 密码长度限制（至少6位）
- [ ] 重复注册提示
- [ ] XSS 输入测试（输入 `<script>alert('test')</script>`）

### 登录功能
- [ ] 正确密码登录
- [ ] 错误密码提示
- [ ] 5次失败后锁定
- [ ] 15分钟后自动解锁
- [ ] 记住登录状态

### 第三方登录
- [ ] Google 登录
- [ ] Facebook 登录
- [ ] Apple 登录
- [ ] 微信登录（可选）

### 游戏功能
- [ ] 登录后战绩统计
- [ ] 胜/负/和局计数
- [ ] 悔棋功能
- [ ] 重新开始
- [ ] 皮肤切换

### 安全功能
- [ ] HTTPS 自动跳转（生产环境）
- [ ] 密码加密存储
- [ ] XSS 防护
- [ ] CSP 策略生效

---

## 🔍 安全审核清单

### Apple App Store
- [x] **2.5.2** - 密码使用 SHA-256 加密 ✅
- [x] **4.2.3** - 禁用不安全密码重置 ✅
- [x] **5.1.1** - 添加隐私政策链接 ✅
- [ ] **4.8** - 配置 Sign in with Apple ⚠️ 需配置
- [ ] **2.1** - 提供测试账号 ⚠️ 需准备

### Google Play
- [x] **用户数据** - 数据安全声明 ✅
- [x] **隐私政策** - 添加隐私政策 URL ✅
- [x] **目标受众** - 所有年龄段 ✅
- [ ] **Google 登录** - 配置 OAuth ⚠️ 需配置

---

## 📱 移动端测试清单

### iOS 测试
- [ ] Safari 浏览器测试
- [ ] 触摸操作流畅
- [ ] 登录界面适配
- [ ] 棋盘显示正常
- [ ] Apple 登录功能

### Android 测试
- [ ] Chrome 浏览器测试
- [ ] 触摸操作流畅
- [ ] 登录界面适配
- [ ] 棋盘显示正常
- [ ] Google 登录功能

### APK 打包测试
- [ ] 使用 Cordova 打包
- [ ] 安装到真机测试
- [ ] 离线功能正常
- [ ] 权限请求合理

---

## 🚀 部署清单

### 文件准备
- [x] `js/auth.js` - 认证逻辑 ✅
- [x] `privacy.html` - 隐私政策 ✅
- [x] `terms.html` - 用户协议 ✅
- [x] `SECURITY_FIX.md` - 安全文档 ✅
- [ ] 更新第三方凭证 ⚠️
- [ ] 更新联系邮箱 ⚠️

### 服务器配置
- [ ] HTTPS 证书配置
- [ ] 域名解析
- [ ] CDN 加速（可选）

### 应用商店提交
- [ ] Apple App Store Connect 创建应用
- [ ] Google Play Console 创建应用
- [ ] 填写应用信息
- [ ] 上传截图
- [ ] 提交审核

---

## 📞 紧急联系

如遇到审核拒绝，常见原因和解决方案：

### Apple 拒绝原因
1. **密码加密不足** → 已修复 ✅
2. **缺少隐私政策** → 已添加 ✅
3. **Sign in with Apple 未配置** → 需配置真实凭证
4. **测试账号无法登录** → 提供有效测试账号

### Google 拒绝原因
1. **Data Safety 未填写** → 填写数据安全表单
2. **隐私政策链接无效** → 确保链接可访问
3. **目标受众未声明** → 选择所有年龄段
4. **权限说明不清** → 本应用无特殊权限

---

## 📝 待办事项

### 高优先级（阻止上架）
- [ ] 配置 Google Client ID
- [ ] 配置 Apple Service ID
- [ ] 配置 Facebook App ID
- [ ] 更新联系邮箱
- [ ] 准备测试账号

### 中优先级（提升体验）
- [ ] 添加应用图标
- [ ] 优化加载速度
- [ ] 添加错误日志
- [ ] 国际化支持（英文）

### 低优先级（未来优化）
- [ ] 添加后端服务
- [ ] 跨设备同步
- [ ] 社交功能
- [ ] 排行榜

---

**检查完成后，即可提交审核！** 🎉

详细配置步骤：
- [OAUTH_CONFIG.md](OAUTH_CONFIG.md) - 第三方登录配置
- [AUTH_GUIDE.md](AUTH_GUIDE.md) - 认证系统使用
- [SECURITY_FIX.md](SECURITY_FIX.md) - 安全修复详情

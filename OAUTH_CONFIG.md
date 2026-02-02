# 第三方登录集成指南

本文档说明如何配置各个第三方登录平台。

## 1. Google 登录配置

### 1.1 获取 Google Client ID

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 将授权的 JavaScript 来源添加到允许列表（如：`http://localhost:8080`）
6. 将授权的重定向 URI 添加到允许列表

### 1.2 更新配置

在 `js/auth.js` 中更新：

```javascript
oauthConfig: {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/callback'
    }
}
```

### 1.3 添加 meta 标签

在 `index.html` 的 `<head>` 中添加：

```html
<meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
```

---

## 2. Facebook 登录配置

### 2.1 创建 Facebook 应用

1. 访问 [Facebook Developers](https://developers.facebook.com/)
2. 创建新应用
3. 在"设置" > "基本"中找到应用 ID
4. 添加 Facebook 登录产品
5. 在"设置"中配置有效 OAuth 重定向 URI

### 2.2 更新配置

在 `js/auth.js` 中更新：

```javascript
oauthConfig: {
    facebook: {
        appId: 'YOUR_FACEBOOK_APP_ID',
        redirectUri: window.location.origin + '/callback'
    }
}
```

### 2.3 初始化 SDK

SDK 已在 `auth.js` 中自动加载，会在页面加载时初始化。

---

## 3. Apple 登录配置

### 3.1 配置 Apple Developer

1. 访问 [Apple Developer](https://developer.apple.com/)
2. 创建 App ID 并启用"Sign In with Apple"
3. 创建 Service ID
4. 配置网站域名和返回 URL

### 3.2 更新配置

在 `js/auth.js` 中更新：

```javascript
oauthConfig: {
    apple: {
        clientId: 'YOUR_APPLE_SERVICE_ID',
        redirectUri: window.location.origin + '/callback'
    }
}
```

### 3.3 初始化 Apple ID

在页面加载后，Apple SDK 会自动初始化。

---

## 4. 微信登录配置

### 4.1 微信开放平台配置

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 创建网站应用
3. 填写应用信息并等待审核
4. 获取 AppID 和 AppSecret

### 4.2 更新配置

在 `js/auth.js` 中更新：

```javascript
oauthConfig: {
    wechat: {
        appId: 'YOUR_WECHAT_APP_ID',
        redirectUri: window.location.origin + '/callback'
    }
}
```

### 4.3 注意事项

- 微信登录需要在微信环境中使用，或者使用二维码扫码登录
- 需要后端服务器配合获取 access_token 和用户信息
- 建议集成微信 JS-SDK

---

## 5. 后端 API（可选）

如果您需要更安全的认证系统，建议创建后端 API：

### 5.1 推荐技术栈

- Node.js + Express
- Python + Flask/Django
- Java + Spring Boot
- PHP + Laravel

### 5.2 需要实现的 API 端点

```
POST /api/auth/register     - 用户注册
POST /api/auth/login        - 用户登录
POST /api/auth/logout       - 用户登出
POST /api/auth/reset        - 重置密码
GET  /api/auth/profile      - 获取用户信息
PUT  /api/auth/profile      - 更新用户信息

POST /api/auth/google       - Google 登录回调
POST /api/auth/facebook     - Facebook 登录回调
POST /api/auth/apple        - Apple 登录回调
POST /api/auth/wechat       - 微信登录回调
```

### 5.3 数据库表结构示例

```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    register_type VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    password VARCHAR(255),
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE game_stats (
    user_id VARCHAR(50) PRIMARY KEY,
    total_games INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 6. 安全建议

### 6.1 密码安全

当前版本使用简单的 Base64 编码，**仅用于演示**。生产环境请使用：

- bcrypt
- scrypt
- PBKDF2
- Argon2

### 6.2 HTTPS

生产环境必须使用 HTTPS，否则第三方登录无法正常工作。

### 6.3 CORS 配置

如果前后端分离，需要正确配置 CORS：

```javascript
// Express 示例
app.use(cors({
    origin: 'https://yourdomain.com',
    credentials: true
}));
```

### 6.4 Token 管理

建议使用 JWT（JSON Web Token）进行用户认证：

```javascript
// 登录成功后返回 token
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { /* 用户信息 */ }
}
```

---

## 7. 测试账号

为了方便测试，您可以使用以下方式：

### 7.1 本地存储测试

当前版本已实现本地存储功能，可以直接注册测试账号：

- 手机号：13800138000
- 邮箱：test@example.com
- 密码：test123

### 7.2 第三方登录测试

需要配置对应平台的测试账号和应用。

---

## 8. 部署清单

部署到生产环境前，请确保：

- [ ] 所有第三方 Client ID/App ID 已更新
- [ ] CSP（Content Security Policy）已正确配置
- [ ] 启用 HTTPS
- [ ] 密码加密算法已升级
- [ ] 配置了后端 API（可选但推荐）
- [ ] 测试所有登录方式
- [ ] 配置邮件/短信验证（可选）
- [ ] 设置错误监控和日志

---

## 9. 常见问题

### Q1: 第三方登录按钮无反应？

A: 检查浏览器控制台错误，确保 SDK 已正确加载，Client ID 配置正确。

### Q2: 跨域问题？

A: 确保在第三方平台配置了正确的域名白名单。

### Q3: 微信登录无法使用？

A: 微信登录需要在微信内置浏览器中使用，或使用二维码扫码方式。

### Q4: 如何实现邮箱验证？

A: 需要配置邮件服务（如 SendGrid、阿里云邮件推送），在后端发送验证邮件。

---

## 10. 更多资源

- [Google Identity Platform](https://developers.google.com/identity)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [微信开放平台](https://open.weixin.qq.com/)


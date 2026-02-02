# 用户认证系统使用指南

## 功能概述

本中国象棋项目已集成完整的用户认证系统，支持以下功能：

### ✅ 已实现的功能

1. **多种注册方式**
   - 📱 手机号注册
   - 📧 邮箱注册
   - 🍎 Apple ID 登录
   - 🔍 Google 登录
   - 👥 Facebook 登录
   - 💬 微信登录

2. **账号管理**
   - 用户登录/登出
   - 密码修改/重置
   - 用户信息展示

3. **游戏统计**
   - 自动记录胜/负/和局
   - 总游戏场次统计
   - 个人战绩展示

4. **本地存储**
   - 使用 localStorage 存储用户数据
   - 自动保持登录状态
   - 无需后端服务器即可使用

---

## 快速开始

### 1. 本地测试

直接打开 `index.html` 即可使用基础功能（手机号/邮箱注册）。

```bash
# 方法1：直接打开文件
open index.html

# 方法2：使用本地服务器（推荐）
python -m http.server 8080
# 或
python3 -m http.server 8080

# 然后访问：http://localhost:8080
```

### 2. 注册测试账号

1. 点击页面顶部的"注册"按钮
2. 选择注册方式（手机号或邮箱）
3. 输入账号和密码（至少6位）
4. 点击"注册"按钮

### 3. 登录

1. 点击"登录"按钮
2. 输入注册时的账号和密码
3. 点击"登录"

### 4. 开始游戏

登录后即可开始游戏，系统会自动记录战绩。

---

## 第三方登录配置

要启用第三方登录（Google、Facebook、Apple、微信），需要进行额外配置。

详细配置步骤请参考：[OAUTH_CONFIG.md](OAUTH_CONFIG.md)

### 配置步骤概览

1. **Google 登录**
   - 在 Google Cloud Console 创建项目
   - 获取 Client ID
   - 更新 `js/auth.js` 中的配置

2. **Facebook 登录**
   - 在 Facebook Developers 创建应用
   - 获取 App ID
   - 更新配置

3. **Apple 登录**
   - 在 Apple Developer 配置 Service ID
   - 更新配置

4. **微信登录**
   - 在微信开放平台注册应用
   - 获取 AppID
   - 更新配置（需要后端支持）

---

## 文件说明

### 新增文件

- `js/auth.js` - 用户认证核心模块
- `css/auth.css` - 认证界面样式
- `img/default-avatar.svg` - 默认用户头像
- `OAUTH_CONFIG.md` - 第三方登录配置文档
- `AUTH_GUIDE.md` - 本文档

### 修改文件

- `index.html` - 添加了登录/注册界面和模态框
- `js/play.js` - 游戏结束时更新用户统计

---

## 数据结构

### 用户对象

```javascript
{
    id: "user_1234567890",           // 唯一ID
    registerType: "email",            // 注册类型
    email: "user@example.com",        // 邮箱
    phone: "",                        // 手机号
    nickname: "用户昵称",              // 昵称
    avatar: "img/default-avatar.svg", // 头像
    createdAt: "2024-01-01T00:00:00Z",// 创建时间
    gameStats: {                      // 游戏统计
        totalGames: 10,               // 总场次
        wins: 6,                      // 胜利
        losses: 3,                    // 失败
        draws: 1                      // 和局
    }
}
```

### 本地存储

- `localStorage.users` - 所有用户列表（JSON数组）
- `localStorage.currentUser` - 当前登录用户（JSON对象，不含密码）

---

## API 接口

### auth 对象方法

```javascript
// 初始化认证系统
auth.init()

// 显示登录框
auth.showLoginModal()

// 显示注册框
auth.showRegisterModal()

// 登出
auth.logout()

// 更新游戏统计
auth.updateGameStats('win')   // 赢
auth.updateGameStats('loss')  // 输
auth.updateGameStats('draw')  // 和

// 获取当前用户
auth.currentUser

// 检查登录状态
auth.checkLoginStatus()
```

---

## 安全说明

⚠️ **重要提示**

当前版本使用简单的 Base64 编码存储密码，**仅用于演示和学习**。

**生产环境必须**：

1. ✅ 使用后端服务器
2. ✅ 使用安全的密码哈希算法（bcrypt、scrypt 等）
3. ✅ 启用 HTTPS
4. ✅ 实现邮箱/手机验证
5. ✅ 添加防暴力破解机制
6. ✅ 使用 JWT 或 Session 管理用户会话

---

## 移动端适配

认证系统已适配移动端：

- ✅ 响应式设计
- ✅ 触摸优化
- ✅ 防止页面缩放
- ✅ 适配不同屏幕尺寸

---

## 常见问题

### Q1: 数据存储在哪里？

A: 使用浏览器的 localStorage，数据仅存储在本地。

### Q2: 清除浏览器缓存后数据会丢失吗？

A: 是的，清除缓存会删除所有用户数据。生产环境建议使用后端数据库。

### Q3: 可以多设备同步吗？

A: 当前版本不支持。需要后端服务器实现多设备同步。

### Q4: 第三方登录按钮无响应？

A: 请检查：
1. 是否使用 HTTP 服务器访问（不能直接打开 file://）
2. 是否配置了对应平台的 Client ID/App ID
3. 浏览器控制台是否有错误信息

### Q5: 如何重置所有数据？

A: 打开浏览器控制台，执行：
```javascript
localStorage.clear()
location.reload()
```

### Q6: 可以导出用户数据吗？

A: 可以在控制台执行：
```javascript
console.log(JSON.parse(localStorage.getItem('users')))
```

---

## 升级到后端版本

如需使用后端数据库，建议：

### 推荐技术栈

**后端**：
- Node.js + Express + MongoDB
- Python + Django + PostgreSQL
- Java + Spring Boot + MySQL
- PHP + Laravel + MySQL

**前端修改**：
- 将 `auth.js` 中的本地存储替换为 API 调用
- 使用 fetch 或 axios 发送 HTTP 请求
- 实现 Token 认证（JWT）

### API 端点示例

```
POST   /api/auth/register      # 注册
POST   /api/auth/login         # 登录
POST   /api/auth/logout        # 登出
GET    /api/auth/profile       # 获取用户信息
PUT    /api/auth/profile       # 更新用户信息
POST   /api/auth/reset-password # 重置密码
PUT    /api/game/stats         # 更新游戏统计
```

---

## 贡献

欢迎提交问题和改进建议！

---

## 许可证

本项目遵循 MIT 许可证。

---

## 更新日志

### v2.0.0 (2024-02-02)

- ✨ 新增用户注册/登录功能
- ✨ 支持手机号和邮箱注册
- ✨ 集成 Google、Facebook、Apple、微信登录
- ✨ 添加密码修改功能
- ✨ 自动记录游戏战绩
- 🎨 优化用户界面
- 📱 完善移动端适配

---

## 联系方式

如有问题，欢迎联系：
- 原作者 QQ: 28701884

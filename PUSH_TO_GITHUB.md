# 推送项目到GitHub - ChineseChess

## 📋 前提条件

✅ 代码已全部提交（最新提交：feat: add user authentication system）
✅ GitHub CLI 已安装
❌ 需要登录GitHub CLI

---

## 🚀 方法1：使用GitHub CLI（推荐）

### 步骤1：登录GitHub CLI

```bash
gh auth login
```

按提示选择：
1. GitHub.com
2. HTTPS
3. Yes (authenticate Git with GitHub credentials)
4. Login with a web browser（推荐）或 Paste an authentication token

### 步骤2：创建新仓库并推送

```bash
# 在当前目录创建GitHub仓库
gh repo create ChineseChess --public --source=. --remote=chinesechess --push

# 或者创建私有仓库
# gh repo create ChineseChess --private --source=. --remote=chinesechess --push
```

这个命令会：
- ✅ 在您的GitHub账户下创建名为ChineseChess的仓库
- ✅ 添加名为chinesechess的远程仓库
- ✅ 自动推送所有代码到新仓库

### 步骤3：验证

```bash
# 查看远程仓库
git remote -v

# 访问仓库
gh repo view --web
```

---

## 🔧 方法2：手动创建（传统方式）

### 步骤1：在GitHub网页上创建仓库

1. 访问：https://github.com/new
2. 仓库名称：`ChineseChess`
3. 选择Public或Private
4. ⚠️ **不要勾选**"Initialize this repository with a README"
5. 点击"Create repository"

### 步骤2：添加远程仓库并推送

```bash
# 添加新的远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add chinesechess https://github.com/YOUR_USERNAME/ChineseChess.git

# 推送代码
git push chinesechess master

# 推送所有分支和标签
git push chinesechess --all
git push chinesechess --tags
```

### 步骤3：设置为默认远程仓库（可选）

如果您想将ChineseChess设为主仓库：

```bash
# 查看当前用户名
git config user.name

# 重命名origin为old-origin
git remote rename origin old-origin

# 将chinesechess设为新的origin
git remote rename chinesechess origin

# 设置默认上游分支
git branch --set-upstream-to=origin/master master
```

---

## 📝 快速执行（复制粘贴）

### 使用GitHub CLI（需先登录）

```bash
# 1. 登录GitHub
gh auth login

# 2. 创建并推送（公开仓库）
cd /Users/macbookpro/game/Chess
gh repo create ChineseChess --public --source=. --remote=chinesechess --push

# 3. 在浏览器中打开
gh repo view --web
```

### 手动方式（需先在GitHub创建仓库）

```bash
# 1. 添加远程仓库（替换YOUR_USERNAME）
cd /Users/macbookpro/game/Chess
git remote add chinesechess https://github.com/YOUR_USERNAME/ChineseChess.git

# 2. 推送代码
git push chinesechess master --tags

# 3. 验证
git remote -v
```

---

## ✅ 验证清单

推送完成后，检查以下内容：

- [ ] 仓库已在GitHub上创建
- [ ] 所有代码文件都已推送
- [ ] 新增的认证系统文件都存在：
  - [ ] js/auth.js
  - [ ] css/auth.css
  - [ ] AUTH_GUIDE.md
  - [ ] OAUTH_CONFIG.md
  - [ ] demo.html
  - [ ] INTEGRATION_SUMMARY.md
- [ ] README.md 显示v2.0.0更新
- [ ] 提交历史完整

---

## 🔄 后续操作

### 更新README

建议在GitHub仓库中更新README.md的Demo链接：

```markdown
Demo：https://YOUR_USERNAME.github.io/ChineseChess/
```

### 启用GitHub Pages（可选）

1. 进入仓库Settings
2. 找到Pages
3. Source选择：Deploy from a branch
4. Branch选择：master / (root)
5. 点击Save

几分钟后，项目将发布到：
`https://YOUR_USERNAME.github.io/ChineseChess/`

### 设置仓库描述

```bash
gh repo edit --description "🎮 中国象棋 - 支持AI对弈、多种登录方式、战绩统计的HTML5象棋游戏"
gh repo edit --add-topic html5,canvas,chinese-chess,game,ai,authentication
```

---

## 🆘 常见问题

### Q1: push被拒绝（rejected）

```bash
# 强制推送（谨慎使用）
git push chinesechess master --force
```

### Q2: 提示权限不足

确保您有该仓库的写权限，或使用SSH方式：

```bash
# 改用SSH（需先配置SSH key）
git remote set-url chinesechess git@github.com:YOUR_USERNAME/ChineseChess.git
```

### Q3: 查看当前用户

```bash
gh auth status
git config user.name
```

### Q4: 删除远程仓库引用

```bash
git remote remove chinesechess
```

---

## 📚 相关文档

- [GitHub CLI 官方文档](https://cli.github.com/manual/)
- [Git 远程仓库管理](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E7%9A%84%E4%BD%BF%E7%94%A8)
- [GitHub Pages 文档](https://docs.github.com/en/pages)

---

**立即开始**：先执行 `gh auth login` 登录GitHub！

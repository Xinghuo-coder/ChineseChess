# 默认头像图片说明

## 添加默认头像

为了完整支持用户系统，请在 `img/` 目录下添加一个默认头像图片：

### 方法1：使用在线头像生成器

1. 访问以下网站生成头像：
   - https://ui-avatars.com/
   - https://avatar.tobi.sh/
   - https://robohash.org/

2. 下载头像图片并保存为 `img/default-avatar.png`

### 方法2：使用 SVG 占位符

创建 `img/default-avatar.svg`：

```svg
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#667eea"/>
  <circle cx="50" cy="40" r="15" fill="white"/>
  <ellipse cx="50" cy="75" rx="25" ry="20" fill="white"/>
</svg>
```

### 方法3：使用临时占位符

如果暂时没有头像图片，系统会使用浏览器默认的"图片加载失败"图标，不影响功能使用。

建议头像尺寸：
- 推荐：200x200 像素
- 最小：100x100 像素
- 格式：PNG、JPG 或 SVG

## 用户上传头像（高级功能）

如需支持用户上传自定义头像，需要：

1. 后端服务器存储
2. 图片处理库（裁剪、压缩）
3. OSS 对象存储服务（阿里云、七牛云等）

示例代码将在后续版本中提供。
